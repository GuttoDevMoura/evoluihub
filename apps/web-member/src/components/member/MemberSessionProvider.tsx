"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMemberMe, type MemberMe, DEV_MODE } from "../../lib/api";

type MemberSessionContext = {
  session: MemberMe | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const MemberSessionCtx = createContext<MemberSessionContext>({
  session: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function useMemberSession() {
  return useContext(MemberSessionCtx);
}

export function MemberSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<MemberMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMemberMe();
      setSession(data);
    } catch (err: any) {
      setSession(null);
      const message = err?.message || "Falha ao carregar sessão";
      setError(message);
      if (!DEV_MODE && message === "unauthorized") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <MemberSessionCtx.Provider value={{ session, loading, error, refresh: load }}>
      {children}
    </MemberSessionCtx.Provider>
  );
}
