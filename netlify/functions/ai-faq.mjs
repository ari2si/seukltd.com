const fallbackAnswer = (query) => {
  const topic = query.trim() || 'your project';
  const lower = topic.toLowerCase();

  if (lower.includes('hmo')) {
    return 'For HMO projects, Smart Environment Group can support layout planning, conversion works, fire safety coordination, services, bathrooms, kitchens, compliance-led refurbishment and long-term property services. HMO requirements vary by local authority, property type and occupancy, so the best next step is to send us the address, current layout and intended room numbers so our team can review the project properly.';
  }

  if (lower.includes('maintenance') || lower.includes('repair')) {
    return 'For maintenance, Smart Environment Group can support planned preventative maintenance, reactive repairs, compliance-related works, electrical, plumbing, HVAC, security, access, data and general property service requirements. If you share the property type, issue and urgency, our team can advise the most practical next step.';
  }

  if (lower.includes('planning') || lower.includes('development')) {
    return 'For development and planning-led projects, Smart Environment Group can help review site potential, feasibility, planning strategy, buildability, construction route, programme pressure and long-term value. Every site is different, so it is best to send us the address, drawings or a short brief and we can guide you on the next stage.';
  }

  return `For ${topic}, Smart Environment Group can advise from a property development, construction and property services perspective. We can provide general guidance, identify likely project considerations, and help decide whether the next step should be a site visit, drawing review, budget discussion or formal proposal. Please contact us with the address, photos, drawings or a short brief so the team can advise properly.`;
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const query = String(payload.query || '').trim().slice(0, 240);
  const category = String(payload.category || 'General').trim().slice(0, 80);

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please enter a topic or question.' }),
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: fallbackAnswer(query),
        fallback: true,
      }),
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_FAQ_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You are the Smart Environment Group website FAQ assistant. Answer UK property development, construction and property services questions in plain English. Keep answers practical, concise and relevant to Smart Environment Group services: property development, construction, refurbishment, HMO and student accommodation works, commercial and residential projects, maintenance, smart building systems, MEP, compliance coordination and aftercare. Give generic guidance only, avoid legal or engineering certainty, and always end by encouraging the user to contact Smart Environment Group with the address, drawings, photos or project brief.',
          },
          {
            role: 'user',
            content: `FAQ category: ${category}\nVisitor topic or question: ${query}`,
          },
        ],
        temperature: 0.4,
        max_output_tokens: 260,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI FAQ error:', errorText);
      return {
        statusCode: 200,
        body: JSON.stringify({
          answer: fallbackAnswer(query),
          fallback: true,
        }),
      };
    }

    const data = await response.json();
    const answer =
      data.output_text ||
      data.output?.flatMap((item) => item.content || [])
        ?.map((content) => content.text)
        ?.filter(Boolean)
        ?.join('\n') ||
      fallbackAnswer(query);

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error('AI FAQ function failed:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer: fallbackAnswer(query),
        fallback: true,
      }),
    };
  }
};
