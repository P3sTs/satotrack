
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/theme/ThemeContext";
import { AuthProvider } from "./contexts/auth";
import { BiometricProvider } from "./contexts/BiometricContext";
import { I18nProvider } from "./contexts/i18n/I18nContext";
import { CarteirasProvider } from "./contexts/carteiras/CarteirasProvider";
import { GamificationProvider } from "./contexts/gamification/GamificationContext";
import { ReferralProvider } from "./contexts/referral/ReferralContext";
import { Web3Provider } from "./contexts/web3/Web3Context";
import { ViewModeProvider } from "./contexts/ViewModeContext";
import GlobalErrorBoundary from "./components/error/GlobalErrorBoundary";
import RouteValidator from "./components/validation/RouteValidator";
import { SecurityIndicator } from "./components/SecurityIndicator";
import NavigationAudit from "./components/navigation/NavigationAudit";
import AppContent from "./components/layout/AppContent";
import AppRoutes from "./components/layout/AppRoutes";
import { SidebarProvider } from "@/components/ui/sidebar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <GlobalErrorBoundary>
              <AuthProvider>
                <BiometricProvider>
                  <I18nProvider>
                    <CarteirasProvider>
                      <GamificationProvider>
                        <ReferralProvider>
                          <Web3Provider>
                            <ViewModeProvider>
                            <SidebarProvider>
                              <div className="min-h-screen bg-background text-foreground w-full">
                                <RouteValidator />
                                <NavigationAudit />
                                <SecurityIndicator />
                                
                <AppContent>
                  <AppRoutes />
                </AppContent>
                                
                                 <Toaster 
                                   position="top-right"
                                   richColors
                                   closeButton
                                 />
                              </div>
                            </SidebarProvider>
                            </ViewModeProvider>
                          </Web3Provider>
                        </ReferralProvider>
                      </GamificationProvider>
                    </CarteirasProvider>
                  </I18nProvider>
                </BiometricProvider>
              </AuthProvider>
            </GlobalErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
