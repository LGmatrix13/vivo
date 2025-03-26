import { useEffect, useState } from "react";

export default function useLocation() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  const [locationGranted, setLocationGranted] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationGranted(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLoading(false);
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return {
    location,
    loading,
    locationGranted,
  };
}
