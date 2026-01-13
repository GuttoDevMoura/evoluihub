"use client";

import "../globals.css";
import { MemberSessionProvider, useMemberSession } from "../../components/member/MemberSessionProvider";
import { logout } from "@/lib/api";
import { useRouter } from "next/navigation";

function MemberShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, loading, refresh } = useMemberSession();

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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 p-4 flex items-center justify-between bg-white">
        <div>
          <div className="text-sm text-gray-500">Tenant</div>
          <div className="font-semibold">
            {loading ? "Carregando..." : session?.tenant?.slug ?? "demo"}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          User: {loading ? "..." : session?.user?.email ?? "member-demo"}
        </div>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sair
        </button>
      </header>
      <div className="flex">
        <nav className="w-60 border-r border-gray-200 bg-white p-4">
          <ul className="space-y-2 text-sm">
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/home">Home</a></li>
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/my-courses">Meus Cursos</a></li>
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/progress">Progresso</a></li>
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/gamification">Gamificação</a></li>
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/achievements">Conquistas</a></li>
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/challenges">Desafios</a></li>
            <li><a className="block rounded px-3 py-2 hover:bg-gray-100" href="/app/leaderboard">Ranking</a></li>
          </ul>
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemberSessionProvider>
      <MemberShell>{children}</MemberShell>
    </MemberSessionProvider>
  );
}
