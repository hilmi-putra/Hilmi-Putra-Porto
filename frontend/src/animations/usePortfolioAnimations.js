import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const usePortfolioAnimations = (scope) => {
  useGSAP(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      gsap.set('.reveal-up, .stagger-card, .image-scale', {
        opacity: 1,
        y: 0,
        scale: 1,
      });
      return;
    }

    gsap.from('.hero-reveal', {
      y: 44,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power3.out',
    });

    gsap.utils.toArray('.reveal-up').forEach((element) => {
      gsap.from(element, {
        y: 52,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 84%',
        },
      });
    });

    gsap.utils.toArray('.stagger-group').forEach((group) => {
      const cards = gsap.utils.toArray('.stagger-card', group);

      gsap.from(cards, {
        y: 42,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 78%',
        },
      });
    });

    gsap.utils.toArray('.float-item').forEach((element, index) => {
      gsap.to(element, {
        y: index % 2 === 0 ? -12 : 12,
        x: index % 3 === 0 ? 8 : -6,
        rotate: index % 2 === 0 ? 2 : -2,
        duration: 2.8 + index * 0.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    gsap.utils.toArray('.parallax-soft').forEach((element) => {
      gsap.to(element, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    });

    gsap.utils.toArray('.image-scale').forEach((element) => {
      gsap.fromTo(
        element,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
          },
        },
      );
    });

    gsap.utils.toArray('.section-transition').forEach((element) => {
      gsap.fromTo(
        element,
        { clipPath: 'inset(8% 0% 8% 0% round 32px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 32px)',
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            end: 'top 52%',
            scrub: 0.6,
          },
        },
      );
    });
  }, { scope });
};
