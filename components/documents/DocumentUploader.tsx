'use client';

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { DocumentItem } from "@/types";
import { formatBytes } from "@/lib/utils";

interface DocumentUploaderProps {
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

export function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setErrorMessage("");
    // Check file type
    const validExtensions = [".pdf", ".docx", ".txt"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      setErrorMessage("Format file tidak didukung. Harap upload file PDF, DOCX, atau TXT.");
      return;
    }

    // Check size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Ukuran file terlalu besar! Maksimal 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setStatusMessage("Mengunggah file ke penyimpanan aman...");

    // Simulated progress steps for smooth UX
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 45) return prev + 15;
        if (prev < 80) {
          setStatusMessage("Mengekstrak teks & membagi menjadi chunking semantik...");
          return prev + 10;
        }
        if (prev < 95) {
          setStatusMessage("Menghasilkan vector embedding (LangChain + pgvector)...");
          return prev + 5;
        }
        return prev;
      });
    }, 250);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal mengunggah dokumen");
      }

      const data = await response.json();
      setUploadProgress(100);
      setStatusMessage("Selesai! Dokumen siap ditanyakan.");

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setStatusMessage("");
        onUploadSuccess(data.document);
      }, 1000);
    } catch (err: unknown) {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/60 dark:bg-slate-900/60"
        } ${isUploading ? "pointer-events-none opacity-90" : ""}`}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {isDragging ? "Lepaskan file di sini" : "Tarik dan lepas dokumen Anda ke sini"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mendukung PDF, DOCX, TXT hingga 10MB
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full">
            <FileText className="w-3.5 h-3.5" />
            <span>Pilih File dari Perangkat</span>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-6 max-w-md mx-auto space-y-2 animate-in fade-in">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
              <span>{statusMessage}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
