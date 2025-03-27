import { Check } from "./Icons";

export default function RCIProgress() {
  return (
    <ol className="relative border-s border-gray-200  ms-3.5">
      <li className="mb-5 ms-7 space-y-3">
        <div className="absolute w-7 h-7 text-white bg-green-600 rounded-full mt-3.5 -start-3.5 border border-white flex items-center justify-center">
          <Check />
        </div>
        <h3 className="text-lg font-bold">Complete RCI</h3>
        <p>Acknowledge your room key and note any issues with your room.</p>
      </li>
      <li className="mb-10 ms-7 space-y-3">
        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white"></div>
        <h3 className="text-lg font-bold">RA Review</h3>
        <p>
          Your RA will now review your RCI and may submit a work order
          as necessary.
        </p>
      </li>
    </ol>
  );
}
