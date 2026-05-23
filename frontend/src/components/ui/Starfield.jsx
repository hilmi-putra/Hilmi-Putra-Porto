import { useMemo } from 'react';
import AnimatedStarburst from './AnimatedStarburst';

const defaultPalette = ['#D95649', '#F4C848', '#1A4A38', '#842434', '#60A5FA', '#A78BFA'];

const seededRandom = (seed) => {
  let value = seed;

  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
};

const pickBucket = (random, sizeBuckets) => {
  const total = sizeBuckets.reduce((sum, bucket) => sum + (bucket.weight || 0), 0);
  let pointer = random() * total;

  for (const bucket of sizeBuckets) {
    pointer -= bucket.weight || 0;
    if (pointer <= 0) return bucket;
  }

  return sizeBuckets[sizeBuckets.length - 1];
};

export const Starfield = ({
  count = 8,
  palette = defaultPalette,
  sizeRange = [20, 84],
  className = '',
  seed = 42,
  glyph = '*',
  sizeBuckets,
  safeAreaTopPercent = 6,
}) => {
  const stars = useMemo(() => {
    const random = seededRandom(seed);
    const buckets = sizeBuckets || [
      { min: sizeRange[0], max: Math.min(36, sizeRange[1]), weight: 0.4 },
      { min: Math.min(36, sizeRange[1]), max: Math.min(64, sizeRange[1]), weight: 0.4 },
      { min: Math.min(64, sizeRange[1]), max: sizeRange[1], weight: 0.2 },
    ];

    return Array.from({ length: count }).map((_, index) => {
      const bucket = pickBucket(random, buckets);
      const size = Math.round(bucket.min + random() * (bucket.max - bucket.min));
      const alpha = random() > 0.6 ? 'CC' : '7A';

      return {
        id: `${seed}-${index}`,
        size,
        left: `${Math.round(random() * 100)}%`,
        top: `${Math.round(safeAreaTopPercent + random() * (100 - safeAreaTopPercent))}%`,
        delay: random() * 3,
        duration: 5 + random() * 4,
        reverse: random() > 0.5,
        color: `${palette[Math.floor(random() * palette.length)]}${alpha}`,
      };
    });
  }, [count, palette, safeAreaTopPercent, seed, sizeBuckets, sizeRange]);

  return (
    <div className={className} aria-hidden="true">
      {stars.map((star) => (
        <AnimatedStarburst
          key={star.id}
          size={star.size}
          color={star.color}
          left={star.left}
          top={star.top}
          delay={star.delay}
          duration={star.duration}
          reverse={star.reverse}
          glyph={glyph}
        />
      ))}
    </div>
  );
};

export default Starfield;
