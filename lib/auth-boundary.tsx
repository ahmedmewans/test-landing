"use client";

import { AuthBoundary } from "@convex-dev/better-auth/react";
import type { PropsWithChildren } from "react";
import { useRouter } from "@/i18n/navigation";
import { api } from "../../convex/_generated/api";
import { authClient } from "./auth-client";
import { isAuthError } from "./utils";

export const ClientAuthBoundary = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  return (
    <AuthBoundary
      authClient={authClient}
      onUnauth={() => router.push("/sign-in")}
      getAuthUserFn={api.auth.getCurrentUser}
      isAuthError={isAuthError}
    >
      {children}
    </AuthBoundary>
  );
};
