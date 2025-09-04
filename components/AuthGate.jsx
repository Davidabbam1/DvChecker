import { useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase-config";

export default function AuthGate({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
   
    const unsubscribe = onAuthStateChanged(auth, (user) => {

      // Check where we are
      const inAuthGroup = segments[0] === "(auth)";

      if (!user && !inAuthGroup) {
        router.replace("/(auth)");
      } else if (user && inAuthGroup) {
        router.replace("/(tabs)");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [segments]);

  if (loading) return null; // loader/spinner

  return children;
}
