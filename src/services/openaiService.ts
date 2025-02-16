import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Remplacez par votre clé API
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const askChatGPT = async (message: string): Promise<string> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo", // ou "gpt-4" si vous y avez accès
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Erreur lors de la requête à OpenAI :", error);
    throw error;
  }
};
