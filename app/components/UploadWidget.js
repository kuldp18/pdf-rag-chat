"use client";
import { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { useRouter } from "next/navigation";

const UploadWidget = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { setFilename } = useAppContext();
  const router = useRouter();

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

    return fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  const handleSubmit = () => {
    if (!file || file.type !== "application/pdf") {
      setError(
        "Empty file or invalid file type. Please select a valid pdf file."
      );
      return;
    }
    setError(null);

    setIsLoading(true);

    uploadPDF()
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setFilename(file.name.split(".")[0]);
          router.push("/chat");
        }
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        className="bg-blue-500 mx-auto w-32 px-14 py-3 rounded-md hover:bg-blue-400 cursor-pointer transition-colors text-md flex justify-center items-center"
        onClick={handleSubmit}
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>
      {error && <p className="text-red-400 text-center text-md">{error}</p>}
    </div>
  );
};
export default UploadWidget;
