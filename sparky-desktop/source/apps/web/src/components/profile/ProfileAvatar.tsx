import { cn } from "~/lib/utils";

const SIZE_CLASSES = {
  sm: "size-7 text-[10px]",
  md: "size-10 text-sm",
  lg: "size-20 text-2xl",
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
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-400 via-indigo-500 to-cyan-400 font-semibold text-white shadow-sm ring-1 ring-black/8 dark:ring-white/12",
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
