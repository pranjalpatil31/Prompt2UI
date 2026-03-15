"use client";

import { useEffect, useState } from "react";

import { useTheme } from "next-themes";
import Logo from "../../../components/logo";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon, UserIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useKindeBrowserClient();
  const isDark = theme === "dark";
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // if (!mounted) return null;

  return (
    <div className="sticky top-0 right-0 z-30">
      <header className="h-16 border-b bg-background backdrop-blur">
        <div className="mx-auto grid h-full max-w-6xl grid-cols-3 items-center px-4">

          {/* Left Section */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center Section */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative h-8 w-8 rounded-full"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              <SunIcon
                className={cn(
                  "absolute h-5 w-5 transition-all",
                  isDark ? "scale-100 rotate-0" : "scale-0 -rotate-90"
                )}
              />
              <MoonIcon
                className={cn(
                  "absolute h-5 w-5 transition-all",
                  isDark ? "scale-0 rotate-90" : "scale-100 rotate-0"
                )}
              />
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/30 hover:scale-110 transition duration-200">
                    <AvatarImage src={user?.picture || ""} />
                    <AvatarFallback className="bg-primary text-white">
                      {user?.given_name?.charAt(0)}
                      {user?.family_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 rounded-2xl border bg-background/95 backdrop-blur-xl shadow-2xl p-2"
                >
                  {/* User Profile Section */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                    <Avatar className="h-11 w-11 border">
                      <AvatarImage src={user?.picture || ""} />
                      <AvatarFallback>
                        {user?.given_name?.charAt(0)}
                        {user?.family_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {user?.given_name} {user?.family_name}
                      </span>

                      <span className="text-xs text-muted-foreground truncate max-w-">
                        {user?.email}
                      </span>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Menu Items */}

                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer hover:bg-muted transition">
                    <UserIcon className="h-4 w-4 text-primary" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2 rounded-lg cursor-pointer hover:bg-muted transition">
                    <SettingsIcon className="h-4 w-4 text-indigo-500" />
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />

                  {/* Logout */}

                  <DropdownMenuItem asChild>
                    <LogoutLink className="flex items-center gap-2 text-indigo-600 rounded-lg hover:bg-indigo-500/10 cursor-pointer">
                      <LogOutIcon className="h-4 w-4" />
                      Logout
                    </LogoutLink>
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginLink>
                <Button className="rounded-full px-5">
                  Start Designing
                </Button>
              </LoginLink>
            )}
          </div>

        </div>
      </header>
    </div>
  );
};

export default Header;

//  kindeauth
//  mongodb
//  react
//  nextjs
//  openrouter thme eneartor twecan , ai sdk 
//  inngest
//  unsplash image api 
// vercel-ai gateway key