
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

const MainNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === "/" && "text-satotrack-neon font-medium"
            )}>
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
                  location.pathname === "/dashboard" && "text-satotrack-neon font-medium"
                )}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(
                location.pathname.includes("/carteiras") && "text-satotrack-neon font-medium"
              )}>
                Carteiras
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-3 p-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/carteiras"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          location.pathname === "/carteiras" && "bg-accent/50"
                        )}
                      >
                        <div className="text-sm font-medium">Gerenciar Carteiras</div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
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
                        <div className="text-sm font-medium">Nova Carteira</div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          Adicionar uma nova carteira ao seu portfólio
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </>
        )}
        
        <NavigationMenuItem>
          <Link to="/sobre">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              location.pathname === "/sobre" && "text-satotrack-neon font-medium"
            )}>
              Sobre
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
