"use client";

import { useAdminSession } from "./AdminSessionProvider";

type Props = {
  permissionKey?: string;
  children: React.ReactNode;
};

export function RequirePermission({ permissionKey, children }: Props) {
  const { session } = useAdminSession();

  if (!permissionKey) {
    return <>{children}</>;
  }

  if (!session) {
    return <div className="text-sm text-gray-600">Sem sessão carregada.</div>;
  }

  if (session.isPlatformAdmin) {
    return <>{children}</>;
  }

  if (session.permissions?.includes(permissionKey)) {
    return <>{children}</>;
  }

  return <div className="text-sm text-gray-600">Sem permissão.</div>;
}
