import { ArrowLeftIcon, ChevronUpIcon, Settings2Icon, UserCircleIcon } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

import { useClientSettings } from "~/hooks/useSettings";
import { ProfileAvatar } from "./ProfileAvatar";
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuShortcut, MenuTrigger } from "../ui/menu";
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
  shortcut,
  onClick,
}: {
  icon: typeof UserCircleIcon;
  label: string;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <MenuItem className="min-h-10 gap-2.5 rounded-lg px-3 py-1.5 text-sm" onClick={onClick}>
      <Icon className="size-4 text-muted-foreground/85" />
      <span className="min-w-0 flex-1">{label}</span>
      {shortcut ? <MenuShortcut>{shortcut}</MenuShortcut> : null}
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
    <SidebarFooter className="gap-1 p-2">
      <Menu>
        <MenuTrigger
          render={
            <SidebarMenuButton
              aria-label={`Open ${profileName} profile menu`}
              className="h-11 gap-2.5 rounded-xl px-2.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground data-popup-open:bg-accent"
            />
          }
        >
          <ProfileAvatar name={profileName} image={profileImage} size="sm" />
          <span className="min-w-0 flex-1 truncate font-medium">{profileName}</span>
          <ChevronUpIcon className="size-3.5 shrink-0 text-muted-foreground/60" />
        </MenuTrigger>
        <MenuPopup
          align="start"
          side="top"
          sideOffset={8}
          className="w-72 rounded-xl border-border/80 bg-popover shadow-xl"
        >
          <div className="flex items-center gap-3 px-3 py-2.5">
            <ProfileAvatar name={profileName} image={profileImage} size="md" />
            <p className="min-w-0 truncate text-sm font-semibold text-foreground">{profileName}</p>
          </div>
          <MenuSeparator className="mx-3 my-1 bg-border/60" />
          <ProfileMenuItem
            icon={UserCircleIcon}
            label="Profile"
            onClick={() => handleNavigate("/settings/profile")}
          />
          <ProfileMenuItem
            icon={Settings2Icon}
            label="Settings"
            shortcut="Ctrl+,"
            onClick={() => handleNavigate("/settings/general")}
          />
        </MenuPopup>
      </Menu>
      {includeBack ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="default"
              className="gap-2 rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => {
                if (isMobile) setOpenMobile(false);
                void navigate({ to: "/" });
              }}
            >
              <ArrowLeftIcon className="size-3.5" />
              <span>Back to chats</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : null}
    </SidebarFooter>
  );
}
