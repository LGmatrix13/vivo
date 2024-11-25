import { Loader } from "./Icons";

export default function Loading() {
  return (
    <div className="space-x-2 flex items-center justify-center">
      <Loader className="animate-spin" />
      <span>Loading...</span>
    </div>
  );
}
