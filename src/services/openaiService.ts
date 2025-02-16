import axios from "axios";

// Accéder à la clé API depuis .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Vérifier que la clé API est définie
if (!OPENAI_API_KEY) {
  throw new Error(
    "La clé API OpenAI est manquante. Veuillez la définir dans .env."
  );
}

export const askChatGPT = async (
  message: string,
  context: string
): Promise<string> => {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo", // Modèle à utiliser
        messages: [
          { role: "system", content: context }, // Contexte des étapes
          { role: "user", content: message }, // Message de l'utilisateur
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`, // Clé API dans l'en-tête
        },
      }
    );

    // Retourner la réponse de ChatGPT
    return response.data.choices[0].message.content;
  } catch (error) {
    // Gestion des erreurs
    if (axios.isAxiosError(error)) {
      console.error(
        "Erreur lors de la requête à OpenAI :",
        error.response?.data || error.message
      );
      throw new Error(
        `Erreur OpenAI : ${
          error.response?.data?.error?.message || error.message
        }`
      );
    } else {
      console.error("Erreur inattendue :", error);
      throw new Error("Une erreur inattendue s'est produite.");
    }
  }
};
