import { GoogleGenerativeAI } from '@google/generative-ai'
import * as gemini_key from 'dotenv';

gemini_key.config();
const MODEL_NAME = 'gemini-1.5-flash-001'
const API_KEY = process.env.NEXT_GEMINI_KEY 

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: MODEL_NAME })

  const generationConfig = {
    maxOutputTokens: 50000
  }
  const chat = model.startChat({
    generationConfig
  })
  const result = await chat.sendMessage(prompt)
  const response = result.response

  console.log(response.text())
  return response.text()
}

export default runChat