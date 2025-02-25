import { ActionFunctionArgs } from "@remix-run/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { get_context, clean_output } from "~/utilties/merrick";
import { Ollama } from "ollama";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

const OLLAMA_SERVER = 'http://10.18.101.96:11434';

const ollama = new Ollama({host: OLLAMA_SERVER});

export async function action({ request }: ActionFunctionArgs) {

  const query = await request.text();

  const response = await ollama.embeddings({model: 'nomic-embed-text', prompt: query})

  const context = get_context(response.embedding);

  try {
    const response = await model.generateContent({
      contents: [    
        { 
          role: 'user', 
          parts: [{ text: `You are an AI assistant. Do not use markdown, bullet points, or any text formatting. Answer the question based on the given context.\n\nContext: ${context}\n\nQuestion: ${query}` }]
        }
      ]
    });
    return clean_output(response.response.text());
  } catch (error) {
    console.error('Error querying Gemini:', error);
  }

  return "I am not working yet";
}


//////////// CODE FOR OLLAMA ////////////

// import { ActionFunctionArgs } from "@remix-run/node";
// import { Ollama } from 'ollama';
// import { get_context, clean_output } from "~/utilties/merrick";

// const OLLAMA_SERVER = 'http://10.18.101.96:11434';
// const OLLAMA_MODEL = 'llama3.1';

// const ollama = new Ollama({host: OLLAMA_SERVER});

// export async function action({ request }: ActionFunctionArgs) {

//   const query = await request.text();

//   const response = await ollama.embeddings({model: 'nomic-embed-text', prompt: query})

//   const context = get_context(response.embedding);

//   try {
//     const response = await ollama.chat({
//       model: OLLAMA_MODEL,
//       messages: [
//         { role: 'system', content: "You are an AI assistant to answer questions. You are given context to answer questions. Only answer questions based on the given context. Keep responses short and avoid using text formatting."},
//         { role: 'user', content: `Answer the question based on the given context.\n\nContext: ${context}\n\nQuestion: ${query}`}],
//       stream: false,
//     });
//     return clean_output(response.message.content);
//   } catch (error) {
//     console.error('Error querying Ollama:', error);
//   }

//   return "I am not working yet";
// }