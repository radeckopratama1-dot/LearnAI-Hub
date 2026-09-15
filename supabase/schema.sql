-- ========================================================
-- LearnAI Hub - Database Schema & Supabase Setup
-- ========================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- 1. Profiles Table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar_url text,
  role text default 'student',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. Chat Sessions
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text default 'Chat Baru',
  model text default 'claude-3-5-sonnet',
  created_at timestamp with time zone default now()
);

alter table chat_sessions enable row level security;
create policy "Users can manage own sessions" on chat_sessions for all using (auth.uid() = user_id);

-- 3. Chat Messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text,
  model text,
  created_at timestamp with time zone default now()
);

alter table chat_messages enable row level security;
create policy "Users can access messages of their sessions" on chat_messages 
  for all using (
    exists (
      select 1 from chat_sessions 
      where chat_sessions.id = chat_messages.session_id 
      and chat_sessions.user_id = auth.uid()
    )
  );

-- 4. Documents (with pgvector embeddings)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  file_url text,
  file_size integer,
  page_count integer default 1,
  summary text,
  created_at timestamp with time zone default now()
);

alter table documents enable row level security;
create policy "Users can manage own documents" on documents for all using (auth.uid() = user_id);

-- Document Chunks for RAG Vector Search
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade,
  content text not null,
  page_number integer default 1,
  chunk_index integer not null,
  embedding vector(1536),
  created_at timestamp with time zone default now()
);

alter table document_chunks enable row level security;
create policy "Users can access chunks of their documents" on document_chunks 
  for all using (
    exists (
      select 1 from documents 
      where documents.id = document_chunks.document_id 
      and documents.user_id = auth.uid()
    )
  );

-- Match Document Chunks function for similarity search
create or replace function match_document_chunks (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  doc_id uuid
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  page_number integer,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.page_number,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where document_chunks.document_id = doc_id
    and 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. Roadmap Progress
create table if not exists roadmap_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  topic_id text not null,
  status text check (status in ('not_started', 'in_progress', 'completed')),
  notes text,
  updated_at timestamp with time zone default now(),
  unique(user_id, topic_id)
);

alter table roadmap_progress enable row level security;
create policy "Users can manage own roadmap progress" on roadmap_progress for all using (auth.uid() = user_id);

-- 6. Generated Content
create table if not exists generated_content (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text check (type in ('text', 'image', 'audio')),
  prompt text,
  result_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

alter table generated_content enable row level security;
create policy "Users can manage own generated content" on generated_content for all using (auth.uid() = user_id);

-- 7. Trigger on new auth.user to insert profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Bucket setup
insert into storage.buckets (id, name, public) 
values ('user_documents', 'user_documents', true)
on conflict (id) do nothing;
