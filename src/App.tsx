
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/auth";
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
import AppLayout from "./components/layout/AppLayout";
import AppRoutes from "./components/layout/AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TooltipProvider>
          <BrowserRouter>
            <GlobalErrorBoundary>
              <AuthProvider>
                <I18nProvider>
                  <CarteirasProvider>
                    <GamificationProvider>
                      <ReferralProvider>
                        <Web3Provider>
                          <ViewModeProvider>
                            <div className="min-h-screen bg-dashboard-dark text-satotrack-text">
                              <RouteValidator />
                              <NavigationAudit />
                              <SecurityIndicator />
                              
                              <AppLayout>
                                <AppRoutes />
                              </AppLayout>
                              
                              <Toaster 
                                position="top-right"
                                theme="dark"
                                richColors
                                closeButton
                              />
                            </div>
                          </ViewModeProvider>
                        </Web3Provider>
                      </ReferralProvider>
                    </GamificationProvider>
                  </CarteirasProvider>
                </I18nProvider>
              </AuthProvider>
            </GlobalErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
