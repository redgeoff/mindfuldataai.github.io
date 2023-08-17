import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import {
  signUpWithEmailPassword,
  signInWithEmailPassword,
  useAuth,
  logOut,
  signInWithProvider,
  AuthProvider,
  useAvailableAuthProviders,
} from "./domains/auth";
import { Button, Card, Logo } from "./components";
import { useGA4Event } from "./hooks/useGA4Event";

const App = () => {
  const { session } = useAuth();
  const { email } = session?.user ?? {};
  const availableOAuthProviders: AuthProvider[] = useAvailableAuthProviders();

  const generateCode = useMutation(["code"], async () => {
    const resp = await fetch(
      "https://chatgpt-plugin.mindfuldataai.com/oauth/code",
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

  const { sendEvent } = useGA4Event();
  useEffect(() => {
    // If we have an email, we should send an event to GA4
    if (email) {
      sendEvent("login", {});
    }
  }, [email]);

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

  const [inputEmailAddress, setInputEmailAddress] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const [isCreatingAccount, setIsCreatingAccount] = useState(true);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-[#ff80b5] to-[#9089fc]">
      {/* Card */}
      <Card>
        <Logo />
        {!email && (
          <>
            <div className="mb-4">
              Get started with the plugin by{" "}
              {isCreatingAccount ? "creating an account" : "signing in"}.
            </div>

            {/* An email and password input */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 mb-3 border rounded-md outline-none"
                value={inputEmailAddress}
                onChange={(e) => setInputEmailAddress(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 mb-3 border rounded-md outline-none"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
              <Button
                onClick={async () => {
                  setStatus(null);
                  if (isCreatingAccount) {
                    const { result } = await signUpWithEmailPassword({
                      email: inputEmailAddress,
                      password: inputPassword,
                    });
                    if (result == "ConfirmationEmailSent") {
                      setStatus({
                        ok: true,
                        message: "Confirmation email sent",
                      });
                    } else if (result.error) {
                      setStatus({
                        ok: false,
                        message: result.error,
                      });
                    } else {
                      setStatus({
                        ok: false,
                        message: "Something went wrong",
                      });
                    }
                  } else {
                    const { errorMessage } = await signInWithEmailPassword({
                      email: inputEmailAddress,
                      password: inputPassword,
                    });
                    if (errorMessage) {
                      setStatus({
                        ok: false,
                        message: errorMessage,
                      });
                    }
                  }
                }}
              >
                {isCreatingAccount ? "Create account" : "Sign in"}
              </Button>

              {/* Render status */}
              {status && (
                <div className={status.ok ? "text-green-500" : "text-red-500"}>
                  {status.message}
                </div>
              )}
            </div>
            <hr className="my-4 border-gray-300" />
            {/* already have an account? */}
            <div className="mb-4">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => setIsCreatingAccount(!isCreatingAccount)}
              >
                {isCreatingAccount
                  ? "Already have an account?"
                  : "Create an account"}
              </button>
            </div>
            {/* A divider with "or" in the center */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-full h-px bg-gray-300"></div>
              <div className="px-3 text-gray-500">or</div>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
            {/* Social login buttons */}
            <div className="mb-4">
              {availableOAuthProviders.map((provider) => (
                <Button
                  key={provider.providerId}
                  onClick={() =>
                    signInWithProvider({ provider: provider.providerId })
                  }
                >
                  Sign {isCreatingAccount ? "up" : "in"} with {provider.name}
                </Button>
              ))}
            </div>
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
