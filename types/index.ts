export type AIModelId =
  | 'anthropic/claude-3.5-sonnet'
  | 'openai/gpt-4o'
  | 'google/gemini-pro-1.5'
  | 'mistralai/mistral-7b-instruct'
  | 'meta-llama/llama-3-8b-instruct';

export interface AIModel {
  id: AIModelId;
  name: string;
  provider: 'Anthropic' | 'OpenAI' | 'Google' | 'Mistral AI' | 'Meta';
  badgeColor: string;
  icon: string;
  description: string;
  contextLength: string;
  isPopular?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  role?: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: AIModelId | string;
  created_at: string;
  isStreaming?: boolean;
  citations?: DocumentCitation[];
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  model: AIModelId | string;
  created_at: string;
  updated_at?: string;
  messages_count?: number;
}

export interface DocumentItem {
  id: string;
  user_id: string;
  name: string;
  file_url: string;
  file_size: number;
  page_count: number;
  summary?: string;
  created_at: string;
}

export interface DocumentCitation {
  id: string;
  document_name: string;
  page_number: number;
  snippet: string;
  similarity?: number;
}

export type RoadmapStatus = 'not_started' | 'in_progress' | 'completed';

export interface RoadmapTopic {
  id: string;
  level: 1 | 2 | 3;
  levelTitle: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  estimatedMinutes: number;
  keyPoints: string[];
  suggestedPrompt: string;
  prerequisites?: string[];
  externalResources?: { title: string; url: string }[];
}

export interface RoadmapProgress {
  topic_id: string;
  status: RoadmapStatus;
  updated_at: string;
}

export interface GeneratedContentItem {
  id: string;
  user_id: string;
  type: 'text' | 'image' | 'audio';
  prompt: string;
  result_url?: string;
  result_text?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  totalChats: number;
  totalDocuments: number;
  roadmapCompletedCount: number;
  roadmapTotalCount: number;
  roadmapPercentage: number;
  totalGenerated: number;
}

export interface RecentActivity {
  id: string;
  type: 'chat' | 'document' | 'roadmap' | 'generator';
  title: string;
  description: string;
  timestamp: string;
  link: string;
}
