import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyD2AVnvsxIUlQ-GkugtDe11HuvsEyqRkag';
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    console.log('Testing gemini-1.5-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Say hello');
    console.log('SUCCESS:', result.response.text());
  } catch (err) {
    console.error('ERROR with gemini-1.5-flash:', err.message);
    
    try {
      console.log('Testing gemini-pro...');
      const model2 = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result2 = await model2.generateContent('Say hello');
      console.log('SUCCESS:', result2.response.text());
    } catch (err2) {
      console.error('ERROR with gemini-pro:', err2.message);
    }
  }
}

run();
