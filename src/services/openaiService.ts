import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Accéder à la clé API depuis .env
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const askChatGPT = async (
  message: string,
  context: string
): Promise<string> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: context }, // Contexte des étapes
          { role: "user", content: message }, // Message de l'utilisateur
        ],
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
