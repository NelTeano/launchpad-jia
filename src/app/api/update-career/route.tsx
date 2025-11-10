import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongoDB/mongoDB";
import { ObjectId } from "mongodb";

// Minimal XSS Sanitization - Only remove dangerous XSS tags and attributes
const sanitizeHTML = (html: string): string => {
  if (typeof html !== 'string') return html;
  
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove iframe tags (XSS vector)
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove object and embed tags (XSS vector)
  html = html.replace(/<(object|embed)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '');
  
  // Remove all event handlers (onclick, onload, onerror, etc.) - only when part of HTML attributes
  html = html.replace(/(<[^>]+)\s+on\w+\s*=\s*["'][^"']*["']/gi, '$1');
  html = html.replace(/(<[^>]+)\s+on\w+\s*=\s*[^\s>]+/gi, '$1');
  
  // Remove javascript: protocols in href/src attributes
  html = html.replace(/(href|src)\s*=\s*["']javascript:[^"']*["']/gi, '');
  
  // Remove vbscript: protocols in href/src attributes
  html = html.replace(/(href|src)\s*=\s*["']vbscript:[^"']*["']/gi, '');
  
  // Remove data:text/html in src attributes (potential XSS vector)
  html = html.replace(/(src)\s*=\s*["']data:text\/html[^"']*["']/gi, '');
  
  return html;
};

// Validate and sanitize only XSS-dangerous fields
const validateAndSanitizeCareerData = (data: any): any => {
  const sanitized = { ...data };
  
  // Only sanitize HTML content fields for XSS
  if (sanitized.description) {
    sanitized.description = sanitizeHTML(sanitized.description);
  }
  
  // Sanitize any other rich text fields if they exist
  if (sanitized.requirements) {
    sanitized.requirements = sanitizeHTML(sanitized.requirements);
  }
  
  if (sanitized.benefits) {
    sanitized.benefits = sanitizeHTML(sanitized.benefits);
  }
  
  // Keep all other fields as-is, no sanitization needed for plain text inputs
  return sanitized;
};

export async function POST(request: Request) {
  try {
    let requestData = await request.json();
    const { _id, ...careerData } = requestData;

    // Only sanitize XSS-dangerous content
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