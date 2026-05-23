import { useRef } from 'react';
import { usePortfolioAnimations } from '../animations/usePortfolioAnimations';
import { Future } from '../components/sections/Future';
import { Gallery } from '../components/sections/Gallery';
import { Growth } from '../components/sections/Growth';
import { Hero } from '../components/sections/Hero';
import { Journey } from '../components/sections/Journey';
import { Memories } from '../components/sections/Memories';

export const Home = () => {
  const pageRef = useRef(null);

  usePortfolioAnimations(pageRef);

  return (
    <div ref={pageRef} className="min-h-screen bg-blue-500 px-3 py-3 text-slate-950 sm:px-5 sm:py-5">
      <div className="mx-auto flex w-full max-w-[1460px] flex-col gap-5">
        <Hero />
        <Memories />
        <Journey />
        <Gallery />
        <Growth />
        <Future />
      </div>
    </div>
  );
};

export default Home;
