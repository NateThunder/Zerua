type LogoMarkProps = {
  className?: string;
};

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <picture className={className}>
      <source
        media="(prefers-color-scheme: dark)"
        srcSet="/media/zerua-icon-logo-white.png"
      />
      <img
        src="/media/zerua-icon-logo-white.png"
        alt="Zerua Music logo"
        className="h-full w-full object-contain"
      />
    </picture>
  );
}
