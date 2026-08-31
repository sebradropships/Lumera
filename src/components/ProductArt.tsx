/**
 * Built-in Lumera art panels — used until real product photography is added to
 * `src/data/media.ts`. Deliberately illustrative (soft babypink light, glass,
 * gel) rather than a fake photograph of a product that hasn't been shot yet.
 */

type Variant = "jar" | "mask" | "texture" | "ritual";

const gradients = (id: string) => (
  <defs>
    <linearGradient id={`${id}-field`} x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stopColor="#FFFAFC" />
      <stop offset="52%" stopColor="#FBDCE7" />
      <stop offset="100%" stopColor="#EDA8C0" />
    </linearGradient>
    <radialGradient id={`${id}-bloom`} cx="0.36" cy="0.26" r="0.62">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
    </radialGradient>
    <linearGradient id={`${id}-glass`} x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.94" />
      <stop offset="46%" stopColor="#FDF0F4" stopOpacity="0.86" />
      <stop offset="100%" stopColor="#F0BFCF" stopOpacity="0.92" />
    </linearGradient>
    <linearGradient id={`${id}-gel`} x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#FADCE6" stopOpacity="0.7" />
    </linearGradient>
    <linearGradient id={`${id}-pink`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#D9628A" />
      <stop offset="45%" stopColor="#F5AFC4" />
      <stop offset="100%" stopColor="#C2456B" />
    </linearGradient>
    <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>
);

function Jar({ id }: { id: string }) {
  return (
    <g>
      {/* cast shadow */}
      <ellipse cx="200" cy="392" rx="104" ry="20" fill="#C98BA4" opacity="0.5" filter={`url(#${id}-blur)`} />
      {/* body */}
      <path
        d="M116 214h168v128c0 24-19 42-43 42H159c-24 0-43-18-43-42V214Z"
        fill={`url(#${id}-glass)`}
      />
      <path
        d="M116 214h168v128c0 24-19 42-43 42H159c-24 0-43-18-43-42V214Z"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.95"
        strokeWidth="1.5"
      />
      {/* gel level inside */}
      <path
        d="M132 268h136v72c0 16-13 28-30 28H162c-17 0-30-12-30-28v-72Z"
        fill={`url(#${id}-gel)`}
        opacity="0.75"
      />
      {/* lid */}
      <rect x="104" y="160" width="192" height="56" rx="20" fill={`url(#${id}-glass)`} />
      <rect
        x="104"
        y="160"
        width="192"
        height="56"
        rx="20"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      {/* pink band */}
      <rect x="104" y="205" width="192" height="4" rx="2" fill={`url(#${id}-pink)`} opacity="0.85" />
      {/* highlight */}
      <rect x="132" y="176" width="26" height="188" rx="13" fill="#FFFFFF" opacity="0.42" filter={`url(#${id}-soft)`} />
      <text
        x="200"
        y="316"
        textAnchor="middle"
        fontFamily="Gilroy, Outfit, system-ui, sans-serif"
        fontSize="15"
        letterSpacing="7"
        fill="#B0587A"
        opacity="0.72"
      >
        LUMERA
      </text>
    </g>
  );
}

function Mask({ id }: { id: string }) {
  return (
    <g>
      <ellipse cx="200" cy="404" rx="96" ry="16" fill="#C98BA4" opacity="0.4" filter={`url(#${id}-blur)`} />
      {/* collagen sheet */}
      <path
        d="M200 108c56 0 92 40 92 104 0 78-46 152-92 172-46-20-92-94-92-172 0-64 36-104 92-104Z"
        fill={`url(#${id}-gel)`}
        stroke="#FFFFFF"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      {/* gel sheen — a soft translucent wash, no blurred strokes */}
      <path
        d="M200 108c-40 0-68 20-82 52 0 74 20 148 56 196-30-38-46-98-46-166 0-48 24-76 72-82Z"
        fill="#FFFFFF"
        opacity="0.42"
      />
      {/* eye openings */}
      <ellipse cx="164" cy="212" rx="21" ry="11" fill="#F3D3DF" opacity="0.9" />
      <ellipse cx="236" cy="212" rx="21" ry="11" fill="#F3D3DF" opacity="0.9" />
      {/* mouth opening */}
      <path d="M176 298c14-9 34-9 48 0-14 12-34 12-48 0Z" fill="#F3D3DF" opacity="0.9" />
      {/* pink accent droplet */}
      <circle cx="262" cy="150" r="7" fill={`url(#${id}-pink)`} opacity="0.5" />
    </g>
  );
}

function Texture({ id }: { id: string }) {
  const drops = [
    [128, 168, 54],
    [252, 142, 38],
    [196, 244, 72],
    [104, 292, 40],
    [284, 268, 48],
    [176, 116, 26],
    [268, 360, 30],
    [124, 372, 22],
  ] as const;
  return (
    <g>
      {drops.map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={`url(#${id}-gel)`} opacity="0.8" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.2" />
          <circle cx={cx - r * 0.32} cy={cy - r * 0.36} r={r * 0.24} fill="#FFFFFF" opacity="0.65" />
        </g>
      ))}
    </g>
  );
}

function Ritual({ id }: { id: string }) {
  return (
    <g>
      {/* soft face, three-quarter — the mask resting on clean skin */}
      <ellipse cx="200" cy="418" rx="120" ry="22" fill="#C98BA4" opacity="0.32" filter={`url(#${id}-blur)`} />
      <path
        d="M200 96c62 0 100 44 100 116 0 92-46 168-100 188-54-20-100-96-100-188 0-72 38-116 100-116Z"
        fill="#FBE2EA"
      />
      {/* the gel sheet laid over the face */}
      <path
        d="M200 118c52 0 84 38 84 100 0 80-40 146-84 164-44-18-84-84-84-164 0-62 32-100 84-100Z"
        fill={`url(#${id}-gel)`}
        stroke="#FFFFFF"
        strokeOpacity="0.9"
        strokeWidth="1.5"
      />
      <path
        d="M200 118c-34 0-58 16-70 44 2 74 22 140 56 184-26-40-40-98-40-160 0-40 18-64 54-68Z"
        fill="#FFFFFF"
        opacity="0.4"
      />
      <ellipse cx="170" cy="216" rx="19" ry="10" fill="#F2CEDC" opacity="0.9" />
      <ellipse cx="230" cy="216" rx="19" ry="10" fill="#F2CEDC" opacity="0.9" />
      <path d="M180 300c12-8 28-8 40 0-12 10-28 10-40 0Z" fill="#F2CEDC" opacity="0.9" />
      {/* 20-minute ritual marker */}
      <circle cx="288" cy="150" r="26" fill="#FFFFFF" opacity="0.7" />
      <circle cx="288" cy="150" r="26" fill="none" stroke={`url(#${id}-pink)`} strokeWidth="1.4" />
      <path
        d="M288 134v16l11 7"
        stroke="#C2456B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

export default function ProductArt({
  variant = "jar",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const id = `art-${variant}`;
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label="Lumera Bio-Collagen Gel Face Mask illustration"
      preserveAspectRatio="xMidYMid slice"
    >
      {gradients(id)}
      <rect width="400" height="500" fill={`url(#${id}-field)`} />
      <rect width="400" height="500" fill={`url(#${id}-bloom)`} />
      {variant === "jar" && <Jar id={id} />}
      {variant === "mask" && <Mask id={id} />}
      {variant === "texture" && <Texture id={id} />}
      {variant === "ritual" && <Ritual id={id} />}
    </svg>
  );
}
