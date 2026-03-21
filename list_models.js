const apiKey = 'AIzaSyD2AVnvsxIUlQ-GkugtDe11HuvsEyqRkag';

async function listModels() {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (data.models) {
      console.log('Available Models for this key:');
      data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods?.join(', ') || 'no methods'})`));
    } else {
      console.log('Error/No models:', data);
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}

listModels();
