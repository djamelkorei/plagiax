"use client";

import { useAuth } from "@/hooks/use-auth";

export const useAuthorize = (roles: ("student" | "instructor")[] = []) => {
  const auth = useAuth((s) => s.auth);

  return roles.includes(auth.is_instructor ? "instructor" : "student");
};
