import { supabase } from '../../config/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as gemini_key from 'dotenv';
gemini_key.config();
const MODEL_NAME = 'gemini-1.5-flash-001';
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
export async function extractEntityFromQuery(query) {
    try {
        const prompt = {
            task: "Trích xuất intent và entity từ câu hỏi.",
            input: query,
            examples: [
                { query: "Cho tôi thông tin của nhân viên tên Lê Văn Thảo", intent: "get_employee_info", entity: "Lê Văn Thảo" },
                { query: "Tôi muốn biết về nhân viên tên Nguyễn Văn A", intent: "get_employee_info", entity: "Nguyễn Văn A" },
                { query: "Ai là người tên Trần Thị Bích Ngọc?", intent: "get_employee_info", entity: "Trần Thị Bích Ngọc" },
                { query: "Ai là người có email thu@gmail.com?", intent: "get_employee_info", entity: "thu@gmail.com" },
            ],
        };

        console.log('Prompt gửi đến Gemini:', JSON.stringify(prompt, null, 2));

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const generationConfig = { maxOutputTokens: 100 };
        const chat = model.startChat({ generationConfig });
        const result = await chat.sendMessage(JSON.stringify(prompt));
        const rawResponse = result?.response?.text();
        const cleanedResponse = rawResponse
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        const response = JSON.parse(cleanedResponse);
        return response;
    } catch (error) {
        console.error('Lỗi phân tích JSON từ phản hồi:', error);
        return null;
    }
}
export async function getEmployeeFromSupabase(employeeName) {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .or(`name.ilike.%${employeeName}%,email.ilike.%${employeeName}%`);

    if (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
    return Array.isArray(data) ? data : data ? [data] : [];
}

