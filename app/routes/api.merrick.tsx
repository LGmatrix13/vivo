import { ActionFunctionArgs } from "@remix-run/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { merrick } from "~/utilties/merrick";
import { Ollama } from "ollama";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [
        {
          text: `You are an AI assistant named "Merrick". Do not use markdown, bullet points, or any text formatting unless specifically told otherwise.
                   If the query pertains to the given context, answer appropriately and concisely based on the context and the chat history.
                   If the query does not pertain to the given context, pretend you are a normal person and give an answer.
                   If someone says "campo", they are referring to campus safety.
                   Wax melters may not have a hot plate, otherwise they are allowed.
                   Candles are not allowed in the dorms, even if unlit.
                   Respond like a normal person.`,
        },
      ],
    },
  ],
});

let history: string[] = [];

const OLLAMA_SERVER = "http://10.18.101.96:11434";

const ollama = new Ollama({ host: OLLAMA_SERVER });

export async function action({ request }: ActionFunctionArgs) {
  const query = await request.text();

  const response = await ollama.embeddings({
    model: "nomic-embed-text",
    prompt: query,
  });

  const context = merrick.readContext(response.embedding);

  try {
    const response = await chat.sendMessage(
      `Context: ${context}\n\nQuestion: ${query}\n\nChat History: ${history}`
    );
    history.push(query);
    history.push(response.response.text());
    return response.response.text();
  } catch (error) {
    console.error("Error querying Gemini:", error);
  }

  return "I'm sorry, there was an error on my end.";
}
