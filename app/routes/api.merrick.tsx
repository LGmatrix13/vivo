import { ActionFunctionArgs } from "@remix-run/node";
import ollama from "ollama";

export async function action({ request }: ActionFunctionArgs) {
  const query = await request.text();
  console.log(`Query is ${query}`);

  // TODO: send to ollama

  //   const response = await ollama.chat({
  //     model: "llama3.1",
  //     messages: [{ role: "user", content: "Why is the sky blue?" }],
  //   });

  const response = "I am not working yet";
  return new Response(response);
}
