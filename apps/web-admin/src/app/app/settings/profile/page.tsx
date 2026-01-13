"use client";

import { useEffect } from "react";
import SettingsUsersPage from "../users/page";

export default function ProfilePage() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash !== "#profile") {
      window.location.hash = "profile";
    }
  }, []);

  return <SettingsUsersPage />;
}

