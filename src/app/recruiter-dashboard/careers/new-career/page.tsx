"use client";

import React, { useState, useEffect } from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import styles from "@/lib/styles/screens/newCareer.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";
import CareerDetailsForm from "./forms/CareerDetailsForm";
import PreScreeningForm from "./forms/PreScreeningForm";
import AIInterviewSetupForm from "./forms/AIInterviewForm";
import ReviewCareerForm from "./forms/ReviewCareerForm";

export default function NewCareerPage() {
  // Get user and org from localStorage
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : {
        image: "",
        name: "",
        email: ""
      };
    }
    return { image: "", name: "", email: "" };
  });

  const [orgID, setOrgID] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedOrgList = localStorage.getItem('orgList');
      if (storedOrgList) {
        const orgList = JSON.parse(storedOrgList);
        return orgList.length > 0 ? orgList[0]._id : "";
      }
    }
    return "";
  });

  const [currentStep, setCurrentStep] = useState("Career Details and Team Access");
  const [isSaving, setIsSaving] = useState(false);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Career Details State
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-Time");
  const [workSetup, setWorkSetup] = useState("");
  const [workSetupRemarks, setWorkSetupRemarks] = useState("");
  const [country, setCountry] = useState("Philippines");
  const [province, setProvince] = useState("Metro Manila");
  const [city, setCity] = useState("");
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  const [minimumSalary, setMinimumSalary] = useState("");
  const [maximumSalary, setMaximumSalary] = useState("");

  // CV Review State
  const [screeningSetting, setScreeningSetting] = useState("Good Fit and above");
  const [secretPrompt, setSecretPrompt] = useState("");
  const [preScreeningQuestions, setPreScreeningQuestions] = useState([]);

  // AI Interview State
  const [interviewScreeningSetting, setInterviewScreeningSetting] = useState("Good Fit and above");
  const [requireVideo, setRequireVideo] = useState(true);
  const [questions, setQuestions] = useState([
    { id: 1, category: "CV Validation / Experience", questionCountToAsk: null, questions: [] },
    { id: 2, category: "Technical", questionCountToAsk: null, questions: [] },
    { id: 3, category: "Behavioral", questionCountToAsk: null, questions: [] },
    { id: 4, category: "Analytical", questionCountToAsk: null, questions: [] },
    { id: 5, category: "Others", questionCountToAsk: null, questions: [] },
  ]);

  // Store the career ID after creation
  const [careerId, setCareerId] = useState<string | null>(null);

  // Validate localStorage data on mount
  useEffect(() => {
    if (!user.email || !orgID) {
      console.warn("Missing user or organization data from localStorage");
    }
  }, [user, orgID]);

  const steps = ["Career Details and Team Access", "CV Review and Pre-Screening", "AI-Interview Setup", "Review Career"];
  const stepStatus = ["Completed", "Pending", "In Progress"];

  function processState(index: number, isAdvance = false) {
    const currentStepIndex = steps.indexOf(currentStep);
    
    // If this is the current step
    if (currentStepIndex === index) {
      return isAdvance ? stepStatus[2] : stepStatus[0]; // "In Progress" for advance view, "Completed" for main
    }
    
    // If we've passed this step
    if (currentStepIndex > index) {
      return stepStatus[0]; // "Completed"
    }
    
    // If we haven't reached this step yet
    return stepStatus[1]; // "Pending"
  }

  const validateCurrentStep = () => {
    const errors: {[key: string]: string} = {};

    if (currentStep === "Career Details and Team Access") {
      if (!jobTitle.trim()) {
        errors.jobTitle = "Job title is required";
      }
      if (!description.trim()) {
        errors.description = "Job description is required";
      }
      if (!workSetup.trim()) {
        errors.workSetup = "Work arrangement is required";
      }
      if (!city.trim()) {
        errors.city = "City is required";
      }
      if (!salaryNegotiable) {
        if (!minimumSalary || Number(minimumSalary) <= 0) {
          errors.minimumSalary = "Minimum salary is required";
        }
        if (!maximumSalary || Number(maximumSalary) <= 0) {
          errors.maximumSalary = "Maximum salary is required";
        }
        if (minimumSalary && maximumSalary && Number(minimumSalary) > Number(maximumSalary)) {
          errors.minimumSalary = "Minimum salary cannot be greater than maximum";
          errors.maximumSalary = "Maximum salary cannot be less than minimum";
        }
      }
    }

    if (currentStep === "CV Review and Pre-Screening") {
      if (preScreeningQuestions.length === 0) {
        errors.preScreeningQuestions = "At least one pre-screening question is required";
      }
    }

    if (currentStep === "AI-Interview Setup") {
      const totalQuestions = questions.reduce((acc, q) => acc + q.questions.length, 0);
      if (totalQuestions === 0) {
        errors.interviewQuestions = "At least one interview question is required";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateUniqueId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const prepareCareerData = (status: string) => {
    const userInfoSlice = {
      image: user.image,
      name: user.name,
      email: user.email,
    };

    // Transform pre-screening questions to match expected format
    const transformedPreScreeningQuestions = preScreeningQuestions.map((q: any, index: number) => {
      const baseQuestion: any = {
        id: String(index + 1),
        questionType: q.title || "Custom",
        question: q.question,
        questionFormat: q.type,
      };

      if (q.type === "Dropdown" || q.type === "Multiple Choice") {
        baseQuestion.answers = q.options ? q.options.map((opt: string, optIndex: number) => ({
          id: String(optIndex + 1),
          value: opt,
          type: q.type
        })) : [];
      }

      if (q.type === "Range") {
        baseQuestion.minValue = q.minValue || "0";
        baseQuestion.maxValue = q.maxValue || "100";
        baseQuestion.rangeUnit = q.rangeUnit || "";
      }

      return baseQuestion;
    });

    const now = new Date().toISOString();
    
    const careerData: any = {
      jobTitle,
      description,
      workSetup,
      workSetupRemarks,
      questions,
      location: city,
      country,
      province,
      employmentType,
      salaryNegotiable,
      minimumSalary: minimumSalary ? Number(minimumSalary) : 0,
      maximumSalary: maximumSalary ? Number(maximumSalary) : 0,
      screeningSetting,
      AIscreeningSetting: interviewScreeningSetting,
      secretPrompt: secretPrompt || "",
      preScreeningQuestions: transformedPreScreeningQuestions,
      requireVideo,
      status: status === "active" ? "active" : "inactive",
      lastEditedBy: userInfoSlice,
      createdBy: userInfoSlice,
      orgID,
      accomplishedStep: {
        index: steps.indexOf(currentStep) + 1,
        name: currentStep
      },
      updatedAt: now,
      lastActivityAt: now,
    };

    // Only include _id if we're updating
    if (careerId) {
      careerData._id = careerId;
    } else {
      careerData.id = generateUniqueId();
      careerData.createdAt = now;
    }

    return careerData;
  };

  const saveCareerData = async (status: string, showSuccessMessage = true) => {
    // Validate all steps before saving
    const currentStepBackup = currentStep;
    let allValid = true;

    // Validate each step
    for (const step of steps) {
      setCurrentStep(step);
      if (!validateCurrentStep()) {
        allValid = false;
        if (step === currentStepBackup) {
          // Stay on current step if it has errors
          break;
        } else {
          // Move to first step with errors
          alert(`Please complete all required fields in "${step}" before saving.`);
          return false;
        }
      }
    }

    // Restore current step
    setCurrentStep(currentStepBackup);

    if (!allValid) {
      return false;
    }

    setIsSaving(true);
    try {
      const careerData = prepareCareerData(status);
      
      const response = await fetch("/api/update-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(careerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save career");
      }

      const result = await response.json();
      
      // Store the career ID for future updates
      if (result.career && result.career._id) {
        setCareerId(result.career._id);
      }

      
      return true;
    } catch (error: any) {
      console.error("Error saving career:", error);
      alert(`Failed to save career: ${error.message}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = () => {
    // Clear previous validation errors
    setValidationErrors({});
    
    // Validate current step
    if (!validateCurrentStep()) {
      // Scroll to first error
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }
    
    // Move to next step without saving
    const currentStepIndex = steps.indexOf(currentStep);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveAsUnpublished = async () => {
    await saveCareerData("inactive", true);
  };

  const handlePublish = async () => {
    if (currentStep !== "Review Career") {
      alert("Please complete all steps before publishing");
      return;
    }

    const saved = await saveCareerData("active", true);
    if (saved) {
      // Redirect to careers page after successful publish
      window.location.href = "/recruiter-dashboard/careers";
    }
  };

  // Create career object to pass to child components
  const careerData = {
    _id: careerId,
    jobTitle,
    description,
    employmentType,
    workSetup,
    workSetupRemarks,
    country,
    province,
    location: city,
    salaryNegotiable,
    minimumSalary,
    maximumSalary,
    screeningSetting,
    secretPrompt,
    preScreeningQuestions,
    AIscreeningSetting: interviewScreeningSetting,
    requireVideo,
    questions,
  };

  return (
    <>
      <HeaderBar activeLink="Careers" currentPage="Add new career" icon="la la-suitcase" />
      <div className="container-fluid mt--7" style={{ paddingTop: "6rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Add New Career</h2>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>
            <button
              onClick={handleSaveAsUnpublished}
              disabled={isSaving}
              style={{ 
                width: "fit-content", 
                color: "#414651", 
                background: "#fff", 
                border: "1px solid #D5D7DA", 
                padding: "8px 16px", 
                borderRadius: "60px", 
                whiteSpace: "nowrap",
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.6 : 1
              }}
            >
              {isSaving ? "Saving..." : "Save as Unpublished"}
            </button>
            <button
              onClick={currentStep === "Review Career" ? handlePublish : handleSaveAndContinue}
              disabled={isSaving}
              style={{ 
                width: "fit-content", 
                background: isSaving ? "#D5D7DA" : "#000000ff", 
                color: "#fff", 
                border: "1px solid #E9EAEB", 
                padding: "8px 16px", 
                borderRadius: "60px", 
                whiteSpace: "nowrap",
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
            >
              <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
              {isSaving ? "Saving..." : currentStep === "Review Career" ? "Publish Career" : "Save and continue"}
            </button>
          </div>
        </div> 

        <div className={styles.stepContainer}>
          <div className={styles.step}>
            {steps.map((_, index) => (
              <div className={styles.stepBar} key={index}>
                <img
                  alt=""
                  src={
                    assetConstants[
                      processState(index, true)
                        .toLowerCase()
                        .replace(" ", "_")
                    ]
                  }
                />
                {index < steps.length - 1 && (
                  <hr
                    className={
                      styles[
                        processState(index).toLowerCase().replace(" ", "_")
                      ]
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <div className={styles.step}>
            {steps.map((item, index) => (
              <span
                className={`${styles.stepDetails} ${
                  styles[
                    processState(index, true).toLowerCase().replace(" ", "_")
                  ]
                }`}
                key={index}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          {currentStep === "Career Details and Team Access" && (
            <CareerDetailsForm 
              career={careerData}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              description={description}
              setDescription={setDescription}
              employmentType={employmentType}
              setEmploymentType={setEmploymentType}
              workSetup={workSetup}
              setWorkSetup={setWorkSetup}
              workSetupRemarks={workSetupRemarks}
              setWorkSetupRemarks={setWorkSetupRemarks}
              country={country}
              setCountry={setCountry}
              province={province}
              setProvince={setProvince}
              city={city}
              setCity={setCity}
              salaryNegotiable={salaryNegotiable}
              setSalaryNegotiable={setSalaryNegotiable}
              minimumSalary={minimumSalary}
              setMinimumSalary={setMinimumSalary}
              maximumSalary={maximumSalary}
              setMaximumSalary={setMaximumSalary}
              validationErrors={validationErrors}
            />
          )}
          {currentStep === "CV Review and Pre-Screening" && (
            <PreScreeningForm 
              career={careerData}
              screeningSetting={screeningSetting}
              setScreeningSetting={setScreeningSetting}
              secretPrompt={secretPrompt}
              setSecretPrompt={setSecretPrompt}
              preScreeningQuestions={preScreeningQuestions}
              setPreScreeningQuestions={setPreScreeningQuestions}
              validationErrors={validationErrors}
            />
          )}
          {currentStep === "AI-Interview Setup" && (
            <AIInterviewSetupForm 
              career={careerData}
              jobTitle={jobTitle}
              description={description}
              screeningSetting={interviewScreeningSetting}
              setScreeningSetting={setInterviewScreeningSetting}
              requireVideo={requireVideo}
              setRequireVideo={setRequireVideo}
              questions={questions}
              setQuestions={setQuestions}
              validationErrors={validationErrors}
            />
          )}
          {currentStep === "Review Career" && (
            <ReviewCareerForm 
              career={careerData}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              description={description}
              setDescription={setDescription}
              employmentType={employmentType}
              setEmploymentType={setEmploymentType}
              workSetup={workSetup}
              setWorkSetup={setWorkSetup}
              country={country}
              setCountry={setCountry}
              province={province}
              setProvince={setProvince}
              city={city}
              setCity={setCity}
              salaryNegotiable={salaryNegotiable}
              setSalaryNegotiable={setSalaryNegotiable}
              minimumSalary={minimumSalary}
              setMinimumSalary={setMinimumSalary}
              maximumSalary={maximumSalary}
              setMaximumSalary={setMaximumSalary}
              screeningSetting={screeningSetting}
              setScreeningSetting={setScreeningSetting}
              secretPrompt={secretPrompt}
              setSecretPrompt={setSecretPrompt}
              preScreeningQuestions={preScreeningQuestions}
              setPreScreeningQuestions={setPreScreeningQuestions}
              interviewScreeningSetting={interviewScreeningSetting}
              setInterviewScreeningSetting={setInterviewScreeningSetting}
              requireVideo={requireVideo}
              setRequireVideo={setRequireVideo}
              interviewQuestions={questions}
              setInterviewQuestions={setQuestions}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isSaving && (
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
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 32,
            maxWidth: 400,
            width: "90%",
            textAlign: "center"
          }}>
            <div style={{
              width: 50,
              height: 50,
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #5E72E4",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px"
            }}></div>
            <h3 style={{ marginBottom: 8 }}>Saving Career...</h3>
            <p style={{ color: "#6c757d", margin: 0 }}>
              Please wait while we save your career posting
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}