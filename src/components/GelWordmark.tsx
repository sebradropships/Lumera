/**
 * The Hoygi wordmark, drawn as translucent pink gel.
 *
 * This is vector rather than a raster export, which matters for a mark this
 * detailed: it stays crisp at every size, costs about 2kB instead of a few
 * hundred, and needs no separate 1x/2x/3x variants. The gloss is genuine SVG
 * lighting — feSpecularLighting over a blurred alpha — so the highlights track
 * the letterforms instead of being painted on.
 *
 * `id` must be unique per instance: SVG filter and gradient references are
 * document-global, so two marks sharing an id would collide.
 */
type Props = {
  id: string;
  className?: string;
  /** Pass "" when an ancestor link already labels this for screen readers. */
  title?: string;
};

export default function GelWordmark({ id, className = "h-8 w-auto", title = "Hoygi" }: Props) {
  const f = `${id}-gel`;
  const g = `${id}-fill`;
  const s = `${id}-sheen`;

  return (
    <svg
      viewBox="0 0 440 150"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#F5BFD2" />
          <stop offset="45%" stopColor="#E89DBB" />
          <stop offset="100%" stopColor="#D2789C" />
        </linearGradient>

        <linearGradient id={s} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="38%" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <filter id={f} x="-25%" y="-35%" width="150%" height="180%">
          {/* Inflate and round the letterforms the way set gel would sit. */}
          <feGaussianBlur in="SourceAlpha" stdDeviation="7" result="soft" />
          <feColorMatrix
            in="soft"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -12"
            result="body"
          />
          {/* Specular pass: the wet, domed highlight. */}
          <feGaussianBlur in="body" stdDeviation="6" result="bump" />
          <feSpecularLighting
            in="bump"
            surfaceScale="9"
            specularConstant="1.5"
            specularExponent="22"
            lightingColor="#FFFFFF"
            result="spec"
          >
            <fePointLight x="120" y="-60" z="190" />
          </feSpecularLighting>
          <feComposite in="spec" in2="body" operator="in" result="specClipped" />
          {/* Soft interior shading so the gel reads as translucent, not flat. */}
          <feComposite in="SourceGraphic" in2="body" operator="in" result="tinted" />
          <feComposite
            in="tinted"
            in2="specClipped"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1.15"
            k4="0"
          />
        </filter>
      </defs>

      <g filter={`url(#${f})`}>
        <text
          x="220"
          y="104"
          textAnchor="middle"
          fontFamily="Gilroy, var(--font-sans), system-ui, sans-serif"
          fontSize="116"
          fontWeight="700"
          style={{ textTransform: "none", letterSpacing: "-2px", fontKerning: "none" }}
          fill={`url(#${g})`}
          stroke={`url(#${g})`}
          strokeWidth="4"
          strokeLinejoin="round"
        >
          Hoygi
        </text>
      </g>
    </svg>
  );
}
