import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const analyzeFoodImage = async (imageBuffer: Buffer) => {
  const base64Image = imageBuffer.toString('base64')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a nutrition expert AI. Analyze the food image and identify all visible food items. 
        For each food item, provide the name and estimated calorie count based on standard portion sizes.
        
        Respond ONLY with the JSON object, no markdown formatting, no code blocks, no explanations.
        Format: {"foods": [{"name": "food name", "calories": number, "quantity": number}], "totalCalories": number}`
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this meal and provide calorie information for each food item.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    max_completion_tokens: 1000
  })
  
  const content = response.choices[0].message.content
  if (!content) {
    throw new Error('No response from AI')
  }
  
  console.log('AI Response:', content)
  
  try {
    const cleanedContent = content.replace(/```json\n?/, '').replace(/```\n?$/, '').trim()
    return JSON.parse(cleanedContent)
  } catch (error) {
    console.error('JSON parse error:', error)
    throw new Error('Invalid AI response format')
  }
}