import { ActionFunctionArgs } from "@remix-run/node";
import axios from "axios";

const OLLAMA_SERVER = 'http://10.18.101.96:11434';
const OLLAMA_MODEL = 'llama3.2:1b';

export async function action({ request }: ActionFunctionArgs) {

  const query = await request.text();
  console.log(`Query is ${query}`);

  try {
    console.log(`${OLLAMA_SERVER}/api/generate`);
    const response = await axios.post(`${OLLAMA_SERVER}/api/generate`, {
        model: OLLAMA_MODEL,
        prompt: query,
        stream: false,
    });
    return response.data.response;
  } catch (error) {
    console.error('Error querying Ollama:', error);
  }

  return Response("I am not working yet");
}
