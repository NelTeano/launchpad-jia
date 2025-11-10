import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

// XSS Sanitization utility functions
const sanitizeString = (str: string): string => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeObject = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

// Enhanced HTML sanitization for rich text fields
const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return html;
  
  // List of allowed tags (safe formatting tags from the RichTextEditor)
  const allowedTags = ['strong', 'b', 'em', 'i', 'u', 's', 'ol', 'ul', 'li', 'br', 'p', 'div', 'span'];
  
  // List of allowed attributes (if any - currently none needed for basic formatting)
  const allowedAttributes: string[] = [];
  
  // Remove all script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove all style tags and their content
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove all iframe tags
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove all object and embed tags
  html = html.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');
  
  // Remove all event handlers (onclick, onload, onerror, etc.)
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocols
  html = html.replace(/javascript:/gi, '');
  
  // Remove data: protocols (potential XSS vector)
  html = html.replace(/data:text\/html/gi, '');
  
  // Remove vbscript: protocols
  html = html.replace(/vbscript:/gi, '');
  
  // Remove any tags that are not in the allowed list
  html = html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    const tagLower = tag.toLowerCase();
    
    // If tag is allowed, keep it but strip all attributes
    if (allowedTags.includes(tagLower)) {
      // For closing tags, keep as is
      if (match.startsWith('</')) {
        return `</${tagLower}>`;
      }
      // For opening tags, remove all attributes
      return `<${tagLower}>`;
    }
    
    // Remove disallowed tags
    return '';
  });
  
  // Remove any remaining attribute-like patterns that might have slipped through
  html = html.replace(/\s+[a-z\-]+\s*=\s*["'][^"']*["']/gi, '');
  html = html.replace(/\s+[a-z\-]+\s*=\s*[^\s>]*/gi, '');
  
  // Remove HTML comments (can be used for XSS)
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove any XML/XHTML processing instructions
  html = html.replace(/<\?[\s\S]*?\?>/g, '');
  
  return html;
};

// Validate and sanitize specific fields
const validateAndSanitizeCareerData = (data: any): any => {
  const sanitized = { ...data };
  
  // Sanitize text fields
  if (sanitized.jobTitle) {
    sanitized.jobTitle = sanitizeString(sanitized.jobTitle);
  }
  
  if (sanitized.workSetupRemarks) {
    sanitized.workSetupRemarks = sanitizeString(sanitized.workSetupRemarks);
  }
  
  if (sanitized.location) {
    sanitized.location = sanitizeString(sanitized.location);
  }
  
  if (sanitized.country) {
    sanitized.country = sanitizeString(sanitized.country);
  }
  
  if (sanitized.province) {
    sanitized.province = sanitizeString(sanitized.province);
  }
  
  if (sanitized.city) {
    sanitized.city = sanitizeString(sanitized.city);
  }
  
  // Sanitize HTML content (job description) - ENHANCED VERSION
  if (sanitized.description) {
    sanitized.description = sanitizeHTML(sanitized.description);
  }
  
  // Sanitize secret prompt
  if (sanitized.secretPrompt) {
    sanitized.secretPrompt = sanitizeString(sanitized.secretPrompt);
  }
  
  // Sanitize pre-screening questions
  if (sanitized.preScreeningQuestions && Array.isArray(sanitized.preScreeningQuestions)) {
    sanitized.preScreeningQuestions = sanitized.preScreeningQuestions.map((q: any) => ({
      ...q,
      questionType: q.questionType ? sanitizeString(q.questionType) : q.questionType,
      question: q.question ? sanitizeString(q.question) : q.question,
      questionFormat: q.questionFormat ? sanitizeString(q.questionFormat) : q.questionFormat,
      rangeUnit: q.rangeUnit ? sanitizeString(q.rangeUnit) : q.rangeUnit,
      answers: q.answers && Array.isArray(q.answers) 
        ? q.answers.map((a: any) => ({
            ...a,
            value: a.value ? sanitizeString(a.value) : a.value,
            type: a.type ? sanitizeString(a.type) : a.type
          }))
        : q.answers
    }));
  }
  
  // Sanitize interview questions
  if (sanitized.questions && Array.isArray(sanitized.questions)) {
    sanitized.questions = sanitized.questions.map((group: any) => ({
      ...group,
      category: group.category ? sanitizeString(group.category) : group.category,
      questions: group.questions && Array.isArray(group.questions)
        ? group.questions.map((q: any) => ({
            ...q,
            question: q.question ? sanitizeString(q.question) : q.question
          }))
        : group.questions
    }));
  }
  
  // Sanitize user info
  if (sanitized.lastEditedBy) {
    sanitized.lastEditedBy = {
      ...sanitized.lastEditedBy,
      name: sanitized.lastEditedBy.name ? sanitizeString(sanitized.lastEditedBy.name) : sanitized.lastEditedBy.name,
      email: sanitized.lastEditedBy.email ? sanitizeString(sanitized.lastEditedBy.email) : sanitized.lastEditedBy.email
    };
  }
  
  if (sanitized.createdBy) {
    sanitized.createdBy = {
      ...sanitized.createdBy,
      name: sanitized.createdBy.name ? sanitizeString(sanitized.createdBy.name) : sanitized.createdBy.name,
      email: sanitized.createdBy.email ? sanitizeString(sanitized.createdBy.email) : sanitized.createdBy.email
    };
  }
  
  // Sanitize step information
  if (sanitized.accomplishedStep) {
    sanitized.accomplishedStep = {
      ...sanitized.accomplishedStep,
      name: sanitized.accomplishedStep.name ? sanitizeString(sanitized.accomplishedStep.name) : sanitized.accomplishedStep.name
    };
  }
  
  return sanitized;
};

export async function POST(request: Request) {
  try {
    let requestData = await request.json();
    const { _id, ...careerData } = requestData;

    // Sanitize all input data to prevent XSS
    const sanitizedCareerData = validateAndSanitizeCareerData(careerData);

    const { db } = await connectMongoDB();

    // Check if this is an update or create operation
    if (_id) {
      // UPDATE existing career
      console.log("Updating existing career with _id:", _id);
      
      // Validate ObjectId format
      if (!ObjectId.isValid(_id)) {
        return NextResponse.json(
          { error: "Invalid career ID format" },
          { status: 400 }
        );
      }
      
      const result = await db
        .collection("careers")
        .updateOne(
          { _id: new ObjectId(_id) }, 
          { 
            $set: {
              ...sanitizedCareerData,
              updatedAt: new Date().toISOString()
            }
          }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: "Career not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Career updated successfully",
        career: { 
          _id, 
          ...sanitizedCareerData 
        },
      });
    } else {
      // CREATE new career
      console.log("Creating new career");
      
      const newCareer = {
        ...sanitizedCareerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString(),
      };

      const result = await db
        .collection("careers")
        .insertOne(newCareer);

      return NextResponse.json({
        message: "Career created successfully",
        career: { 
          _id: result.insertedId.toString(),
          ...newCareer 
        },
      });
    }
  } catch (error) {
    console.error("Error managing career:", error);
    return NextResponse.json(
      { error: "Failed to manage career", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}