import { GoogleGenerativeAI } from "@google/generative-ai";
import * as gemini_key from "dotenv";
import { extractEntityFromQuery, getEmployeeFromSupabase } from "./query";

gemini_key.config();

const MODEL_NAME = "gemini-1.5-flash-001";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;

async function getEmployeeInfo(userQuery) {
  try {
    const analysis = await extractEntityFromQuery(userQuery);

    if (
      !analysis ||
      analysis.intent !== "get_employee_info" ||
      !analysis.entity
    ) {
      return "Không thể phân tích câu hỏi. Hãy chắc chắn rằng bạn đang hỏi về nhân viên.";
    }

    const employeeName = analysis.entity;
    const employees = await getEmployeeFromSupabase(employeeName);
    if (employees.length === 0) {
      console.log("Không tìm thấy thông tin nhân viên.");
      return "Không tìm thấy thông tin nhân viên trùng khớp với kết quả của bạn.";
    }
    const employeeDataList = employees.map((employee) => ({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      ...(employee.joiningDate && { start_date: employee.joiningDate }),
    }));

    const prompt = {
      task: "Trả về thông tin của tất cả nhân viên khớp với yêu cầu dưới dạng câu trả lời phù hợp.",
      employees: employeeDataList,
    };

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = { maxOutputTokens: 200 };
    const chat = model.startChat({ generationConfig });
    const result = await chat.sendMessage(JSON.stringify(prompt));

    return result?.response?.text() || "Không có kết quả trả về từ Gemini.";
  } catch (error) {
    console.error("Lỗi:", error);
    return "Đã xảy ra lỗi trong quá trình xử lý.";
  }
}

export default getEmployeeInfo;
