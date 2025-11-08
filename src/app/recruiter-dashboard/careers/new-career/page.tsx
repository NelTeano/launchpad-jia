"use client";

import React, { useState } from "react";
import HeaderBar from "@/lib/PageComponent/HeaderBar";
import styles from "@/lib/styles/screens/newCareer.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";
import CareerDetailsForm from "./forms/CareerDetailsForm";
import PreScreeningForm from "./forms/PreScreeningForm";
import AIInterviewSetupForm from "./forms/AIInterviewForm";
import ReviewCareerForm from "./forms/ReviewCareerForm";

export default function NewCareerPage() {
  const [career, setCareer] = useState(null);
  const [currentStep, setCurrentStep] = useState("Career Details and Team Access");
  const steps = ["Career Details and Team Access", "CV Review and Pre-Screening", "AI-Interview Setup", "Review Career"];
  const stepStatus = ["Completed", "Pending", "In Progress"];

  function processState(index: number, isAdvance = false) {
    const currentStepIndex = steps.indexOf(currentStep);
    if (currentStepIndex === index) {
      if (index === stepStatus.length - 1) return stepStatus[0];
      return isAdvance ? stepStatus[2] : stepStatus[1];
    }
    if (currentStepIndex > index) return stepStatus[0];
    return stepStatus[1];
  }

  const isFormValid = () => {
    return true; // for the meantime
  };

  const handleSaveAndContinue = () => {
    const currentStepIndex = steps.indexOf(currentStep);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleSaveAsUnpublished = () => {
    // Add your save as unpublished logic here
    console.log("Saved as unpublished");
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
              style={{ 
                width: "fit-content", 
                color: "#414651", 
                background: "#fff", 
                border: "1px solid #D5D7DA", 
                padding: "8px 16px", 
                borderRadius: "60px", 
                whiteSpace: "nowrap",
                cursor: "pointer"
              }}
            >
              Save as Unpublished
            </button>
            <button
              onClick={handleSaveAndContinue}
              disabled={!isFormValid()}
              style={{ 
                width: "fit-content", 
                background: isFormValid() ? "#5E72E4" : "#D5D7DA", 
                color: "#fff", 
                border: "1px solid #E9EAEB", 
                padding: "8px 16px", 
                borderRadius: "60px", 
                whiteSpace: "nowrap",
                cursor: isFormValid() ? "pointer" : "not-allowed"
              }}
            >
              <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
              Save and continue
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
            <CareerDetailsForm career={career} />
          )}
          {currentStep === "CV Review and Pre-Screening" && (
            <PreScreeningForm career={career} />
          )}
          {currentStep === "AI-Interview Setup" && (
            <>
              <AIInterviewSetupForm career={career} />
            </>
          )}
          {currentStep === "Review Career" && (
            <>
              <ReviewCareerForm 
                career={career}
                // jobTitle={jobTitle}
                // description={description}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}