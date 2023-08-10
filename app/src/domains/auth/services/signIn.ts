import { supabaseClient } from "../../../supabase";

const getURL = () => {
  let url = window.location.href;
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  // Exclude everything after #
  url = url.split("#")[0];
  return url;
};

export const signInWithGitHub = async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: getURL(),
    },
  });
  if (error) {
    console.log(error);
    return;
  }
  console.log(data);
};

export const signUpWithEmailPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ result: "ConfirmationEmailSent" | { error: string } }> => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getURL(),
    },
  });
  if (error) {
    console.log(error);
    return { result: { error: error.message } };
  }
  console.log(data);
  return { result: "ConfirmationEmailSent" };
};

export const signInWithEmailPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ errorMessage?: string }> => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.log(error);
    return { errorMessage: error.message };
  }
  console.log(data);
  return {};
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getURL(),
    },
  });
  if (error) {
    console.log(error);
    return;
  }
  console.log(data);
};
