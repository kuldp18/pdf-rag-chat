"use client";
import { useState, useRef } from "react";

const UploadWidget = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const uploadPDF = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = () => {
    if (!file || file.type !== "application/pdf") {
      setError(
        "Empty file or invalid file type. Please select a valid pdf file."
      );
      return;
    }
    setError(null);
    console.log(file);
    uploadPDF();
  };

  return (
    <div className="text-sm w-full flex flex-col gap-5">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      <div
        onClick={handleClick}
        className="w-full h-24 border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition hover:text-black"
      >
        <p className="text-[16px]">
          {file
            ? `Selected: ${file.name}`
            : "Click to upload your file (*.pdf)"}
        </p>
      </div>

      <button
        className="bg-blue-500 mx-auto w-32 px-4 py-2 rounded-md hover:bg-blue-400 cursor-pointer transition-colors text-lg"
        onClick={handleSubmit}
      >
        Submit
      </button>
      {error && <p className="text-red-400 text-center text-md">{error}</p>}
    </div>
  );
};
export default UploadWidget;
