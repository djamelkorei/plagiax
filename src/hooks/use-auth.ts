import Cookies from "js-cookie";
import { create } from "zustand";
import type { AuthDto } from "@/dto/user.dto";
import { ClientService } from "@/lib/client.service";

interface AuthState {
  auth: AuthDto;
  isAuthenticated: boolean;
  setAuth: (auth: AuthDto) => void;
  logout: () => void;
  loadUser: () => Promise<string>;
  isAuthLoading: boolean;
}

const anonymous: AuthDto = {
  id: 0,
  name: "",
  email: "",
  student_count: 0,
  submission_count: 0,
  membership_threshold: 0,
  membership_length: 0,
  membership_student_count: 0,
  membership_started_at: new Date(),
  membership_ended_at: new Date(),
  membership_days_left: 0,
  is_membership_active: false,
  is_instructor: false,
  ai_enabled: false,
  daily_quota: 0,
  submission_day_count: 0,
};

export const useAuth = create<AuthState>((set) => ({
  auth: anonymous,
  isAuthenticated: false,
  isAuthLoading: true,
  setAuth: (auth: AuthDto) => set({ auth: auth }),
  logout: () => {
    set({ auth: anonymous });
    Cookies.remove("auth_token");
  },
  loadUser: async () => {
    set({ isAuthLoading: true });
    try {
      const response = await ClientService.api.auth.me();

      if (!response.hasError) {
        console.info("Success to load user:", useAuth);
        set({
          isAuthenticated: true,
          isAuthLoading: false,
          auth: { ...response.data },
        });
        return response.data.is_instructor ? "instructor" : "student";
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
    set({
      isAuthenticated: false,
      isAuthLoading: false,
      auth: anonymous,
    });
    return "";
  },
}));
