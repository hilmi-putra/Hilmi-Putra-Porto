export const AnimatedStarburst = ({ className = "", size = 48, color = "rgba(255,255,255,0.6)", left, top, right, bottom, delay = 0, duration = 6, style = {}, glyph = "✽", reverse = false }) => {
  const outerStyle = {
    position: "absolute",
    width: size,
    height: size,
    color,
    left,
    top,
    right,
    bottom,
    pointerEvents: "none",
    transformOrigin: "50% 50%",
    animation: `star-spin ${duration}s linear infinite`,
    animationDirection: reverse ? "reverse" : "normal",
    animationDelay: `${delay}s`,
    ...style,
  };

  const innerStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color,
    animation: `star-pulse ${Math.max(2, duration / 2)}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    fontSize: "0.9em",
    lineHeight: 1,
  };

  return (
    <div className={className} style={outerStyle} aria-hidden>
      <div style={innerStyle}>
        <span style={{ fontSize: "calc(0.85 * 1em)", display: "inline-block" }}>{glyph}</span>
      </div>
    </div>
  );
};

export default AnimatedStarburst;
