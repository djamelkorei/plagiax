import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

export const Authorize = ({
  roles = [],
  children,
}: {
  roles: ("student" | "instructor")[];
  children?: ReactNode;
}) => {
  const auth = useAuth((s) => s.auth);

  if (!roles.includes(auth.is_instructor ? "instructor" : "student")) {
    return null;
  }

  return <>{children}</>;
};
