const { getGemini } = require('../config/gemini');

const FALLBACK = {
  effortHours: 4,
  suggestedDueDate: null,
  priority: 'medium',
  reasoning: 'AI estimation unavailable. Defaulting to 4 hours, medium priority.',
};

const suggestTaskEstimate = async ({ title, description, priority, labels }) => {
  try {
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const today = new Date().toISOString().split('T')[0];
    const prompt = `
You are a senior software project manager. Analyze this task and respond ONLY with valid JSON.

Task Title: "${title}"
Description: "${description || 'No description provided'}"
Current Priority: "${priority || 'medium'}"
Labels: ${labels?.length ? labels.join(', ') : 'none'}
Today's Date: ${today}

Respond with this exact JSON structure:
{
  "effortHours": <number between 0.5 and 40>,
  "suggestedDueDate": "<ISO date string YYYY-MM-DD, 1-14 days from today>",
  "priority": "<low|medium|high|urgent>",
  "reasoning": "<1-2 sentence explanation of your estimates>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip markdown code blocks if present
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      effortHours: Math.min(Math.max(Number(parsed.effortHours) || 4, 0.5), 40),
      suggestedDueDate: parsed.suggestedDueDate || null,
      priority: ['low', 'medium', 'high', 'urgent'].includes(parsed.priority) ? parsed.priority : 'medium',
      reasoning: parsed.reasoning || 'AI generated estimate.',
    };
  } catch (err) {
    console.error('Gemini error:', err.message);
    // Return fallback with a suggested date 7 days from now
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 7);
    return {
      ...FALLBACK,
      suggestedDueDate: fallbackDate.toISOString().split('T')[0],
    };
  }
};

module.exports = { suggestTaskEstimate };
