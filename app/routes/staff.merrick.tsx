import { MetaFunction } from "@remix-run/react";
import { useState } from "react";
import QueryForm from "~/components/forms/QueryForm";

export const meta: MetaFunction = () => {
  return [
    { title: "Vivo: Merrick" },
    { name: "Vivo: Merrick", content: "Interactive chat bot" },
  ];
};

export default function StaffMerrick() {
  const [queries, setQueries] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  return (
    <div className="h-[calc(100vh_-_124px)] flex flex-col justify-between px-7 pb-7">
      {!queries.length && (
        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="text-center w-[300px] space-y-3">
            <h2 className="text-2xl font-bold">👋 Hi, I'm Merrick!</h2>
            <p className="text-lg">
              Ask me questions about the Crimison or RA manual for quick
              answers.
            </p>
          </div>
        </div>
      )}
      <div className="space-y-3 overflow-y-auto scrollbar-none p-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {queries.map((query, index) => (
          <>
            <div className="space-y-2 text-right">
              <span className="text-sm font-bold">You</span>
              <div className="bg-gray-100 p-3 rounded-lg ml-auto order-2 w-fit">
                {query}
              </div>
            </div>
            {responses.length > index && (
              <div className="space-y-2">
                <span className="text-sm font-bold">Merrick</span>
                <div className="bg-gray-100 p-3 rounded-lg w-fit">
                  {responses[index]}
                </div>
              </div>
            )}
          </>
        ))}
      </div>
      <div></div>
      <QueryForm
        setQueryState={(query) => {
          setQueries((prev) => [...prev, query]);
        }}
        setReponseState={(response) => {
          const cleanResponse = response.replace(/\\n/g, ' ').replace(/^"|"$/g, '').replace(/\\/g, '');; // cleans up text output
          setResponses((prev) => [...prev, cleanResponse]);
        }}
      />
    </div>
  );
}
