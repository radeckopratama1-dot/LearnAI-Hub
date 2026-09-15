import { AIModel, AIModelId } from "@/types";

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    icon: '🟣',
    description: 'Sangat cerdas dalam coding, analisis mendalam, dan penulisan terstruktur.',
    contextLength: '200k tokens',
    isPopular: true,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    icon: '🟢',
    description: 'Model flagship multimodal cepat dan serba bisa untuk segala kebutuhan.',
    contextLength: '128k tokens',
    isPopular: true,
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro',
    provider: 'Google',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    icon: '🔵',
    description: 'Konteks ekstra besar dengan penalaran ilmiah dan riset tingkat tinggi.',
    contextLength: '1M tokens',
  },
  {
    id: 'mistralai/mistral-7b-instruct',
    name: 'Mistral 7B',
    provider: 'Mistral AI',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    icon: '🟠',
    description: 'Model open-weight ringan, cepat, dan hemat token untuk tugas harian.',
    contextLength: '32k tokens',
  },
  {
    id: 'meta-llama/llama-3-8b-instruct',
    name: 'Llama 3',
    provider: 'Meta',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    icon: '🦙',
    description: 'Model open source cerdas dari Meta dengan pemahaman instruksi luar biasa.',
    contextLength: '8k tokens',
  },
];

export function getModelById(id: string): AIModel {
  return AVAILABLE_MODELS.find((m) => m.id === id) || AVAILABLE_MODELS[0];
}

export interface ChatCompletionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function createOpenRouterChatStream({
  messages,
  model = 'anthropic/claude-3.5-sonnet',
  apiKey,
}: {
  messages: ChatCompletionMessage[];
  model?: string;
  apiKey?: string;
}) {
  const token = apiKey || process.env.OPENROUTER_API_KEY;

  // If real token is configured and not placeholder
  if (token && token.trim() !== '' && !token.includes('your_openrouter_api_key')) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'LearnAI Hub',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter Error (${response.status}): ${errText}`);
    }

    return response.body;
  }

  // Fallback intelligent simulated stream for sandbox / preview when key is not yet set
  const encoder = new TextEncoder();
  const lastUserMsg = messages.filter((m) => m.role === 'user').pop()?.content || 'Halo';
  const modelMeta = getModelById(model);

  const simulatedResponse = `Halo! Saya **${modelMeta.name}** (${modelMeta.provider}) di **LearnAI Hub**.\n\nMenjawab pertanyaan Anda mengenai: "*${lastUserMsg}*":\n\n1. **Prinsip Dasar**: AI mempelajari pola data dan menggunakan neural network untuk memahami konteks.\n2. **Penerapan Praktis**: Anda dapat menggunakan teknik *Prompt Engineering* terstruktur (Role, Task, Context, Format) untuk mendapatkan hasil terbaik.\n3. **Langkah Berikutnya**: Coba eksplorasi menu **Roadmap AI** atau upload dokumen PDF Anda di tab **Dokumen** untuk analisis otomatis!\n\n\`\`\`python\n# Contoh pemanggilan AI di LearnAI Hub\nimport requests\n\nprint("Selamat belajar AI di LearnAI Hub!")\n\`\`\`\n\n*Catatan: Ini adalah response demonstrasi interaktif. Masukkan API Key OpenRouter Anda di menu Pengaturan (.env.local) untuk menghubungkan langsung ke endpoint produksi.*`;

  const stream = new ReadableStream({
    async start(controller) {
      const words = simulatedResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        const textChunk = (i === 0 ? '' : ' ') + words[i];
        const payload = JSON.stringify({
          choices: [
            {
              delta: {
                content: textChunk,
              },
            },
          ],
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        await new Promise((r) => setTimeout(r, 25));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return stream;
}
