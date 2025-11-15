'use client';

import {useEffect} from "react";
import {useAuth} from "@/hooks/use-auth";

export const AuthContext = () => {

  const loadUser = useAuth((s) => s.loadUser)

  useEffect(() => {
    loadUser().then(() => {
      console.log('loaded user')
    });
  }, []);

  return null;

}
