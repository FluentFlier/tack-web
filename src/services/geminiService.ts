import { SummaryOutput, Source, AIModel } from '@/types';
import { getCurrentDateTimeString } from '@/utils/time';

// Get API key from environment variables
const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;
const CEREBRAS_MODEL = import.meta.env.VITE_CEREBRAS_MODEL || 'llama-3.3-70b';

/**
 * Maps the requested model to the appropriate Cerebras model
 */
export function mapToCerebrasModel(modelId?: string): string {
  // Use the configured Cerebras model (llama-3.3-70b)
  const cerebrasModel = CEREBRAS_MODEL;

  console.log(`Using Cerebras model: ${cerebrasModel}`);
  return cerebrasModel;
}

/**
 * Creates a prompt for the Gemini model based on content type and selected model
 */
export function createPrompt(content: string, type: 'text' | 'url', conversationHistory: SummaryOutput[] = [], modelId?: string): string {
  // Determine which model we're emulating
  const modelEmulation = getModelEmulationInstructions(modelId);
  
  // Application context for more helpful responses
  const appContext = `
    You are an AI assistant for an accessibility-focused application designed to help visually impaired users 
    access and understand web content. Your responses will be read aloud using text-to-speech technology, 
    so clarity and conciseness are essential. The user is interacting with a screen reader.
    
    ${modelEmulation}
    
    Current date and time: ${getCurrentDateTimeString()}
  `;
  
  const guidelines = `
    1. Provide direct, factual answers without unnecessary elaboration
    2. For date/time questions, give specific information rather than relative terms
    3. Structure information in a way that's easy to follow when heard rather than read
    4. Do not repeat the question in your answer
    5. Prioritize clarity and conciseness over conversational tone
    6. Include 5-6 relevant follow-up questions that the user might want to ask next
  `;

  // Build conversation context from history
  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = 'Previous conversation context:\n';
    // Add up to last 3 exchanges to maintain context without making prompt too long
    const recentHistory = conversationHistory.slice(-3);
    recentHistory.forEach((item, index) => {
      conversationContext += `[${index + 1}] User: ${item.originalQuery || 'Unknown query'}\n`;
      conversationContext += `[${index + 1}] Assistant: ${item.summary}\n\n`;
    });
    conversationContext += 'Remember this conversation history when responding to the current query.\n\n';
  }
  
  if (type === 'url') {
    return `${appContext}
    
    ${conversationContext}
    
    Please summarize the content from this URL: ${content}
    
    ${guidelines}
    
    Format your response with a clear summary followed by "Related Questions:" and then list 5-6 follow-up questions.`;
  } else {
    return `${appContext}
    
    ${conversationContext}
    
    Please answer this question directly: ${content}
    
    ${guidelines}
    
    Format your response with a clear answer followed by "Related Questions:" and then list 5-6 follow-up questions.`;
  }
}

/**
 * Get model-specific emulation instructions
 */
function getModelEmulationInstructions(modelId?: string): string {
  if (!modelId || modelId === 'gemini') {
    return "Respond as Gemini, Google's AI assistant.";
  }
  
  switch(modelId) {
    case 'chatgpt':
      return "Emulate the behavior and response style of ChatGPT. Be helpful, harmless, and honest. Your answers should be comprehensive yet concise, showing a strong ability to understand and respond to complex queries with nuance.";
    case 'claude':
      return "Emulate Claude's calm, thoughtful, and slightly formal tone. Provide nuanced, balanced responses that consider multiple perspectives. Be particularly careful with sensitive topics and prioritize helpfulness and harmlessness.";
    case 'mistral':
      return "Emulate Mistral's direct and efficient response style. Provide factual, straightforward answers with minimal embellishment while maintaining accuracy and helpfulness.";
    case 'perplexity':
      return "Emulate Perplexity's focus on providing well-researched information. Your answers should emphasize factual accuracy, with clear information synthesis and balanced presentation of different viewpoints.";
    case 'llama':
      return "Emulate LLaMA's response style. Be conversational yet informative, with a good balance of technical detail and accessible explanation. Show versatility in handling both technical and general knowledge topics.";
    default:
      return "Respond as Gemini, Google's AI assistant.";
  }
}

/**
 * Calls the Cerebras API for content summarization
 */
export async function callGeminiApi(prompt: string, modelId?: string): Promise<any> {
  if (!CEREBRAS_API_KEY) {
    throw new Error('Cerebras API key is not configured. Please set VITE_CEREBRAS_API_KEY environment variable.');
  }

  const cerebrasModel = mapToCerebrasModel(modelId);
  console.log(`Making API request to Cerebras with model: ${cerebrasModel}`);

  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: cerebrasModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cerebras API error response:', errorData);
      throw new Error(`Cerebras API request failed: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Successful response from Cerebras API');

    // Transform Cerebras response to match expected format
    return {
      candidates: [{
        content: {
          parts: [{
            text: data.choices[0].message.content
          }]
        }
      }]
    };
  } catch (error) {
    console.error('Error calling Cerebras API:', error);
    throw error; // Rethrow to be handled by the caller
  }
}
