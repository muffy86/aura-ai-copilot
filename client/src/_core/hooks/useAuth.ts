import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  // FIX #6: Mobile redirect loop
  // The bug: on mobile, when the session cookie expires, the user gets redirected to /login,
  // then to OAuth, then back to /api/oauth/callback, then back to /, but the cookie is still
  // expired so they get redirected again — infinite loop.
  // The fix: track a "redirected" flag in sessionStorage so we only redirect once per session.
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading) return;
    if (meQuery.data) return;
    // Don't redirect if already on the login page
    if (window.location.pathname.startsWith("/login")) return;
    if (window.location.pathname.startsWith("/api/oauth")) return;
    // Don't redirect if we've already tried this session
    if (sessionStorage.getItem("auth-redirected") === "1") {
      console.warn("[useAuth] Mobile redirect loop detected, not redirecting again");
      return;
    }
    sessionStorage.setItem("auth-redirected", "1");
    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, meQuery.isLoading, meQuery.data, redirectPath]);

  const state = useMemo(() => {
    if (meQuery.data) {
      localStorage.setItem(
        "manus-runtime-user-info",
        JSON.stringify(meQuery.data)
      );
    }
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    logoutMutation.mutateAsync,
    utils,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
