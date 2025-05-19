
import { Session, User } from '@supabase/supabase-js';

export type PlanType = 'free' | 'premium';

export interface SecuritySettings {
  twoFactorEnabled?: boolean;
  lastPasswordChange?: Date;
  securityQuestionEnabled?: boolean;
  loginNotificationsEnabled?: boolean;
}

export interface AuthUser extends User {
  email: string;
  plan?: PlanType;
  securityStatus?: 'secure' | 'warning' | 'danger';
}

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
  passwordStrength: (password: string) => { score: number; feedback: string };
  lastActivity: number | null;
  updateLastActivity: () => void;
  securityStatus: 'secure' | 'warning' | 'danger';
  failedLoginAttempts: number;
  resetFailedLoginAttempts: () => void;
  forgotPassword?: (email: string) => Promise<void>;
  resetPassword?: (password: string) => Promise<void>;
  updateUserProfile?: (profileData: Partial<AuthUser>) => Promise<void>;
  updateSecuritySettings?: (settings: Partial<SecuritySettings>) => Promise<void>;
  securitySettings?: SecuritySettings;
  isLockedOut?: boolean;
  lockoutEnd?: Date | null;
  upgradeUserPlan?: () => Promise<void>;
  userPlan: PlanType;
  canAddMoreWallets: (currentWallets: number) => boolean;
  generateApiToken?: () => Promise<string>;
  apiToken?: string | null;
  apiRequestsRemaining?: number;
}

export interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
}

export interface PasswordStrengthResult {
  score: number;
  feedback: string;
}
