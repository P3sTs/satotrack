
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type AuthUser = SupabaseUser;
export type User = SupabaseUser; // Export User type explicitly

export type PlanType = 'free' | 'premium' | 'enterprise';

export interface AuthContextType {
  // Loading states
  isRegistering: boolean;
  setIsRegistering: (value: boolean) => void;
  isLoggingIn: boolean;
  setIsLoggingIn: (value: boolean) => void;
  isLoggingOut: boolean;
  setIsLoggingOut: (value: boolean) => void;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  
  // Authentication state
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  isGuestMode: boolean;
  
  // Password management
  apiToken: string | null;
  setApiToken: (token: string | null) => void;
  tempPassword: string | null;
  setTempPassword: (password: string | null) => void;
  passwordResetEmailSent: boolean;
  setPasswordResetEmailSent: (sent: boolean) => void;
  
  // Auth functions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  
  // Computed properties
  isAuthenticated: boolean;
  lastActivity: Date | null;
  updateLastActivity: () => void;
  securityStatus: 'secure' | 'warning' | 'danger';
  failedLoginAttempts: number;
  resetFailedLoginAttempts: () => void;
  
  // Plan and API management
  userPlan: PlanType;
  apiRequestsUsed: number;
  apiRequestsRemaining: number;
  upgradeUserPlan: (newPlan?: PlanType) => Promise<void>;
  generateApiToken: () => Promise<string>;
  canAddMoreWallets: (currentWallets: number) => boolean;
  passwordStrength: (password: string) => { score: number; feedback: string };
  createCheckoutSession: (priceId: string) => Promise<{ url: string }>;
  openCustomerPortal: () => Promise<{ url: string }>;
  checkSubscriptionStatus: () => Promise<void>;
  isLoading: boolean;
  
}

export interface SecurityStatus {
  status: 'secure' | 'warning' | 'danger';
  lastLogin?: Date;
  suspiciousActivity?: boolean;
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
