import { FormEvent, useState } from "react";
import Textarea from "../common/Textarea";
import WideButton from "../common/WideButton";

interface IQueryFormProps {
  setQueryState: (query: string) => void;
  setReponseState: (response: string) => void;
}

export default function QueryForm(props: IQueryFormProps) {
  const { setQueryState, setReponseState } = props;
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setQueryState(query);
    setQuery("");
    fetch(`/api/merrick`, {
      method: "POST",
      body: query,
    }).then((response) => {
      response.text().then((text) => {
        setReponseState(text);
      });
    });
  }

  return (
    <div className="flex flex-col space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          name="query"
          placeholder="Ask me anything"
          setState={setQuery}
          required
        />
        <WideButton
          options={{
            type: "submit",
          }}
        >
          Ask
        </WideButton>
      </form>
    </div>
  );
}
