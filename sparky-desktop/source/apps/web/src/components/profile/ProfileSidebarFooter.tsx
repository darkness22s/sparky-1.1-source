import { ChevronUpIcon, Settings2Icon, UserCircleIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { useClientSettings } from "~/hooks/useSettings";
import { ProfileAvatar } from "./ProfileAvatar";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from "../ui/menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

function ProfileMenuItem({
  icon: Icon,
  label,
  description,
  onClick,
}: {
  icon: typeof UserCircleIcon;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <MenuItem className="min-h-11 gap-2.5 py-1.5" onClick={onClick}>
      <Icon className="size-4 text-muted-foreground" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium leading-tight">{label}</span>
        <span className="truncate text-[11px] leading-tight text-muted-foreground">
          {description}
        </span>
      </span>
    </MenuItem>
  );
}

export function ProfileSidebarFooter({ includeBack = false }: { includeBack?: boolean }) {
  const navigate = useNavigate();
  const { isMobile, setOpenMobile } = useSidebar();
  const profileName = useClientSettings((settings) => settings.profileName);
  const profileImage = useClientSettings((settings) => settings.profileImage);

  const handleNavigate = (to: "/settings/profile" | "/settings/general") => {
    if (isMobile) setOpenMobile(false);
    void navigate({ to });
  };

  return (
    <SidebarFooter className="gap-1.5 p-2">
      <Menu>
        <MenuTrigger
          render={
            <SidebarMenuButton
              aria-label={`Open ${profileName} profile menu`}
              className="h-10 gap-2.5 rounded-xl px-2 text-left text-muted-foreground hover:bg-accent hover:text-foreground data-popup-open:bg-accent"
            />
          }
        >
          <ProfileAvatar name={profileName} image={profileImage} size="sm" />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">{profileName}</span>
          <ChevronUpIcon className="size-3.5 shrink-0 text-muted-foreground/70" />
        </MenuTrigger>
        <MenuPopup align="start" side="top" sideOffset={8} className="w-64">
          <div className="flex items-center gap-3 px-2 py-2">
            <ProfileAvatar name={profileName} image={profileImage} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{profileName}</p>
              <p className="truncate text-xs text-muted-foreground">Personal workspace</p>
            </div>
          </div>
          <MenuSeparator />
          <ProfileMenuItem
            icon={UserCircleIcon}
            label="Profile"
            description="Usage and profile details"
            onClick={() => handleNavigate("/settings/profile")}
          />
          <ProfileMenuItem
            icon={Settings2Icon}
            label="Settings"
            description="Customize your Sparky workspace"
            onClick={() => handleNavigate("/settings/general")}
          />
        </MenuPopup>
      </Menu>
      {includeBack ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className="gap-2 px-2 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                void navigate({ to: "/" });
              }}
            >
              <span aria-hidden="true">←</span>
              <span>Back to chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : null}
    </SidebarFooter>
  );
}
