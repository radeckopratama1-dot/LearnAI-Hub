'use client';

import React from "react";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatSessionPage() {
  const params = useParams();
  const sessionId = Array.isArray(params.sessionId) ? params.sessionId[0] : params.sessionId;

  return (
    <div className="h-full w-full">
      <ChatInterface initialSessionId={sessionId} />
    </div>
  );
}
