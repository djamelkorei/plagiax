"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { socket } from "@/lib/socket";

interface NotificationListenerProps {
  callback: () => void;
}

export const NotificationListener = ({
  callback,
}: NotificationListenerProps) => {
  const auth = useAuth((s) => s.auth);

  useEffect(() => {
    if (!auth?.id) return;

    const channel = `notification_${auth.id}_new_submission`;

    const handler = () => {
      if (callback) callback();
    };

    socket.on(channel, handler);

    return () => {
      socket.off(channel, handler);
    };
  }, [auth?.id, callback]);

  return null;
};
