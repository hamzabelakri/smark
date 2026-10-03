import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import React from "react";
import { ChevronDown } from "lucide-react";
import { ChangePasswordModal } from "./ui/change-password-modal";
import { useLogout } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";

export function ProfileDropdown() {
  const { t } = useTranslation();
  const { mutate: logout, isPending } = useLogout();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = React.useState(false);

  const user = useAuthStore((state) => state.user);
  
  const fullName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email || "User";

  // If your user object has a role property, it will display nicely here
  const role = user?.role; 
  const avatarSrc = user?.avatar; // Optional: change if your avatar property name differs

  // Helper to extract initials (e.g., "John Doe" -> "JD")
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] || "";
    const last = lastName?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  const initials = getInitials(user?.first_name, user?.last_name);

  const handleLogout = () => {
    if (!user) return;

    logout({
      first_name: user?.first_name,
      last_name: user?.last_name,
    });
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-muted ps-1.5 pe-2 text-start transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:pe-3"
          >
            <Avatar className="size-8">
              <AvatarImage src={avatarSrc} alt={fullName} />
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden leading-tight sm:grid">
              <span className="truncate text-xs font-semibold">{fullName}</span>
              {role && (
                <span className="truncate text-[10px] text-muted-foreground">
                  {role}
                </span>
              )}
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" sideOffset={8} className="bg-card w-56" forceMount>
          <DropdownMenuLabel className="grid leading-tight font-normal">
            <span className="text-sm font-medium">{fullName}</span>
            {role ? (
              <span className="text-xs text-muted-foreground">{role}</span>
            ) : (
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsChangePasswordOpen(true)}
            >
              {t("change_password")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={handleLogout}
            className="cursor-pointer"
          >
            {t("log_out")}
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangePasswordModal
        user={user}
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </>
  );
}