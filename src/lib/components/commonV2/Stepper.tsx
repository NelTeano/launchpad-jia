"use client";

import React from "react";
import styles from "@/lib/styles/screens/uploadCV.module.scss";
import { assetConstants } from "@/lib/utils/constantsV2";

interface StepperProps {
  steps: string[];
  currentStep: string;
  stepStatus?: string[];
  processState: (index: number, isAdvance?: boolean) => string;
}

export default function Stepper({
  steps,
  currentStep,
  stepStatus = ["Completed", "Pending", "In Progress"],
  processState,
}: StepperProps) {
  return (
    <div className={styles.stepContainer}>
      {steps.map((item, index) => {
        const status = processState(index, true)
          .toLowerCase()
          .replace(" ", "_");

        return (
          <div key={index} className={styles.stepItem}>
            {/* Step circle or icon */}
            <div className={styles.stepCircle}>
              <img
                alt={item}
                src={assetConstants[status]}
                className={styles.stepIcon}
              />
            </div>

            {/* Step label */}
            <span className={styles.stepLabel}>{item}</span>

            {/* Connector line (except last step) */}
            {index < steps.length - 1 && (
              <div
                className={`${styles.connector} ${
                  styles[
                    processState(index).toLowerCase().replace(" ", "_")
                  ]
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
