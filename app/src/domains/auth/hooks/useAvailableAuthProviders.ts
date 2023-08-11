import { useEffect, useState } from "react";
import { supabaseClient } from "../../../supabase";
import { Provider } from "@supabase/supabase-js";

export type AuthProvider = {
  name: string;
  providerId: Provider;
};

export const useAvailableAuthProviders = () => {
  const [availableAuthProviders, setAvailableAuthProviders] = useState<
    AuthProvider[]
  >([]);

  useEffect(() => {
    supabaseClient
      .from("feature_flag")
      .select("*")
      .eq("name", "enabled_auth_providers")
      .then(({ data, error }) => {
        if (data && data.length > 0) {
          setAvailableAuthProviders(data[0].value);
        }
      });
  }, []);

  return availableAuthProviders;
};
