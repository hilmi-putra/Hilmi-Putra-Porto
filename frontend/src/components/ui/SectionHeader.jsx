export const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}) => {
  const centered = align === 'center';

  return (
    <div
      className={`reveal-up flex flex-col gap-4 ${centered ? 'mx-auto items-center text-center' : 'items-start text-left'} ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-flex rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] ${
            light ? 'bg-white/14 text-white' : 'bg-blue-50 text-blue-600'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`max-w-3xl font-display text-4xl font-black leading-[0.95] tracking-normal sm:text-5xl lg:text-6xl ${
          light ? 'text-white' : 'text-slate-950'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-base leading-8 ${
            light ? 'text-white/76' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
