"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAICacheManager } from "@google/generative-ai/server";
import { supabase } from "../../config/supabase";

const MODEL_NAME = "gemini-1.5-flash-001";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;

const MIN_TOKEN_COUNT = 32768;
const cacheManager = new GoogleAICacheManager(API_KEY);
const displayName = "EmployeeProjectAssistant";
const systemInstruction =
  "bạn là một nhân viên của công ty của tôi và có đưa ra các câu query đến database của supabase" +
  "nhiệm vụ của bạn là nhận dạng prompt của người dùng. nếu đó là câu hỏi về nhân viên và dự án của công ty thì hãy trả về câu truy vấn để người dùng có thể dùng câu truy vấn đó truy xuất vào supabase để lấy thông tin." +
  "The database contains tables for managing employees, projects, and skills with the following relationships: employees link to employee_projects (via employee_id), projects link to employee_projects (via project_id), employees link to employee_skills (via employee_id), and skills link to both employee_skills and project_skills (via skill_id). Key tables include employees (details like id, name, email, role, is_destroyed), projects (details like name, description, status), skills (skill names), and their respective mapping tables for relationships. Only SELECT queries should be generated respecting this schema. Be case-insensitive, ensuring results are unaffected by uppercase or lowercase input. Ignore diacritics in text fields, so searches return results regardless of accents or special characters in names, emails, or other text fields" +
  "các truy vấn phải không phân biệt chữ hoa, chữ thường và dấu";
let ttlSeconds = 300;

let localCache = null;
let history = [];
history.push({
  role: "user",
  parts: [{ text: systemInstruction }],
});

async function getOrUpdateCache() {
  if (localCache) {
    return localCache;
  }

  const totalTokens = history.reduce(
    (sum, entry) => sum + entry.parts[0].text.length,
    0
  );

  if (totalTokens >= MIN_TOKEN_COUNT) {
    localCache = await cacheManager.create({
      model: MODEL_NAME,
      displayName,
      systemInstruction,
      contents: history,
      ttlSeconds,
    });
    return localCache;
  }

  return null;
}

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    maxOutputTokens: 50000,
  };

  const cache = await getOrUpdateCache();
  const chat = model.startChat({
    history: cache ? cache.contents : history,
    generationConfig,
  });

  const result = await chat.sendMessage(prompt);
  const responseText = result.response.text();

  let finalResponse = responseText;

  if (responseText.includes("SELECT")) {
    // Extract the SQL query
    const queryMatch = responseText.match(/```sql\s*(.+?)\s*```/s);
    const query = queryMatch ? queryMatch[1].trim() : null;

    if (query) {
      // Execute the query on Supabase
      const queryData = await executeQueryFromChat(query);

      if (queryData) {
        const dataSummary = JSON.stringify(queryData);
        const followUpPrompt = `
          Người dùng đã hỏi: "${prompt}".
          Đây là dữ liệu trả về từ truy vấn SQL: ${dataSummary}.
          Hãy cung cấp câu trả lời tự nhiên và đầy đủ dựa trên dữ liệu này.
        `;

        // Send the new prompt to the AI
        const followUpResult = await chat.sendMessage(followUpPrompt);
        finalResponse = followUpResult.response.text();
      } else {
        finalResponse =
          "Không thể thực hiện truy vấn SQL. Vui lòng kiểm tra lại.";
      }
    }
  } 

  history.push(
    {
      role: "user",
      parts: [{ text: prompt }],
    },
    {
      role: "model",
      parts: [{ text: finalResponse }],
    }
  );

  return finalResponse;
}


export const executeQueryFromChat = async (query) => {
  const cleanedQuery = query.trim().replace(/;$/, "");

  const { data, error } = await supabase.rpc("run_sql", { sql: cleanedQuery });

  if (error) {
    console.error("Error executing query:", error);
    return null;
  }

  return data;
};

export default runChat;
