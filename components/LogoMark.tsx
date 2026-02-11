type LogoMarkProps = {
  className?: string;
  variant?: "light" | "dark";
};

export function LogoMark({ className, variant = "light" }: LogoMarkProps) {
  const src =
    variant === "dark"
      ? "/media/zerua-icon-logo-black.png"
      : "/media/zerua-icon-logo-white.png";

  return (
    <div className={className}>
      <img src={src} alt="Zerua Music logo" className="h-full w-full object-contain" />
    </div>
  );
}
