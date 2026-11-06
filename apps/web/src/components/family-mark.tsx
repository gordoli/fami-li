import Image from "next/image";

export function FamilyMark({
  size,
  className,
  priority = false,
}: {
  size: number;
  className: string;
  priority?: boolean;
}) {
  return (
    <picture className="family-mark-picture">
      <source
        media="(prefers-reduced-motion: reduce)"
        srcSet="/brand/fami-li-adventure.png"
      />
      <Image
        src="/brand/fami-li-adventure.gif"
        alt=""
        width={size}
        height={size}
        className={className}
        priority={priority}
      />
    </picture>
  );
}
