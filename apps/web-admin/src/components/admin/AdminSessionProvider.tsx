"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAdminMe, type AdminSession } from "../../lib/api";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true";

type AdminSessionContext = {
  session: AdminSession | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const AdminSessionCtx = createContext<AdminSessionContext>({
  session: null,
  loading: true,
  error: null,
  refresh: async () => {},
});

export function useAdminSession() {
  return useContext(AdminSessionCtx);
}

export function AdminSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminMe();
      setSession(data);
    } catch (err: any) {
      setSession(null);
      const message = err?.message || "Não foi possível carregar a sessão do admin.";
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
    <AdminSessionCtx.Provider value={{ session, loading, error, refresh: load }}>
      {children}
    </AdminSessionCtx.Provider>
  );
}
