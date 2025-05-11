
import { Session, User, AuthError } from '@supabase/supabase-js';

// Interface for login attempts
export interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

// Interface for password strength result
export interface PasswordStrengthResult {
  score: number;
  feedback: string;
}

// Interface for authenticated user (extends Supabase User with required email)
export interface AuthUser extends Omit<User, 'email'> {
  email: string; // Fazendo email como obrigatório para nossa aplicação
}

// Interface for the context of authentication
export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  passwordStrength: (password: string) => PasswordStrengthResult;
  lastActivity: number | null;
  updateLastActivity: () => void;
  securityStatus: 'secure' | 'warning' | 'danger';
  failedLoginAttempts: number;
  resetFailedLoginAttempts: () => void;
}
