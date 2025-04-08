import React, { Dispatch, FormEvent, useState } from "react";
import Textarea from "../common/Textarea";
import WideButton from "../common/WideButton";

interface IQueryFormProps {
  setLoading: Dispatch<boolean>;
  onQuery: (query: string) => void;
  onReponse: (response: string) => void;
}

/**
 * form to query merrick
 */
export default function QueryForm(props: IQueryFormProps) {
  const { setLoading, onQuery, onReponse } = props;
  const [query, setQuery] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    onQuery(query);
    setQuery("");
    setLoading(true);
    fetch(`/api/merrick`, {
      method: "POST",
      body: query,
    }).then((response) => {
      response.text().then((text) => {
        setLoading(false);
        onReponse(text);
      });
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      // Submit form on Enter
      e.preventDefault();
      handleSubmit(e as any);
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          name="query"
          placeholder="Ask me anything"
          value={query}
          setState={setQuery}
          onKeyDown={handleKeyDown}
          required
        />
        <WideButton
          options={{
            type: "submit",
          }}
        >
          Ask
        </WideButton>
        <p className="text-center text-sm">
          Merrick can make mistakes. Do not share private/sensitive information
          with Merrick.
        </p>
      </form>
    </div>
  );
}
