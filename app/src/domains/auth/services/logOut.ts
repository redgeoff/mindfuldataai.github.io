import { supabaseClient } from "../../../supabase";

export const logOut = async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.log(error);
    return;
  }
  console.log("Signed out!");
};
