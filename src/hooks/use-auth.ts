import {create} from 'zustand'
import Cookies from "js-cookie";
import {ClientService} from "@/lib/client.service";

interface AuthState {
  auth: AuthProps
  isAuthenticated: boolean
  setAuth: (auth: AuthProps) => void
  logout: () => void
  loadUser: () => Promise<boolean>,
  isAuthLoading: boolean
}

interface AuthProps {
  id: number,
  name: string,
  email: string,
}

export const useAuth = create<AuthState>((set) => ({
  auth: {
    id: 0,
    name: '',
    email: '',
  },
  isAuthenticated: false,
  isAuthLoading: false,
  setAuth: (auth: AuthProps) => set({auth: auth}),
  logout: () => {
    set({auth: {id: 0, name: '', email: ''}});
    Cookies.remove('auth_token');
  },
  loadUser: async () => {

    set({isAuthLoading: true});
    try {

      const response = await ClientService.api.auth.me();

      if (!response.hasError) {
        console.info('Success to load user:', useAuth)
        set({
          isAuthenticated: true,
          isAuthLoading: false,
          auth: {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
          }
        });
        return true
      }
    } catch (error) {
      console.error('Failed to load user:', error)
    }
    set({
      isAuthenticated: false,
      isAuthLoading: false,
      auth: {id: 0, name: '', email: ''}
    })
    return false
  },
}))
