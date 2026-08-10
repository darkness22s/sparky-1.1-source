import { cn } from "~/lib/utils";

const SIZE_CLASSES = {
  sm: "size-6 text-[9px]",
  md: "size-7 text-[10px]",
  lg: "size-24 text-4xl",
} as const;

export type ProfileAvatarSize = keyof typeof SIZE_CLASSES;

export function profileInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (words.length === 0) return "SP";
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("");
}

export function ProfileAvatar({
  name,
  image,
  size = "md",
  className,
  alt = "",
}: {
  name: string;
  image?: string | null;
  size?: ProfileAvatarSize;
  className?: string;
  alt?: string;
}) {
  const imageUrl = image?.trim();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#849092] font-medium text-white ring-1 ring-black/12 dark:ring-white/10",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {imageUrl ? (
        <img alt={alt} className="size-full object-cover" src={imageUrl} />
      ) : (
        <span aria-hidden="true">{profileInitials(name)}</span>
      )}
    </span>
  );
}
