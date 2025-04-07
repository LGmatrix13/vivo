import { Loader } from "./Icons";

interface LoadingProps {
  title?: string;
}

/**
 * loading indicator
 */
export default function Loading(props: LoadingProps) {
  return (
    <div className="space-x-2 flex items-center justify-center">
      <Loader className="animate-spin" />
      <span>{props.title || "Loading..."}</span>
    </div>
  );
}
