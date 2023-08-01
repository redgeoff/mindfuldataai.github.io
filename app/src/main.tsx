import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { signInWithGitHub, useAuth, logOut } from "./domains/auth";
import { Button, Card, Logo } from "./components";

const App = () => {
  const { session } = useAuth();
  const { email } = session?.user ?? {};

  const generateCode = useMutation(["code"], async () => {
    const resp = await fetch(
      "https://stage-chatgpt-plugin.mindfuldataai.com/oauth/code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
      },
    );

    if (resp.ok) {
      return (await resp.json()) as { code: string };
    }
    throw new Error("Failed to fetch code");
  });

  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Got this when redirected from openai
    // ?response_type=code&client_id=9dae8ff7b6f785b4a48846f2175817a2b001404d0db41b223dabaf1e5353bf79&redirect_uri=https%3A%2F%2Fchat.openai.com%2Faip%2Fplugin-00da9e36-48d8-4c59-b24c-59a66fe16de5%2Foauth%2Fcallback&scope=&state=40e1fab4-c8c5-4258-a689-7717e98013c1

    const params = new URLSearchParams(window.location.search);
    const redirectUri = params.get("redirect_uri");
    const state = params.get("state");

    // We should check to see if there's a redirect_uri in the query string.
    // If there is, we should redirect to that URL.
    if (email && redirectUri && state) {
      // First, we should fetch the code
      console.log({ redirectUri, state });
      generateCode
        .mutateAsync()
        .then((response) => {
          console.log({ response });
          // Now we should redirect to the redirect_uri with the code and state
          const url = new URL(redirectUri!);
          url.searchParams.set("code", response.code);
          // The state may have a `/` at the end.
          // We should remove it.
          const processedState = state.replace(/\/$/, "");
          url.searchParams.set("state", processedState!);
          window.location.href = url.toString();
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [email]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-[#ff80b5] to-[#9089fc]">
      {/* Card */}
      <Card>
        <Logo />
        {!email && (
          <>
            <div className="mb-4">
              Get started with the plugin by signing in.
            </div>
            <Button onClick={signInWithGitHub}>Sign in with GitHub</Button>
          </>
        )}
        {email && (
          <div className="">
            <div className="mb-4">
              Hi <b>{email}</b> <br />
            </div>
            {generateCode.isLoading && <div>Redirecting back to OpenAI...</div>}
            {generateCode.isError && <div>Error: {error}</div>}

            <Button onClick={logOut}>Log out</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

const root = document.getElementById("appRoot");
if (!root) {
  throw new Error("No root element");
}
const queryClient = new QueryClient();
createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
