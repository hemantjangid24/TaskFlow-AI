const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGemini = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

module.exports = { getGemini };
