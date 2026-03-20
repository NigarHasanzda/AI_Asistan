"use client";

import { createCompany, uploadCompanyPhoto } from "@/services/CompanyServices";
import React, { useState } from "react";

const CreateCompanyWithSeparateUpload = () => {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const token = localStorage.getItem("token") || "";

  // --- Şirkət yarat ---
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingCompany(true);
      const response = await createCompany(
        { companyName, website },
        token
      );
      console.log("Company created:", response);
      setCompanyName("");
      setWebsite("");
    } catch (error) {
      console.error("Company creation error:", error);
    } finally {
      setLoadingCompany(false);
    }
  };

  // --- Şəkil upload ---
  const handleUploadPhoto = async () => {
    if (!file) return alert("Please select a file to upload");

    try {
      setLoadingPhoto(true);
      const response = await uploadCompanyPhoto(file, token);
      console.log("Photo uploaded:", response);
      setUploadedUrl(response.fileUrl);
      setFile(null);
    } catch (error) {
      console.error("Photo upload error:", error);
    } finally {
      setLoadingPhoto(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Create Company</h2>

      {/* Şirkət formu */}
      <form onSubmit={handleCreateCompany}>
        <div>
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loadingCompany}
          style={{ marginTop: "15px" }}
        >
          {loadingCompany ? "Creating..." : "Create Company"}
        </button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h2>Upload Company Photo</h2>

      {/* Şəkil input və button */}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <button
        onClick={handleUploadPhoto}
        disabled={loadingPhoto}
        style={{ marginTop: "10px" }}
      >
        {loadingPhoto ? "Uploading..." : "Upload Photo"}
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: "10px" }}>
          <p>Uploaded file URL:</p>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default CreateCompanyWithSeparateUpload;