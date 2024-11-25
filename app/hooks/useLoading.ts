import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function useLoading() {
  const { state } = useNavigation();
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelay(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return {
    loading: delay || state === "loading",
  };
}
