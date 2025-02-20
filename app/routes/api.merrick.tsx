import { ActionFunctionArgs } from "@remix-run/node";
import { Ollama } from 'ollama';
import { get_context } from "~/utilties/merrick";

const OLLAMA_SERVER = 'http://10.18.101.96:11434';
const OLLAMA_MODEL = 'llama3.2:1b';

const ollama = new Ollama({host: OLLAMA_SERVER});

export async function action({ request }: ActionFunctionArgs) {

  const query = await request.text();

  const response = await ollama.embeddings({model: 'nomic-embed-text', prompt: query})

  const context = get_context(response.embedding);

  try {
    const response = await ollama.chat({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: "You are an AI assistant to answer questions. You are given context to answer questions. Only answer questions based on the given context. Keep responses less than three sentences and avoid using text formatting."},
        { role: 'user', content: `Answer the question based on the given context.\n\nContext: ${context}\n\nQuestion: ${query}`}],
      stream: false,
    });
    return response.message.content;
  } catch (error) {
    console.error('Error querying Ollama:', error);
  }

  return "I am not working yet";
}