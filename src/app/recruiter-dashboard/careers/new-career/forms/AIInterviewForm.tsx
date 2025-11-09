'use client'
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import InterviewQuestionGeneratorV2 from '@/lib/components/CareerComponents/InterviewQuestionGeneratorV2';
import React, { useState } from 'react';

export default function AIInterviewSetupForm({
    career,
    jobTitle,
    description,
    screeningSetting,
    setScreeningSetting,
    requireVideo,
    setRequireVideo,
    questions,
    setQuestions,
}: {
    career?: any;
    jobTitle?: string;
    description?: string;
    screeningSetting: string;
    setScreeningSetting: (val: string) => void;
    requireVideo: boolean;
    setRequireVideo: (val: boolean) => void;
    questions: any[];
    setQuestions: (val: any[]) => void;
}) {
    
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

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
            <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="layered-card-outer">
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 32, height: 32, backgroundColor: "#181D27", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="la la-microphone" style={{ color: "#FFFFFF", fontSize: 20 }}></i>
                            </div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>1. AI Interview Settings</span>
                        </div>
                        <div className="layered-card-content">
                            <div>
                                <span style={{color: "#181D27", fontWeight: 700}}>AI Interview Screening</span>
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

                            <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #E9EAEB" }} />

                            <div>
                                <span style={{color: "#181D27", fontWeight: 700}}>Require Video on Interview</span>
                            </div>
                            <div>
                                <span>Require candidates to keep their camera on. Recordings will appear on their analysis page.</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 8, marginTop: 8 }}>
                                <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                                    <i className="la la-video" style={{ color: "#414651", fontSize: 20 }}></i>
                                    <span>Require Video Interview</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                                    <label className="switch">
                                        <input type="checkbox" checked={requireVideo} onChange={() => setRequireVideo(!requireVideo)} />
                                        <span className="slider round"></span>
                                    </label>
                                    <span>{requireVideo ? "Yes" : "No"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <InterviewQuestionGeneratorV2 
                    questions={questions} 
                    setQuestions={(questions) => setQuestions(questions)} 
                    jobTitle={jobTitle} 
                    description={description} 
                />
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
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Use the Generate Questions </span>
                                <span>
                                    button to let Jia create relevant interview questions based on your job description and requirements.
                                </span>
                            </div>
                            <div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Keep questions clear and specific </span>
                                <span>
                                    to help candidates understand what you're looking for and to make scoring more consistent.
                                </span>
                            </div>
                            <div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Aim for 5-8 questions per category </span>
                                <span>
                                    to ensure a comprehensive interview without overwhelming candidates. Quality over quantity matters.
                                </span>
                            </div>
                            <div>
                                <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Mix question types </span>
                                <span>
                                    between technical skills, soft skills, and situational questions for a well-rounded assessment.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}