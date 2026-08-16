type AppGlyphProps = {
  icon: string;
};

function isImageIcon(icon: string) {
  return /^(?:\/|https?:\/\/|data:image\/)/i.test(icon);
}

/** Renders either an image asset path or a short text glyph as an app icon. */
export default function AppGlyph({ icon }: AppGlyphProps) {
  if (isImageIcon(icon)) {
    return (
      <span
        className="appGlyphImage"
        style={{ backgroundImage: `url("${icon}")` }}
        aria-hidden="true"
      />
    );
  }

  return <span className="appGlyphText" aria-hidden="true">{icon}</span>;
}
