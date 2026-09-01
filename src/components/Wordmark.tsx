import Image from "next/image";
import { logo } from "@/data/brand";

type Props = {
  /** Display size. Height-only — width follows the file's real aspect ratio. */
  className?: string;
  /** Pass "" when an ancestor link already labels this for screen readers. */
  alt?: string;
  /** Set on the header mark, which sits above the fold. */
  priority?: boolean;
};

/**
 * The brand mark. Renders the logo file when one is configured in data/brand.ts,
 * and the letter-spaced type treatment when one is not, so the header and footer
 * are never broken by a missing asset.
 */
export default function Wordmark({ className = "h-8 w-auto", alt = "Hoygi", priority }: Props) {
  if (!logo) return <span className="pl-[0.42em]">HOYGI</span>;

  return (
    <Image
      src={logo.src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      priority={priority}
      quality={92}
      // Pale pink on a pale pink page needs a touch of lift to read as a mark
      // rather than a smudge.
      className={`${className} drop-shadow-[0_1px_2px_rgba(194,69,107,0.16)] ${
        logo.blend === "multiply" ? "mix-blend-multiply" : ""
      }`}
    />
  );
}
