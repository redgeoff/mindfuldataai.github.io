import { supabaseClient } from "../../../supabase";

const getURL = () => {
  let url = window.location.href;
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
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
