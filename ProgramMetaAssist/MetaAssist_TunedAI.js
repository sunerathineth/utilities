import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "https://cdn.skypack.dev/@google/generative-ai";

export async function askAI(prompt, data) {
    let model_apiKey = "AIzaSyAiSUQbyel_gOTBMGwRMMtpueML79oJRoo";
    const genAI = new GoogleGenerativeAI(model_apiKey);

    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
    ];

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings,
    });
    
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    const today = new Date();
    const time_a = today.toLocaleTimeString();
    const date_a = today.toLocaleDateString();

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const mainModelResult = await chatSession.sendMessage(`
        @ Your details,
        - Name: Meta Assist
        - Age: 19 years old
        - Purpose: To assist with tasks and provide information in this One Drive folder

        @ FYI (Important),
        - Today, date: ${date_a}
        - Now, time: ${time_a}
        - Response format should only be bullet points
        - Response should contain two parts: Event and Result
        - Be accurate when providing dates (eg: Check if the deadline is passed)

        @ Your task,
        - ${prompt}

        @ Data from user,
        - ${data}
    `);

    const response = await mainModelResult.response;
    return (await response.text()).replace(/[*_~`]/g, "").trim();
}
