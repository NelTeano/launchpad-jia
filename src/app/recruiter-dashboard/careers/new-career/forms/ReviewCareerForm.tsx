'use client'
import React from 'react';

interface ReviewCareerFormProps {
    career?: any;
    jobTitle?: string;
    description?: string;
    employmentType?: string;
    workSetup?: string;
    country?: string;
    province?: string;
    city?: string;
    salaryNegotiable?: boolean;
    minimumSalary?: string;
    maximumSalary?: string;
    screeningSetting?: string;
    secretPrompt?: string;
    preScreeningQuestions?: any[];
    interviewScreeningSetting?: string;
    requireVideo?: boolean;
    interviewQuestions?: any[];
}

export default function ReviewCareerForm({
    career,
    jobTitle = "Software Engineer - Java",
    description = "<p>We are seeking a talented and driven Software Engineer...</p>",
    employmentType = "Full-Time",
    workSetup = "Hybrid",
    country = "Philippines",
    province = "Metro Manila",
    city = "Pasig City",
    salaryNegotiable = true,
    minimumSalary = "",
    maximumSalary = "",
    screeningSetting = "Good Fit and above",
    secretPrompt = "",
    preScreeningQuestions = [
        {
            id: 1,
            question: "How long is your notice period?",
            type: "Dropdown",
            options: ["< 30 days", "> 30 days"]
        },
        {
            id: 2,
            question: "How often are you willing to report to the office?",
            type: "Dropdown",
            options: ["At most 1-2x a week", "At most 3-4x a week", "Open to fully onsite work", "Only open to fully remote work"]
        },
        {
            id: 3,
            question: "How much is your expected monthly salary?",
            type: "Range",
            minValue: "40000",
            maxValue: "60000",
            rangeUnit: "PHP"
        }
    ],
    interviewScreeningSetting = "Good Fit and above",
    requireVideo = true,
    interviewQuestions = [
        {
            id: 1,
            category: "CV Validation / Experience",
            questionCountToAsk: 2,
            questions: [
                { id: "q1", question: "What specific experience do you have with Java solutions, and how have you applied that in previous roles?" },
                { id: "q2", question: "Describe your experiences with Java. Can you provide an example of a complex query you have worked on?" }
            ]
        },
        {
            id: 2,
            category: "Technical",
            questionCountToAsk: 4,
            questions: [
                { id: "q3", question: "Can you explain how you would approach developing a custom API for integrating Java with a third-party system?" },
                { id: "q4", question: "How do you ensure that your code is optimized for performance and scalability?" }
            ]
        },
        {
            id: 3,
            category: "Behavioral",
            questionCountToAsk: 3,
            questions: [
                { id: "q5", question: "Can you describe a situation where you faced an ethical dilemma in a project? How did you handle it?" },
                { id: "q6", question: "Tell us about a time when you had to take responsibility for a mistake in your work. What did you learn from it?" }
            ]
        }
    ]
}: ReviewCareerFormProps) {
    
    const totalInterviewQuestions = interviewQuestions?.reduce((acc, group) => acc + group.questions.length, 0) || 0;

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Career Details Section */}
                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-suitcase" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>Career Details & Team Access</span>
                        </div>
                        
                        <div className="layered-card-content">
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Job Title</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>{jobTitle}</span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Employment Type</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>{employmentType}</span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Work Arrangement</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>{workSetup}</span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Country</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>{country}</span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>State / Province</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>{province}</span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>City</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>{city}</span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Minimum Salary</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>
                                        {salaryNegotiable ? "Negotiable" : (minimumSalary ? `PHP ${minimumSalary}` : "Not specified")}
                                    </span>
                                </div>

                                <div>
                                    <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Maximum Salary</span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>
                                        {salaryNegotiable ? "Negotiable" : (maximumSalary ? `PHP ${maximumSalary}` : "Not specified")}
                                    </span>
                                </div>
                            </div>

                            <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />

                            <div>
                                <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 8 }}>Job Description</span>
                                <div 
                                    style={{ 
                                        fontSize: 14, 
                                        color: "#181D27", 
                                        lineHeight: "1.6",
                                        padding: "12px",
                                        backgroundColor: "#F8F9FA",
                                        borderRadius: 8,
                                        maxHeight: "300px",
                                        overflow: "auto"
                                    }}
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CV Review & Pre-Screening Section */}
                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-file-alt" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>CV Review & Pre-Screening Questions</span>
                        </div>
                        
                        <div className="layered-card-content">
                            <div style={{ marginBottom: 20 }}>
                                <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>CV Screening</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>
                                        Automatically endorse candidates who are
                                    </span>
                                    <span style={{
                                        padding: "4px 12px",
                                        backgroundColor: "#039855",
                                        color: "#fff",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        fontWeight: 600
                                    }}>
                                        {screeningSetting}
                                    </span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>and above</span>
                                </div>
                            </div>

                            {secretPrompt && (
                                <>
                                    <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />
                                    <div>
                                        <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 8 }}>CV Secret Prompt</span>
                                        <div style={{ 
                                            padding: "12px",
                                            backgroundColor: "#F8F9FA",
                                            borderRadius: 8,
                                            fontSize: 14,
                                            color: "#181D27",
                                            whiteSpace: "pre-wrap"
                                        }}>
                                            {secretPrompt}
                                        </div>
                                    </div>
                                </>
                            )}

                            {preScreeningQuestions && preScreeningQuestions.length > 0 && (
                                <>
                                    <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                            <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>Pre-Screening Questions</span>
                                            <div style={{
                                                backgroundColor: "#E9EAEB",
                                                borderRadius: "50%",
                                                width: 24,
                                                height: 24,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 12,
                                                fontWeight: 600,
                                                color: "#181D27"
                                            }}>
                                                {preScreeningQuestions.length}
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                            {preScreeningQuestions.map((q, index) => (
                                                <div key={q.id} style={{
                                                    padding: 16,
                                                    border: "1px solid #E9EAEB",
                                                    borderRadius: 8,
                                                    backgroundColor: "#F8F9FA"
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                                                        <span style={{ 
                                                            minWidth: 24, 
                                                            height: 24,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#181D27",
                                                            color: "#fff",
                                                            borderRadius: "50%",
                                                            fontSize: 12,
                                                            fontWeight: 600
                                                        }}>
                                                            {index + 1}
                                                        </span>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 8 }}>
                                                                {q.question}
                                                            </div>
                                                            <span style={{
                                                                fontSize: 12,
                                                                color: "#6c757d",
                                                                padding: "2px 8px",
                                                                backgroundColor: "#fff",
                                                                borderRadius: 4,
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                gap: 4
                                                            }}>
                                                                <i className={
                                                                    q.type === "Dropdown" ? "la la-chevron-down" : 
                                                                    q.type === "Multiple Choice" ? "la la-check-square" : 
                                                                    q.type === "Range" ? "la la-arrows-alt-h" :
                                                                    q.type === "Yes/No" ? "la la-check-circle" :
                                                                    "la la-font"
                                                                }></i>
                                                                {q.type}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {(q.type === "Dropdown" || q.type === "Multiple Choice") && q.options && q.options.length > 0 && (
                                                        <div style={{ marginTop: 12, marginLeft: 32 }}>
                                                            {q.options.map((option, optIndex) => (
                                                                <div key={optIndex} style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    gap: 8,
                                                                    padding: "6px 12px",
                                                                    backgroundColor: "#fff",
                                                                    borderRadius: 6,
                                                                    marginBottom: 6,
                                                                    fontSize: 13
                                                                }}>
                                                                    <span style={{ color: "#6c757d", minWidth: 20 }}>{optIndex + 1}.</span>
                                                                    <span>{option}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {q.type === "Range" && (
                                                        <div style={{ 
                                                            marginTop: 12,
                                                            marginLeft: 32,
                                                            padding: "12px", 
                                                            backgroundColor: "#fff", 
                                                            borderRadius: 6,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 8,
                                                            fontSize: 14
                                                        }}>
                                                            <span style={{ color: "#6c757d" }}>Range:</span>
                                                            <span style={{ fontWeight: 600 }}>{q.minValue || "0"}</span>
                                                            <span style={{ color: "#6c757d" }}>to</span>
                                                            <span style={{ fontWeight: 600 }}>{q.maxValue || "∞"}</span>
                                                            {q.rangeUnit && (
                                                                <span style={{ color: "#6c757d" }}>({q.rangeUnit})</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Interview Setup Section */}
                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-microphone" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>AI Interview Setup</span>
                        </div>
                        
                        <div className="layered-card-content">
                            <div style={{ marginBottom: 20 }}>
                                <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>AI Interview Screening</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>
                                        Automatically endorse candidates who are
                                    </span>
                                    <span style={{
                                        padding: "4px 12px",
                                        backgroundColor: "#039855",
                                        color: "#fff",
                                        borderRadius: 6,
                                        fontSize: 14,
                                        fontWeight: 600
                                    }}>
                                        {interviewScreeningSetting}
                                    </span>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>and above</span>
                                </div>
                            </div>

                            <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />

                            <div style={{ marginBottom: 20 }}>
                                <span style={{ fontSize: 14, color: "#6c757d", display: "block", marginBottom: 4 }}>Require Video on Interview</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <i className="la la-video" style={{ color: "#181D27", fontSize: 20 }}></i>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 600 }}>
                                        {requireVideo ? "Yes - Video recording required" : "No - Video recording not required"}
                                    </span>
                                </div>
                            </div>

                            <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />

                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                    <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>AI Interview Secret Prompt</span>
                                </div>
                                
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {interviewQuestions && interviewQuestions.map((group, groupIndex) => (
                                        group.questions.length > 0 && (
                                            <div key={group.id} style={{
                                                padding: 16,
                                                border: "1px solid #E9EAEB",
                                                borderRadius: 8,
                                                backgroundColor: "#F8F9FA"
                                            }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ fontSize: 16, fontWeight: 700, color: "#181D27" }}>
                                                            {group.category}
                                                        </span>
                                                        <div style={{
                                                            backgroundColor: "#181D27",
                                                            color: "#fff",
                                                            borderRadius: "50%",
                                                            width: 24,
                                                            height: 24,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: 12,
                                                            fontWeight: 600
                                                        }}>
                                                            {group.questions.length}
                                                        </div>
                                                    </div>
                                                    {group.questionCountToAsk && (
                                                        <span style={{
                                                            fontSize: 13,
                                                            color: "#6c757d",
                                                            padding: "4px 10px",
                                                            backgroundColor: "#fff",
                                                            borderRadius: 6,
                                                            border: "1px solid #E9EAEB"
                                                        }}>
                                                            <i className="la la-random" style={{ marginRight: 4 }}></i>
                                                            Ask {group.questionCountToAsk} of {group.questions.length}
                                                        </span>
                                                    )}
                                                </div>

                                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                    {group.questions.map((question, qIndex) => (
                                                        <div key={question.id} style={{
                                                            display: "flex",
                                                            gap: 8,
                                                            padding: "10px 12px",
                                                            backgroundColor: "#fff",
                                                            borderRadius: 6,
                                                            alignItems: "flex-start"
                                                        }}>
                                                            <span style={{ 
                                                                minWidth: 24,
                                                                color: "#6c757d",
                                                                fontWeight: 600,
                                                                fontSize: 13
                                                            }}>
                                                                {qIndex + 1}.
                                                            </span>
                                                            <span style={{ 
                                                                fontSize: 14, 
                                                                color: "#181D27",
                                                                lineHeight: "1.5"
                                                            }}>
                                                                {question.question}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>

                                {(!interviewQuestions || interviewQuestions.every(g => g.questions.length === 0)) && (
                                    <div style={{ 
                                        padding: "20px",
                                        textAlign: "center",
                                        color: "#6c757d",
                                        backgroundColor: "#F8F9FA",
                                        borderRadius: 8
                                    }}>
                                        No interview questions added yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="layered-card-outer">
                    <div className="layered-card-middle" style={{ backgroundColor: "#F0F7FF" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#5E72E4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-check-circle" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>Summary</span>
                        </div>
                        
                        <div className="layered-card-content">
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                                <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: 8 }}>
                                    <div style={{ fontSize: 32, fontWeight: 700, color: "#5E72E4", marginBottom: 4 }}>
                                        {preScreeningQuestions?.length || 0}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#6c757d" }}>Pre-screening Questions</div>
                                </div>
                                <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: 8 }}>
                                    <div style={{ fontSize: 32, fontWeight: 700, color: "#5E72E4", marginBottom: 4 }}>
                                        {totalInterviewQuestions}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#6c757d" }}>Interview Questions</div>
                                </div>
                                <div style={{ textAlign: "center", padding: "16px", backgroundColor: "#fff", borderRadius: 8 }}>
                                    <div style={{ fontSize: 32, fontWeight: 700, color: "#5E72E4", marginBottom: 4 }}>
                                        {interviewQuestions?.filter(g => g.questions.length > 0).length || 0}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#6c757d" }}>Question Categories</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}