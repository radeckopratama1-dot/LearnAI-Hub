'use client';

import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Sparkles, BookOpen } from "lucide-react";
import { DocumentItem } from "@/types";
import { clientStore } from "@/lib/mock-store";
import { DocumentUploader } from "@/components/documents/DocumentUploader";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentChat } from "@/components/documents/DocumentChat";
import { Button } from "@/components/ui/Button";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeChatDoc, setActiveChatDoc] = useState<DocumentItem | null>(null);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);
  const [isUploadingModal, setIsUploadingModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loaded = clientStore.getDocuments();
    setDocuments(loaded);
  }, []);

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    const updated = [newDoc, ...documents];
    setDocuments(updated);
    clientStore.saveDocuments(updated);
    setIsUploadingModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    clientStore.saveDocuments(updated);
    if (activeChatDoc?.id === id) {
      setActiveChatDoc(null);
    }
  };

  const handleAskDocument = (doc: DocumentItem) => {
    setInitialQuery(undefined);
    setActiveChatDoc(doc);
  };

  const handleSummarizeDocument = (doc: DocumentItem) => {
    setInitialQuery("Tolong berikan rangkuman komprehensif dan struktur poin penting dari dokumen ini.");
    setActiveChatDoc(doc);
  };

  const handleQuizDocument = (doc: DocumentItem) => {
    setInitialQuery("Buatkan 5 soal kuis pilihan ganda beserta kunci jawaban dan penjelasannya berdasarkan isi dokumen ini.");
    setActiveChatDoc(doc);
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If in Document Chat Mode
  if (activeChatDoc) {
    return (
      <DocumentChat
        document={activeChatDoc}
        initialQuery={initialQuery}
        onBack={() => {
          setActiveChatDoc(null);
          setInitialQuery(undefined);
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Retrieval-Augmented Generation
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold">
              pgvector
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
            Dokumen & Riset RAG
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload materi kuliah, PDF, DOCX, atau jurnal untuk dianalisis dan ditanya secara faktual.
          </p>
        </div>

        <Button
          onClick={() => setIsUploadingModal(!isUploadingModal)}
          variant="primary"
          className="gap-2 shadow-md shadow-indigo-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isUploadingModal ? "Tutup Upload" : "Upload Dokumen Baru"}</span>
        </Button>
      </div>

      {/* Upload Zone Section */}
      {isUploadingModal && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <DocumentUploader onUploadSuccess={handleUploadSuccess} />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama dokumen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {filteredDocs.length} Dokumen Tersedia
        </span>
      </div>

      {/* Document Library Cards Grid */}
      {filteredDocs.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Belum ada dokumen yang sesuai
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload berkas PDF, DOCX, atau TXT materi kuliah Anda untuk mulai menggunakan sistem tanya jawab semantik (RAG).
          </p>
          <Button
            onClick={() => setIsUploadingModal(true)}
            variant="primary"
            size="sm"
            className="gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Dokumen Sekarang</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onAsk={handleAskDocument}
              onSummarize={handleSummarizeDocument}
              onQuiz={handleQuizDocument}
              onDelete={handleDeleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
}
