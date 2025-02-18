import { ActionFunctionArgs } from "@remix-run/node";
import { Ollama } from 'ollama';

const OLLAMA_SERVER = 'http://10.18.101.96:11434';
const OLLAMA_MODEL = 'llama3.2:1b';

const ollama = new Ollama({host: OLLAMA_SERVER});

export async function action({ request }: ActionFunctionArgs) {

  const query = await request.text();

  try {
    const response = await ollama.chat({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: query}],
      stream: false,
    });
    return response.message.content;
  } catch (error) {
    console.error('Error querying Ollama:', error);
  }

  return "I am not working yet";
}