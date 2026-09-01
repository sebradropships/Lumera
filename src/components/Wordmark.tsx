import Image from "next/image";
import { logo } from "@/data/brand";
import GelWordmark from "@/components/GelWordmark";

type Props = {
  /** Unique per instance — the gel mark's filter ids are document-global. */
  id: string;
  /** Display size. Height-only — width follows the mark's aspect ratio. */
  className?: string;
  /** Pass "" when an ancestor link already labels this for screen readers. */
  alt?: string;
  /** Set on the header mark, which sits above the fold. */
  priority?: boolean;
};

/**
 * The brand mark. Renders an uploaded logo file when one is configured in
 * data/brand.ts, and the drawn gel wordmark otherwise — so dropping a raster
 * export into public/ is an override, not a prerequisite.
 */
export default function Wordmark({ id, className = "h-8 w-auto", alt = "Hoygi", priority }: Props) {
  if (!logo) return <GelWordmark id={id} className={className} title={alt} />;

  return (
    <Image
      src={logo.src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      priority={priority}
      quality={92}
      className={`${className} drop-shadow-[0_1px_2px_rgba(194,69,107,0.16)] ${
        logo.blend === "multiply" ? "mix-blend-multiply" : ""
      }`}
    />
  );
}
