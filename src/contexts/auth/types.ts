
import { User, Session } from '@supabase/supabase-js';

export type AuthUser = User;

export type PlanType = 'free' | 'premium' | 'enterprise';

export interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, referralCode?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  lastActivity: Date | null;
  updateLastActivity: () => void;
  securityStatus: 'normal' | 'warning' | 'danger';
  failedLoginAttempts: number;
  resetFailedLoginAttempts: () => void;
  userPlan: PlanType;
  apiToken: string | null;
  apiRequestsRemaining: number;
  upgradeUserPlan: (newPlan: PlanType) => Promise<void>;
  generateApiToken: () => Promise<string>;
  canAddMoreWallets: () => boolean;
  passwordStrength: (password: string) => { score: number; feedback: string };
  createCheckoutSession: (priceId: string) => Promise<{ url: string }>;
  openCustomerPortal: () => Promise<{ url: string }>;
  checkSubscriptionStatus: () => Promise<void>;
  isLoading: boolean;
}

export interface SecurityStatus {
  status: 'normal' | 'warning' | 'danger';
  lastLogin?: Date;
  suspiciousActivity?: boolean;
}
