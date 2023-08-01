import { useEffect, useState } from "react";
import { supabaseClient } from "../../../supabase";
import { Session } from "@supabase/supabase-js";

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log({ event, session });
      setSession(session);
    });
    return subscription.unsubscribe;
  }, []);
  return { session };
};
