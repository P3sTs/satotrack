
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth";
import { Home, Wallet, Info, Shield, Mail, Code, CreditCard } from "lucide-react";

const MainNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <NavigationMenu className="mx-auto">
      <NavigationMenuList className="flex justify-center">
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "flex items-center",
              location.pathname === "/" && "text-satotrack-neon font-medium"
            )}>
              <Home className="h-4 w-4 mr-1.5" />
              Início
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {user && (
          <>
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center",
                  location.pathname === "/dashboard" && "text-satotrack-neon font-medium"
                )}>
                  <Mail className="h-4 w-4 mr-1.5" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(
                "flex items-center",
                location.pathname.includes("/carteiras") && "text-satotrack-neon font-medium"
              )}>
                <Wallet className="h-4 w-4 mr-1.5" />
                Carteiras
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[240px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/carteiras"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          location.pathname === "/carteiras" && "bg-accent/50"
                        )}
                      >
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          <div className="text-sm font-medium">Gerenciar Carteiras</div>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground mt-1">
                          Visualize e gerencie suas carteiras Bitcoin
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/nova-carteira"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          location.pathname === "/nova-carteira" && "bg-accent/50"
                        )}
                      >
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          <div className="text-sm font-medium">Nova Carteira</div>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground mt-1">
                          Adicionar uma nova carteira ao seu portfólio
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/api">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "flex items-center",
                  location.pathname === "/api" && "text-satotrack-neon font-medium"
                )}>
                  <Code className="h-4 w-4 mr-1.5" />
                  API
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </>
        )}
        
        <NavigationMenuItem>
          <Link to="/planos">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "flex items-center",
              location.pathname === "/planos" && "text-satotrack-neon font-medium"
            )}>
              <CreditCard className="h-4 w-4 mr-1.5" />
              Planos
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/sobre">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "flex items-center",
              location.pathname === "/sobre" && "text-satotrack-neon font-medium"
            )}>
              <Info className="h-4 w-4 mr-1.5" />
              Sobre
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/privacidade">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "flex items-center",
              location.pathname === "/privacidade" && "text-satotrack-neon font-medium"
            )}>
              <Shield className="h-4 w-4 mr-1.5" />
              Privacidade
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
