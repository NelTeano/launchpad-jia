'use client'
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import React, { useState } from 'react';

export default function PreScreeningForm({
    career,
    screeningSetting,
    setScreeningSetting,
    secretPrompt,
    setSecretPrompt,
    preScreeningQuestions,
    setPreScreeningQuestions,
}: {
    career?: any;
    screeningSetting: string;
    setScreeningSetting: (val: string) => void;
    secretPrompt: string;
    setSecretPrompt: (val: string) => void;
    preScreeningQuestions: any[];
    setPreScreeningQuestions: (val: any[]) => void;
}) {
    // Remove duplicate state declarations - only keep modal states
    const [showAddCustomModal, setShowAddCustomModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const screeningSettingList = [
        {
            name: "Good Fit and above",
            icon: "la la-check",
        },
        {
            name: "Only Strong Fit",
            icon: "la la-check-double",
        },
        {
            name: "No Automatic Promotion",
            icon: "la la-times",
        },
    ];

    const questionTypeOptions = [
        { name: "Text" },
        { name: "Dropdown" },
        { name: "Multiple Choice" },
        { name: "Yes/No" },
        { name: "Range" },
    ];

    const suggestedQuestions = [
        {
            title: "Notice Period",
            question: "How long is your notice period?",
            type: "Dropdown",
            options: ["Immediately", "< 30 days", "> 30 days"]
        },
        {
            title: "Work Setup",
            question: "How often are you willing to report to the office each week?",
            type: "Dropdown",
            options: ["Fully Remote", "1-2 days", "3-4 days", "5 days"]
        },
        {
            title: "Asking Salary",
            question: "How much is your expected monthly salary?",
            type: "Text",
            options: []
        }
    ];

    const handleAddSuggestedQuestion = (suggested) => {
        setPreScreeningQuestions([
            ...preScreeningQuestions,
            {
                id: Date.now(),
                title: suggested.title,
                question: suggested.question,
                type: suggested.type,
                options: [...suggested.options],
                required: true
            }
        ]);
    };

    const handleAddCustomQuestion = (questionData) => {
        if (editingQuestion) {
            setPreScreeningQuestions(
                preScreeningQuestions.map(q =>
                    q.id === editingQuestion.id ? { ...questionData, id: editingQuestion.id } : q
                )
            );
            setEditingQuestion(null);
        } else {
            setPreScreeningQuestions([
                ...preScreeningQuestions,
                {
                    ...questionData,
                    id: Date.now()
                }
            ]);
        }
        setShowAddCustomModal(false);
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setShowAddCustomModal(true);
    };

    const handleRemoveQuestion = (id) => {
        setPreScreeningQuestions(preScreeningQuestions.filter(q => q.id !== id));
    };

    const CustomQuestionModal = () => {
        const [questionText, setQuestionText] = useState(editingQuestion?.question || "");
        const [questionType, setQuestionType] = useState(editingQuestion?.type || "Text");
        const [options, setOptions] = useState(editingQuestion?.options || []);
        const [newOption, setNewOption] = useState("");
        const [minValue, setMinValue] = useState(editingQuestion?.minValue || "");
        const [maxValue, setMaxValue] = useState(editingQuestion?.maxValue || "");
        const [rangeUnit, setRangeUnit] = useState(editingQuestion?.rangeUnit || "");

        const handleAddOption = () => {
            if (newOption.trim()) {
                setOptions([...options, newOption.trim()]);
                setNewOption("");
            }
        };

        const handleRemoveOption = (index) => {
            setOptions(options.filter((_, i) => i !== index));
        };

        const handleSave = () => {
            if (questionText.trim()) {
                const questionData = {
                    question: questionText,
                    type: questionType,
                    options: (questionType === "Dropdown" || questionType === "Multiple Choice") ? options : [],
                    required: true
                };
                
                if (questionType === "Range") {
                    questionData.minValue = minValue;
                    questionData.maxValue = maxValue;
                    questionData.rangeUnit = rangeUnit;
                }
                
                handleAddCustomQuestion(questionData);
            }
        };

        if (!showAddCustomModal) return null;

        return (
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 24,
                    width: "90%",
                    maxWidth: 600,
                    maxHeight: "80vh",
                    overflow: "auto"
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <h3 style={{ margin: 0 }}>{editingQuestion ? "Edit Question" : "Add Custom Question"}</h3>
                        <button
                            onClick={() => {
                                setShowAddCustomModal(false);
                                setEditingQuestion(null);
                            }}
                            style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Question</label>
                            <input
                                className="form-control"
                                placeholder="Enter your question..."
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Question Type</label>
                            <CustomDropdown
                                onSelectSetting={(type) => setQuestionType(type)}
                                screeningSetting={questionType}
                                settingList={questionTypeOptions}
                                placeholder="Select Type"
                            />
                        </div>

                        {(questionType === "Dropdown" || questionType === "Multiple Choice") && (
                            <div>
                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Options</label>
                                {options.map((option, index) => (
                                    <div key={index} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                                        <span style={{ width: 30, textAlign: "center", color: "#6c757d" }}>{index + 1}</span>
                                        <input
                                            className="form-control"
                                            value={option}
                                            readOnly
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            onClick={() => handleRemoveOption(index)}
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: "#dc3545",
                                                cursor: "pointer",
                                                fontSize: 20
                                            }}
                                        >
                                            <i className="la la-times"></i>
                                        </button>
                                    </div>
                                ))}
                                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                    <input
                                        className="form-control"
                                        placeholder="Add option..."
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddOption();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleAddOption}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#5E72E4",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 8,
                                            cursor: "pointer"
                                        }}
                                    >
                                        <i className="la la-plus"></i> Add
                                    </button>
                                </div>
                            </div>
                        )}

                        {questionType === "Range" && (
                            <div>
                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Range Configuration</label>
                                <div style={{ display: "flex", flexDirection: "row", gap: 8, width: "100%", marginBottom: 12 }}>  
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>    
                                        <span style={{ fontSize: 14 }}>Minimum Value</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="0"
                                            min={0}
                                            value={minValue}
                                            onChange={(e) => {
                                                setMinValue(e.target.value || "");
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>    
                                        <span style={{ fontSize: 14 }}>Maximum Value</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="0"
                                            min={0}
                                            value={maxValue}
                                            onChange={(e) => {
                                                setMaxValue(e.target.value || "");
                                            }}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span style={{ fontSize: 14 }}>Unit (Optional)</span>
                                    <input
                                        className="form-control"
                                        placeholder="e.g., PHP, years, kg, etc."
                                        value={rangeUnit}
                                        onChange={(e) => setRangeUnit(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                            <button
                                onClick={() => {
                                    setShowAddCustomModal(false);
                                    setEditingQuestion(null);
                                }}
                                style={{
                                    padding: "8px 24px",
                                    backgroundColor: "#fff",
                                    color: "#414651",
                                    border: "1px solid #D5D7DA",
                                    borderRadius: 8,
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!questionText.trim()}
                                style={{
                                    padding: "8px 24px",
                                    backgroundColor: questionText.trim() ? "#5E72E4" : "#D5D7DA",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: questionText.trim() ? "pointer" : "not-allowed"
                                }}
                            >
                                Save Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
            <CustomQuestionModal />
            
            <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-file-alt" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>1. CV Review Settings</span>
                        </div>
                        <div className="layered-card-content">
                            <div>
                                <span style={{color: "#181D27", fontWeight: 700}}>CV Screening</span>
                            </div>
                            <div style={{marginBottom: 10}}>
                                <span>Jia automatically endorses candidates who meet the chosen criteria</span>
                            </div>
                            <CustomDropdown
                                onSelectSetting={(setting) => {
                                    setScreeningSetting(setting);
                                }}
                                screeningSetting={screeningSetting}
                                settingList={screeningSettingList}
                                placeholder="Select Screening Criteria"
                            />

                            <div style={{ marginTop: 16 }}>
                                <span style={{color: "#181D27", fontWeight: 700}}>Secret Prompt</span>
                                <span style={{ fontSize: 14, color: "#6c757d", marginLeft: 4 }}>(optional)</span>
                            </div>
                            <div style={{marginBottom: 10, marginTop: 4}}>
                                <span style={{ fontSize: 14 }}>Secret Prompts give you extra control over Jia’s evaluation style, complementing her accurate assessment of requirements from the job description.</span>
                            </div>
                            <textarea
                                className="form-control"
                                placeholder="Enter additional instructions for CV evaluation..."
                                rows={4}
                                value={secretPrompt}
                                onChange={(e) => setSecretPrompt(e.target.value)}
                                style={{ resize: "vertical" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="la la-question-circle" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                                </div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>2. Pre-Screening Questions</span>
                                <span style={{ fontSize: 14, color: "#6c757d" }}>(optional)</span>
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
                            <button
                                onClick={() => setShowAddCustomModal(true)}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#181D27",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <i className="la la-plus"></i> Add custom
                            </button>
                        </div>
                        
                        <div className="layered-card-content">
                            {preScreeningQuestions.length === 0 ? (
                                <>
                                    <div style={{ padding: "20px 0", color: "#6c757d", textAlign: "center" }}>
                                        No pre-screening questions added yet.
                                    </div>
                                    
                                    <div style={{ marginTop: 20, borderTop: "1px solid #E9EAEB", paddingTop: 20 }}>
                                        <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Suggested Pre-screening Questions:</h4>
                                        {suggestedQuestions.map((suggested, index) => (
                                            <div key={index} style={{
                                                padding: "12px 16px",
                                                marginBottom: 12,
                                                border: "1px solid #E9EAEB",
                                                borderRadius: 8,
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start"
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: "#181D27", marginBottom: 4 }}>
                                                        {suggested.title}
                                                    </div>
                                                    <div style={{ fontSize: 14, color: "#6c757d" }}>
                                                        {suggested.question}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddSuggestedQuestion(suggested)}
                                                    style={{
                                                        padding: "6px 16px",
                                                        backgroundColor: "#fff",
                                                        color: "#181D27",
                                                        border: "1px solid #D5D7DA",
                                                        borderRadius: 6,
                                                        cursor: "pointer",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {preScreeningQuestions.map((q, index) => (
                                        <div key={q.id} style={{
                                            padding: 16,
                                            border: "1px solid #E9EAEB",
                                            borderRadius: 8,
                                            backgroundColor: "#F8F9FA"
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 8 }}>
                                                        {q.question}
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{
                                                            fontSize: 12,
                                                            color: "#6c757d",
                                                            padding: "2px 8px",
                                                            backgroundColor: "#fff",
                                                            borderRadius: 4,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 4
                                                        }}>
                                                            <i className={
                                                                q.type === "Dropdown" ? "la la-chevron-down" : 
                                                                q.type === "Multiple Choice" ? "la la-check-square" : 
                                                                q.type === "Range" ? "la la-arrows-alt-h" :
                                                                "la la-font"
                                                            }></i>
                                                            {q.type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleEditQuestion(q)}
                                                    style={{
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "#6c757d",
                                                        cursor: "pointer",
                                                        padding: 4,
                                                        marginRight: 8
                                                    }}
                                                >
                                                    <i className="la la-pen" style={{ fontSize: 16 }}></i>
                                                </button>
                                            </div>

                                            {(q.type === "Dropdown" || q.type === "Multiple Choice") && q.options && q.options.length > 0 && (
                                                <div style={{ marginTop: 12 }}>
                                                    {q.options.map((option, optIndex) => (
                                                        <div key={optIndex} style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 8,
                                                            padding: "6px 12px",
                                                            backgroundColor: "#fff",
                                                            borderRadius: 6,
                                                            marginBottom: 6,
                                                            fontSize: 14
                                                        }}>
                                                            <span style={{ color: "#6c757d", minWidth: 20 }}>{optIndex + 1}</span>
                                                            <span>{option}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.type === "Range" && (
                                                <div style={{ 
                                                    marginTop: 12, 
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

                                            <button
                                                onClick={() => handleRemoveQuestion(q.id)}
                                                style={{
                                                    marginTop: 12,
                                                    padding: "6px 12px",
                                                    backgroundColor: "#fff",
                                                    color: "#dc3545",
                                                    border: "1px solid #dc3545",
                                                    borderRadius: 6,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    fontSize: 14
                                                }}
                                            >
                                                <i className="la la-trash"></i> Delete Question
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-lightbulb" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Tips</span>
                        </div>
                        <div className="layered-card-content">
                            <div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Add a Secret Prompt </span>
                                <span>
                                    to fine-tune how Jia scores and evaluates submitted CVs. For example, prioritize specific skills or experience levels.
                                </span>
                            </div>
                            <div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Add Pre-Screening Questions </span>
                                <span>
                                    to collect key details such as notice period, work setup, or salary expectations to guide your review and candidate discussions.
                                </span>
                            </div>
                            <div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Use "Good Fit and above" </span>
                                <span>
                                    for a broader talent pool, or "Only Strong Fit" to focus on the most qualified candidates only.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}