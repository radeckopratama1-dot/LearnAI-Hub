'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || undefined;

  return (
    <div className="h-full w-full">
      <ChatInterface initialPrompt={initialPrompt} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Memuat Chat AI...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
