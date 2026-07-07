import Link from "next/link";

type Variant = "dark" | "light";

export function BrandLogo({
  href = "/dashboard/",
  variant = "dark",
  size = "md",
}: {
  href?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
}) {
  const text = variant === "dark" ? "text-white" : "text-slate-900";
  const accent = "text-amber-400";
  const icon =
    variant === "dark"
      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900"
      : "bg-gradient-to-br from-amber-500 to-amber-600 text-white";
  const sizes = { sm: "text-base gap-2", md: "text-lg gap-2.5", lg: "text-xl gap-3" };
  const iconSizes = { sm: "h-7 w-7 text-sm", md: "h-8 w-8 text-base", lg: "h-10 w-10 text-lg" };

  return (
    <Link href={href} className={`inline-flex items-center font-bold tracking-tight ${sizes[size]} ${text}`}>
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg font-black shadow-sm shadow-amber-500/30 ${icon} ${iconSizes[size]}`}
        aria-hidden
      >
        €
      </span>
      <span>
        Doekoe<span className={accent}>Wijs</span>
      </span>
    </Link>
  );
}