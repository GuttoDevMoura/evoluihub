"use client";

import "../globals.css";
import { AdminSessionProvider, useAdminSession } from "../../components/admin/AdminSessionProvider";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading, refresh } = useAdminSession();

  const tenantName = session?.tenant?.name ?? (loading ? "Carregando..." : "Tenant desconhecido");
  const userEmail =
    (session?.user && (session.user.email || String(session.user.id || session.userId || ""))) ||
    session?.userId ||
    (loading ? "..." : "sem usuário");
  const userDisplay =
    (session?.user && (session.user.name || session.user.email)) ||
    session?.userId ||
    (loading ? "..." : "Usuário");
  const initials = useMemo(() => {
    const text = String(userDisplay || "U").trim();
    const parts = text.split(" ");
    if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
    return text.slice(0, 2).toUpperCase();
  }, [userDisplay]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      // ignore
    } finally {
      await refresh();
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] bg-gray-50 text-gray-900">
      <AdminSidebar />
      <div className="flex flex-col min-h-screen">
        <header className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
          <div>
            <div className="text-sm text-gray-500">Tenant</div>
            <div className="font-semibold">{tenantName}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => refresh()}
              className="px-3 py-1 rounded bg-gray-900 text-white text-sm hover:bg-black/80"
            >
              Atualizar sessão
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                  {initials}
                </span>
                <span className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-semibold text-gray-900">{userDisplay}</span>
                  <span className="text-xs text-gray-500">{userEmail}</span>
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded border border-gray-200 bg-white shadow-lg">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-semibold text-gray-900">{userDisplay}</div>
                    <div className="text-xs text-gray-600 truncate">{userEmail}</div>
                  </div>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.push("/app/settings/profile");
                      }}
                      className="px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Editar perfil
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        void handleLogout();
                      }}
                      className="px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sair da plataforma
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSessionProvider>
      <Shell>{children}</Shell>
    </AdminSessionProvider>
  );
}
