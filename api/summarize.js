/**
 * Vercel Serverless Function for summarizing content using Cerebras API
 */

// Helper function to extract text from response
function extractTextFromCerebrasResponse(data) {
  try {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    }
    return '';
  } catch (error) {
    console.error('Error extracting text from Cerebras response:', error);
    return '';
  }
}

// Helper function to extract summary
function extractSummary(fullResponse) {
  const relatedQuestionsIndex = fullResponse.indexOf('Related Questions:');
  if (relatedQuestionsIndex !== -1) {
    return fullResponse.substring(0, relatedQuestionsIndex).trim();
  }
  return fullResponse.trim();
}

// Helper function to extract related questions
function extractRelatedQuestions(fullResponse) {
  const relatedQuestionsIndex = fullResponse.indexOf('Related Questions:');
  if (relatedQuestionsIndex !== -1) {
    const questionsText = fullResponse.substring(relatedQuestionsIndex + 'Related Questions:'.length);
    const questions = questionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0 && (q.match(/^\d+\./) || q.startsWith('-')))
      .map(q => q.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(q => q.length > 0);
    return questions.slice(0, 6);
  }
  return [];
}

// Helper function to generate sources
function generateRelevantSources(query, type) {
  if (type === 'url') {
    return [{
      id: '1',
      title: 'Provided URL',
      briefSummary: 'Primary source content that was analyzed to generate the response.',
      url: query
    }];
  }

  const sources = [];
  sources.push({
    id: '1',
    title: 'Wikipedia',
    briefSummary: `Comprehensive reference on "${query}" with detailed information.`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
  });

  sources.push({
    id: '2',
    title: 'Google Scholar',
    briefSummary: `Academic research papers and citations related to "${query}"`,
    url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`
  });

  return sources;
}

// Helper function to create prompt
function createPrompt(content, type, conversationHistory = []) {
  const appContext = `
    You are an AI assistant for an accessibility-focused application designed to help visually impaired users
    access and understand web content. Your responses will be read aloud using text-to-speech technology,
    so clarity and conciseness are essential. The user is interacting with a screen reader.

    Current date and time: ${new Date().toISOString()}
  `;

  const guidelines = `
    1. Provide direct, factual answers without unnecessary elaboration
    2. For date/time questions, give specific information rather than relative terms
    3. Structure information in a way that's easy to follow when heard rather than read
    4. Do not repeat the question in your answer
    5. Prioritize clarity and conciseness over conversational tone
    6. Include 5-6 relevant follow-up questions that the user might want to ask next
  `;

  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = 'Previous conversation context:\n';
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, type, model, history = [] } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const CEREBRAS_API_KEY = process.env.VITE_CEREBRAS_API_KEY;
    const CEREBRAS_MODEL = process.env.VITE_CEREBRAS_MODEL || 'llama-3.3-70b';

    if (!CEREBRAS_API_KEY) {
      console.error('Cerebras API key is not configured');
      return res.status(500).json({ error: 'API key is not configured' });
    }

    console.log(`Making API request to Cerebras with model: ${CEREBRAS_MODEL}`);

    // Create prompt
    const prompt = createPrompt(content, type, history);

    // Call Cerebras API
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: CEREBRAS_MODEL,
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
      return res.status(500).json({
        error: 'Failed to get response from Cerebras API',
        details: errorData
      });
    }

    const data = await response.json();
    console.log('Successful response from Cerebras API');

    // Extract and parse response
    const fullResponse = extractTextFromCerebrasResponse(data);
    const summary = extractSummary(fullResponse);
    const relatedQuestions = extractRelatedQuestions(fullResponse);
    const sources = generateRelevantSources(content, type);

    const result = {
      summary,
      sources,
      relatedQuestions,
      originalQuery: content,
      modelUsed: CEREBRAS_MODEL
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in summarize API:', error);
    return res.status(500).json({
      error: 'Failed to summarize content',
      details: error.message
    });
  }
}
