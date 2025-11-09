'use client'
import React, { useState } from 'react';
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import RichTextEditor from '@/lib/components/CareerComponents/RichTextEditor';
import InterviewQuestionGeneratorV2 from '@/lib/components/CareerComponents/InterviewQuestionGeneratorV2';

interface ReviewCareerFormProps {
    career?: any;
    jobTitle: string;
    setJobTitle: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    employmentType: string;
    setEmploymentType: (val: string) => void;
    workSetup: string;
    setWorkSetup: (val: string) => void;
    country: string;
    setCountry: (val: string) => void;
    province: string;
    setProvince: (val: string) => void;
    city: string;
    setCity: (val: string) => void;
    salaryNegotiable: boolean;
    setSalaryNegotiable: (val: boolean) => void;
    minimumSalary: string;
    setMinimumSalary: (val: string) => void;
    maximumSalary: string;
    setMaximumSalary: (val: string) => void;
    screeningSetting: string;
    setScreeningSetting: (val: string) => void;
    secretPrompt: string;
    setSecretPrompt: (val: string) => void;
    preScreeningQuestions: any[];
    setPreScreeningQuestions: (val: any[]) => void;
    interviewScreeningSetting: string;
    setInterviewScreeningSetting: (val: string) => void;
    requireVideo: boolean;
    setRequireVideo: (val: boolean) => void;
    interviewQuestions: any[];
    setInterviewQuestions: (val: any[]) => void;
    validationErrors?: {[key: string]: string};
}

export default function ReviewCareerForm({
    career,
    jobTitle,
    setJobTitle,
    description,
    setDescription,
    employmentType,
    setEmploymentType,
    workSetup,
    setWorkSetup,
    country,
    setCountry,
    province,
    setProvince,
    city,
    setCity,
    salaryNegotiable,
    setSalaryNegotiable,
    minimumSalary,
    setMinimumSalary,
    maximumSalary,
    setMaximumSalary,
    screeningSetting,
    setScreeningSetting,
    secretPrompt,
    setSecretPrompt,
    preScreeningQuestions,
    setPreScreeningQuestions,
    interviewScreeningSetting,
    setInterviewScreeningSetting,
    requireVideo,
    setRequireVideo,
    interviewQuestions,
    setInterviewQuestions,
    validationErrors = {}
}: ReviewCareerFormProps) {
    
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
        details: true,
        cv: true,
        interview: true
    });
    const [showAddCustomModal, setShowAddCustomModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const totalInterviewQuestions = interviewQuestions?.reduce((acc, group) => acc + group.questions.length, 0) || 0;

    const employmentTypeOptions = [
        { name: "Full-Time" },
        { name: "Part-Time" },
    ];

    const workSetupOptions = [
        { name: "Fully Remote" },
        { name: "Onsite" },
        { name: "Hybrid" },
    ];

    const screeningSettingList = [
        { name: "Good Fit and above", icon: "la la-check" },
        { name: "Only Strong Fit", icon: "la la-check-double" },
        { name: "No Automatic Promotion", icon: "la la-times" },
    ];

    const questionTypeOptions = [
        { name: "Text" },
        { name: "Dropdown" },
        { name: "Multiple Choice" },
        { name: "Yes/No" },
        { name: "Range" },
    ];

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

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* Career Details Section */}
                <div className="layered-card-middle">
                    <div 
                        style={{ 
                            display: "flex", 
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            cursor: "pointer",
                            marginBottom: expandedSections.details ? 12 : 0
                        }}
                        onClick={() => toggleSection('details')}
                    >
                        <div  style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                                style={{
                                    width: 32,
                                    height: 32,
                                    padding: 0,
                                    backgroundColor: "transparent",
                                    color: "#181D27",
                                    border: "none",
                                    outline: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F8F9FA"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                <i 
                                    className={`la la-angle-${expandedSections.details ? 'up' : 'down'}`} 
                                    style={{ fontSize: 20 }}
                                ></i>
                            </button>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>Career Details</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {editingSection !== "details" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSection("details");
                                        setExpandedSections(prev => ({ ...prev, details: true }));
                                    }}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        padding: 0,
                                        backgroundColor: "transparent",
                                        color: "#5E72E4",
                                        border: "1px solid #5E72E4",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <i className="la la-pen" style={{ fontSize: 16 }}></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {expandedSections.details && (
                        <div className="layered-card-content">
                            {editingSection === "details" ? (
                                <>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        <div>
                                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Job Title</label>
                                            <input
                                                className="form-control"
                                                value={jobTitle}
                                                onChange={(e) => setJobTitle(e.target.value)}
                                                placeholder="Enter job title"
                                                data-error={!!validationErrors.jobTitle}
                                                style={{
                                                    borderColor: validationErrors.jobTitle ? "#dc3545" : undefined
                                                }}
                                            />
                                            {validationErrors.jobTitle && (
                                                <div style={{ color: "#dc3545", fontSize: 14, marginTop: 4 }}>
                                                    {validationErrors.jobTitle}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", gap: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Employment Type</label>
                                                <CustomDropdown
                                                    onSelectSetting={setEmploymentType}
                                                    screeningSetting={employmentType}
                                                    settingList={employmentTypeOptions}
                                                    placeholder="Select Type"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Work Arrangement</label>
                                                <CustomDropdown
                                                    onSelectSetting={setWorkSetup}
                                                    screeningSetting={workSetup}
                                                    settingList={workSetupOptions}
                                                    placeholder="Select Setup"
                                                />
                                                {validationErrors.workSetup && (
                                                    <div style={{ color: "#dc3545", fontSize: 14, marginTop: 4 }}>
                                                        {validationErrors.workSetup}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", gap: 16 }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>State / Province</label>
                                                <input
                                                    className="form-control"
                                                    value={province}
                                                    onChange={(e) => setProvince(e.target.value)}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>City</label>
                                                <input
                                                    className="form-control"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    data-error={!!validationErrors.city}
                                                    style={{
                                                        borderColor: validationErrors.city ? "#dc3545" : undefined
                                                    }}
                                                />
                                                {validationErrors.city && (
                                                    <div style={{ color: "#dc3545", fontSize: 14, marginTop: 4 }}>
                                                        {validationErrors.city}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                                <label style={{ fontWeight: 600 }}>Salary Range</label>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    <label className="switch">
                                                        <input type="checkbox" checked={salaryNegotiable} onChange={() => setSalaryNegotiable(!salaryNegotiable)} />
                                                        <span className="slider round"></span>
                                                    </label>
                                                    <span>{salaryNegotiable ? "Negotiable" : "Fixed"}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 16 }}>
                                                <div style={{ flex: 1 }}>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Minimum"
                                                        value={minimumSalary}
                                                        onChange={(e) => setMinimumSalary(e.target.value)}
                                                        data-error={!!validationErrors.minimumSalary}
                                                        style={{
                                                            borderColor: validationErrors.minimumSalary ? "#dc3545" : undefined
                                                        }}
                                                    />
                                                    {validationErrors.minimumSalary && (
                                                        <div style={{ color: "#dc3545", fontSize: 14, marginTop: 4 }}>
                                                            {validationErrors.minimumSalary}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Maximum"
                                                        value={maximumSalary}
                                                        onChange={(e) => setMaximumSalary(e.target.value)}
                                                        data-error={!!validationErrors.maximumSalary}
                                                        style={{
                                                            borderColor: validationErrors.maximumSalary ? "#dc3545" : undefined
                                                        }}
                                                    />
                                                    {validationErrors.maximumSalary && (
                                                        <div style={{ color: "#dc3545", fontSize: 14, marginTop: 4 }}>
                                                            {validationErrors.maximumSalary}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Job Description</label>
                                            <RichTextEditor setText={setDescription} text={description} />
                                            {validationErrors.description && (
                                                <div style={{ color: "#dc3545", fontSize: 14, marginTop: 4 }}>
                                                    {validationErrors.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                                        <button
                                            onClick={() => setEditingSection(null)}
                                            style={{
                                                padding: "8px 24px",
                                                backgroundColor: "#5E72E4",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 8,
                                                cursor: "pointer"
                                            }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </>
                            ) : (
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
                            )}
                        </div>
                    )}
                </div>

                {/* CV Review Section */}
                <div className="layered-card-middle" data-error={!!validationErrors.preScreeningQuestions}>
                    <div 
                        style={{ 
                            display: "flex", 
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            cursor: "pointer",
                            marginBottom: expandedSections.cv ? 12 : 0
                        }}
                        onClick={() => toggleSection('cv')}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                                style={{
                                    width: 32,
                                    height: 32,
                                    padding: 0,
                                    backgroundColor: "transparent",
                                    color: "#181D27",
                                    border: "none",
                                    outline: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F8F9FA"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                <i 
                                    className={`la la-angle-${expandedSections.cv ? 'up' : 'down'}`} 
                                    style={{ fontSize: 20 }}
                                ></i>
                            </button>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>CV Review Settings & Pre-Screening Questions</span>
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
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {editingSection !== "cv" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSection("cv");
                                        setExpandedSections(prev => ({ ...prev, cv: true }));
                                    }}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        padding: 0,
                                        backgroundColor: "transparent",
                                        color: "#5E72E4",
                                        border: "1px solid #5E72E4",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <i className="la la-pen" style={{ fontSize: 16 }}></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {expandedSections.cv && (
                        <div className="layered-card-content">
                            {editingSection === "cv" ? (
                                <>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>CV Screening</label>
                                        <CustomDropdown
                                            onSelectSetting={setScreeningSetting}
                                            screeningSetting={screeningSetting}
                                            settingList={screeningSettingList}
                                            placeholder="Select Screening"
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Secret Prompt (optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows={4}
                                            value={secretPrompt}
                                            onChange={(e) => setSecretPrompt(e.target.value)}
                                            placeholder="Enter additional CV evaluation instructions..."
                                        />
                                    </div>

                                    <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />

                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                            <label style={{ fontWeight: 600 }}>Pre-Screening Questions (optional)</label>
                                            <button
                                                onClick={() => setShowAddCustomModal(true)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#181D27",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: 6,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    fontSize: 14
                                                }}
                                            >
                                                <i className="la la-plus"></i> Add Question
                                            </button>
                                        </div>
                                        <div style={{ fontSize: 14, color: "#6c757d", marginBottom: 12 }}>
                                            Add custom questions to collect key information from candidates
                                        </div>
                                        
                                        {preScreeningQuestions.length === 0 ? (
                                            <div style={{ 
                                                padding: "20px", 
                                                backgroundColor: "#F8F9FA", 
                                                borderRadius: 8,
                                                textAlign: "center",
                                                color: "#6c757d"
                                            }}>
                                                No pre-screening questions added yet
                                            </div>
                                        ) : (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                {preScreeningQuestions.map((q, index) => (
                                                    <div key={q.id} style={{
                                                        padding: 12,
                                                        border: "1px solid #E9EAEB",
                                                        borderRadius: 8,
                                                        backgroundColor: "#F8F9FA"
                                                    }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 4 }}>
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
                                                                        "la la-font"
                                                                    }></i>
                                                                    {q.type}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: "flex", gap: 4 }}>
                                                                <button
                                                                    onClick={() => handleEditQuestion(q)}
                                                                    style={{
                                                                        background: "transparent",
                                                                        border: "none",
                                                                        color: "#6c757d",
                                                                        cursor: "pointer",
                                                                        padding: 4
                                                                    }}
                                                                >
                                                                    <i className="la la-pen" style={{ fontSize: 16 }}></i>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        const updated = preScreeningQuestions.filter(item => item.id !== q.id);
                                                                        setPreScreeningQuestions(updated);
                                                                    }}
                                                                    style={{
                                                                        background: "transparent",
                                                                        border: "none",
                                                                        color: "#dc3545",
                                                                        cursor: "pointer",
                                                                        padding: 4
                                                                    }}
                                                                >
                                                                    <i className="la la-trash" style={{ fontSize: 16 }}></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        {(q.type === "Dropdown" || q.type === "Multiple Choice") && q.options && q.options.length > 0 && (
                                                            <div style={{ marginTop: 8, paddingLeft: 12 }}>
                                                                {q.options.map((option, optIndex) => (
                                                                    <div key={optIndex} style={{ fontSize: 13, color: "#6c757d", marginBottom: 2 }}>
                                                                        • {option}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {q.type === "Range" && (
                                                            <div style={{ marginTop: 8, fontSize: 13, color: "#6c757d" }}>
                                                                Range: {q.minValue || "0"} to {q.maxValue || "∞"}
                                                                {q.rangeUnit && ` (${q.rangeUnit})`}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                                        <button
                                            onClick={() => setEditingSection(null)}
                                            style={{
                                                padding: "8px 24px",
                                                backgroundColor: "#5E72E4",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 8,
                                                cursor: "pointer"
                                            }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: 16 }}>
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
                                        </div>
                                    </div>
                                    {secretPrompt && (
                                        <div style={{ marginBottom: 16 }}>
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
                                    )}

                                    {preScreeningQuestions.length > 0 && (
                                        <>
                                            <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />
                                            <div>
                                                <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700, marginBottom: 12, display: "block" }}>Pre-Screening Questions</span>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                                    {preScreeningQuestions.map((q, index) => (
                                                        <div key={q.id} style={{
                                                            padding: 12,
                                                            border: "1px solid #E9EAEB",
                                                            borderRadius: 8,
                                                            backgroundColor: "#F8F9FA"
                                                        }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#181D27", marginBottom: 4 }}>
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
                                                                            "la la-font"
                                                                        }></i>
                                                                        {q.type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {(q.type === "Dropdown" || q.type === "Multiple Choice") && q.options && q.options.length > 0 && (
                                                                <div style={{ marginTop: 8, paddingLeft: 12 }}>
                                                                    {q.options.map((option, optIndex) => (
                                                                        <div key={optIndex} style={{ fontSize: 13, color: "#6c757d", marginBottom: 2 }}>
                                                                            • {option}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {q.type === "Range" && (
                                                                <div style={{ marginTop: 8, fontSize: 13, color: "#6c757d" }}>
                                                                    Range: {q.minValue || "0"} to {q.maxValue || "∞"}
                                                                    {q.rangeUnit && ` (${q.rangeUnit})`}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* AI Interview Setup Section */}
                <div className="layered-card-middle">
                    <div 
                        style={{ 
                            display: "flex", 
                            flexDirection: "row", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            cursor: "pointer",
                            marginBottom: expandedSections.interview ? 12 : 0
                        }}
                        onClick={() => toggleSection('interview')}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                                style={{
                                    width: 32,
                                    height: 32,
                                    padding: 0,
                                    backgroundColor: "transparent",
                                    color: "#181D27",
                                    border: "none",
                                    outline: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F8F9FA"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                <i 
                                    className={`la la-angle-${expandedSections.interview ? 'up' : 'down'}`} 
                                    style={{ fontSize: 20 }}
                                ></i>
                            </button>
                            <span style={{fontSize: 18, color: "#181D27", fontWeight: 700}}>AI Interview Setup</span>
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
                                {totalInterviewQuestions}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            {editingSection !== "interview" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSection("interview");
                                        setExpandedSections(prev => ({ ...prev, interview: true }));
                                    }}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        padding: 0,
                                        backgroundColor: "transparent",
                                        color: "#5E72E4",
                                        border: "1px solid #5E72E4",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                >
                                    <i className="la la-pen" style={{ fontSize: 16 }}></i>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {expandedSections.interview && (
                        <div className="layered-card-content">
                            {editingSection === "interview" ? (
                                <>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>AI Interview Screening</label>
                                        <CustomDropdown
                                            onSelectSetting={setInterviewScreeningSetting}
                                            screeningSetting={interviewScreeningSetting}
                                            settingList={screeningSettingList}
                                            placeholder="Select Screening"
                                        />
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Require Video</label>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <label className="switch">
                                                <input type="checkbox" checked={requireVideo} onChange={() => setRequireVideo(!requireVideo)} />
                                                <span className="slider round"></span>
                                            </label>
                                            <span>{requireVideo ? "Yes" : "No"}</span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Interview Questions</label>
                                        <InterviewQuestionGeneratorV2
                                            questions={interviewQuestions}
                                            setQuestions={setInterviewQuestions}
                                            jobTitle={jobTitle}
                                            description={description}
                                        />
                                    </div>

                                    <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                                        <button
                                            onClick={() => setEditingSection(null)}
                                            style={{
                                                padding: "8px 24px",
                                                backgroundColor: "#5E72E4",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 8,
                                                cursor: "pointer"
                                            }}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ marginBottom: 16 }}>
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
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: 16 }}>
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
                                        <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700, marginBottom: 12, display: "block" }}>Interview Questions</span>
                                        {interviewQuestions?.map((group) => (
                                            group.questions.length > 0 && (
                                                <div key={group.id} style={{ marginBottom: 16 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                                        <span style={{ fontSize: 15, fontWeight: 700, color: "#181D27" }}>
                                                            {group.category}
                                                        </span>
                                                        <div style={{
                                                            backgroundColor: "#181D27",
                                                            color: "#fff",
                                                            borderRadius: "50%",
                                                            width: 22,
                                                            height: 22,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: 11,
                                                            fontWeight: 600
                                                        }}>
                                                            {group.questions.length}
                                                        </div>
                                                    </div>
                                                    <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                                                        {group.questions.map((q, idx) => (
                                                            <li key={q.id} style={{ marginBottom: 6, fontSize: 14, color: "#181D27" }}>
                                                                {q.question}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}