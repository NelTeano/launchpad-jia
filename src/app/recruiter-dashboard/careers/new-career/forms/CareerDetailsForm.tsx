'use client'
import CustomDropdown from '@/lib/components/CareerComponents/CustomDropdown';
import React from 'react'
import { useState, useEffect } from 'react';
import philippineCitiesAndProvinces from '../../../../../../public/philippines-locations.json';
import RichTextEditor from '@/lib/components/CareerComponents/RichTextEditor';

export default function CareerDetailsForm({
    career,
    jobTitle,
    setJobTitle,
    description,
    setDescription,
    employmentType,
    setEmploymentType,
    workSetup,
    setWorkSetup,
    workSetupRemarks,
    setWorkSetupRemarks,
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
    validationErrors = {}
}: {
    career?: any;
    jobTitle: string;
    setJobTitle: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    employmentType: string;
    setEmploymentType: (val: string) => void;
    workSetup: string;
    setWorkSetup: (val: string) => void;
    workSetupRemarks: string;
    setWorkSetupRemarks: (val: string) => void;
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
    validationErrors?: {[key: string]: string};
}) {
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);

    useEffect(() => {
        const parseProvinces = () => {
          setProvinceList(philippineCitiesAndProvinces.provinces);
          const defaultProvince = philippineCitiesAndProvinces.provinces[0];
          if (!province) {
            setProvince(defaultProvince.name);
          }
          const cities = philippineCitiesAndProvinces.cities.filter((cityItem) => cityItem.province === defaultProvince.key);
          setCityList(cities);
          if (!city) {
            setCity(cities[0].name);
          }
        }
        parseProvinces();
    }, [])

    const employmentTypeOptions = [
        { name: "Full-Time" },
        { name: "Part-Time" },
    ];

    const workSetupOptions = [
        { name: "Fully Remote" },
        { name: "Onsite" },
        { name: "Hybrid" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
            <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700, marginLeft: 8}}>1. </span>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Career Information</span>
                        </div>
                        <div className="layered-card-content">
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <span>Job Title <span style={{color: "#dc3545"}}>*</span></span>
                                    <input
                                      value={jobTitle}
                                      className="form-control"
                                      placeholder="Enter job title"
                                      onChange={(e) => setJobTitle(e.target.value || "")}
                                      data-error={!!validationErrors.jobTitle}
                                      style={{
                                        borderColor: validationErrors.jobTitle ? "#dc3545" : undefined,
                                        borderWidth: validationErrors.jobTitle ? "2px" : undefined
                                      }}
                                    />
                                    {validationErrors.jobTitle && (
                                      <span style={{ color: "#dc3545", fontSize: 14, marginTop: -4 }}>
                                        <i className="la la-exclamation-circle"></i> {validationErrors.jobTitle}
                                      </span>
                                    )}
                                    
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Work Setting</span>
                                        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                                <span>Employment Type</span>
                                                <CustomDropdown
                                                    onSelectSetting={(type) => setEmploymentType(type)}
                                                    screeningSetting={employmentType}
                                                    settingList={employmentTypeOptions}
                                                    placeholder="Select Employment Type"
                                                />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                                <span>Arrangement <span style={{color: "#dc3545"}}>*</span></span>
                                                <div data-error={!!validationErrors.workSetup}>
                                                  <CustomDropdown
                                                      onSelectSetting={(setting) => setWorkSetup(setting)}
                                                      screeningSetting={workSetup}
                                                      settingList={workSetupOptions}
                                                      placeholder="Select Work Setup"
                                                  />
                                                </div>
                                                {validationErrors.workSetup && (
                                                  <span style={{ color: "#dc3545", fontSize: 14, marginTop: -4 }}>
                                                    <i className="la la-exclamation-circle"></i> {validationErrors.workSetup}
                                                  </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Location</span>
                                        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                                <span>Country</span>
                                                <CustomDropdown
                                                    onSelectSetting={(setting) => setCountry(setting)}
                                                    screeningSetting={country}
                                                    settingList={[]}
                                                    placeholder="Select Country"
                                                />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                                <span>State / Province</span>
                                                <CustomDropdown
                                                    onSelectSetting={(prov) => {
                                                        setProvince(prov);
                                                        const provinceObj = provinceList.find((p) => p.name === prov);
                                                        const cities = philippineCitiesAndProvinces.cities.filter((cityItem) => cityItem.province === provinceObj.key);
                                                        setCityList(cities);
                                                        setCity(cities[0].name);
                                                    }}
                                                    screeningSetting={province}
                                                    settingList={provinceList}
                                                    placeholder="Select State / Province"
                                                />
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                                                <span>City <span style={{color: "#dc3545"}}>*</span></span>
                                                <div data-error={!!validationErrors.city}>
                                                  <CustomDropdown
                                                      onSelectSetting={(selectedCity) => setCity(selectedCity)}
                                                      screeningSetting={city}
                                                      settingList={cityList}
                                                      placeholder="Select City"
                                                  />
                                                </div>
                                                {validationErrors.city && (
                                                  <span style={{ color: "#dc3545", fontSize: 14, marginTop: -4 }}>
                                                    <i className="la la-exclamation-circle"></i> {validationErrors.city}
                                                  </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Salary {!salaryNegotiable && <span style={{color: "#dc3545"}}>*</span>}</span>
                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8, minWidth: "130px" }}>
                                                <label className="switch">
                                                    <input type="checkbox" checked={salaryNegotiable} onChange={() => setSalaryNegotiable(!salaryNegotiable)} />
                                                    <span className="slider round"></span>
                                                </label>
                                                <span>{salaryNegotiable ? "Negotiable" : "Fixed"}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "row", gap: 8, width: "100%" }}>  
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>    
                                                <span>Minimum Salary</span>
                                                <div style={{ position: "relative" }}>
                                                    <span style={{
                                                        position: "absolute",
                                                        left: "12px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        color: "#6c757d",
                                                        fontSize: "16px",
                                                        pointerEvents: "none",
                                                    }}>P</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ 
                                                          paddingLeft: "28px",
                                                          borderColor: validationErrors.minimumSalary ? "#dc3545" : undefined,
                                                          borderWidth: validationErrors.minimumSalary ? "2px" : undefined
                                                        }}
                                                        placeholder="0"
                                                        min={0}
                                                        value={minimumSalary}
                                                        onChange={(e) => setMinimumSalary(e.target.value || "")}
                                                        data-error={!!validationErrors.minimumSalary}
                                                        disabled={salaryNegotiable}
                                                    />
                                                    <span style={{
                                                        position: "absolute",
                                                        right: "30px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        color: "#6c757d",
                                                        fontSize: "16px",
                                                        pointerEvents: "none",
                                                    }}>PHP</span>
                                                </div>
                                                {validationErrors.minimumSalary && (
                                                  <span style={{ color: "#dc3545", fontSize: 14, marginTop: -4 }}>
                                                    <i className="la la-exclamation-circle"></i> {validationErrors.minimumSalary}
                                                  </span>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>    
                                                <span>Maximum Salary</span>
                                                <div style={{ position: "relative" }}>
                                                    <span style={{
                                                        position: "absolute",
                                                        left: "12px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        color: "#6c757d",
                                                        fontSize: "16px",
                                                        pointerEvents: "none",
                                                    }}>P</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        style={{ 
                                                          paddingLeft: "28px",
                                                          borderColor: validationErrors.maximumSalary ? "#dc3545" : undefined,
                                                          borderWidth: validationErrors.maximumSalary ? "2px" : undefined
                                                        }}
                                                        placeholder="0"
                                                        min={0}
                                                        value={maximumSalary}
                                                        onChange={(e) => setMaximumSalary(e.target.value || "")}
                                                        data-error={!!validationErrors.maximumSalary}
                                                        disabled={salaryNegotiable}
                                                    />
                                                    <span style={{
                                                        position: "absolute",
                                                        right: "30px",
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        color: "#6c757d",
                                                        fontSize: "16px",
                                                        pointerEvents: "none",
                                                    }}>PHP</span>
                                                </div>
                                                {validationErrors.maximumSalary && (
                                                  <span style={{ color: "#dc3545", fontSize: 14, marginTop: -4 }}>
                                                    <i className="la la-exclamation-circle"></i> {validationErrors.maximumSalary}
                                                  </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700, marginLeft: 8}}>2. </span>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Job Description</span>
                        </div>
                        <div className="layered-card-content">
                            <span>Description <span style={{color: "#dc3545"}}>*</span></span>
                            <div data-error={!!validationErrors.description}>
                              <RichTextEditor setText={setDescription} text={description} />
                            </div>
                            {validationErrors.description && (
                              <span style={{ color: "#dc3545", fontSize: 14, marginTop: 8, display: "block" }}>
                                <i className="la la-exclamation-circle"></i> {validationErrors.description}
                              </span>
                            )}
                        </div>
                    </div>
            </div>

            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="layered-card-middle">
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                >
                                <i
                                    className="la la-lightbulb"
                                    style={{
                                    background: "linear-gradient(90deg, #fccec0 0%, #ebacc9 33%, #ceb6da 66%, #9fcaed 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    fontSize: 30,
                                    }}
                                ></i>
                            </div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Tips</span>
                        </div>
                        <div className="layered-card-content">
                        <div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Use clear, standard job titles </span>
                            <span>
                            for better searchability (e.g., "Software Engineer" instead of "Code Ninja" or "Tech Rockstar").
                            </span>
                        </div>
                            <div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Avoid abbreviations </span>
                            <span>
                            or internal role codes that applicants might not understand (e.g., use "QA Engineer" instead of "QE II" or "QA-TL").
                            </span>
                        </div>
                        <div>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Keep it concise </span>
                            <span>
                            — job titles should be no more than a few words (2 - 4 max), avoiding fluff or marketing terms.
                            </span>
                        </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}