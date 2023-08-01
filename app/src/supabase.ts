import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dbtdfqgdpjdmqjuozvfn.supabase.co";
// This key is safe to use in a browser if you have enabled Row Level Security (RLS) for your tables and configured policies.
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRidGRmcWdkcGpkbXFqdW96dmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA1NTE3MDYsImV4cCI6MjAwNjEyNzcwNn0.XTF4Xf6PRP35KQ4dA9fSrS63L6z75ymGryI5aZii-d4";
export const supabaseClient = createClient(supabaseUrl, supabaseKey);
