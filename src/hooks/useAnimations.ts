
import { useEffect, useRef } from 'react';
import * as anime from 'animejs';

export const useAnimations = () => {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const animateIn = (selector: string, options?: object) => {
    anime({
      targets: selector,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutExpo',
      delay: anime.stagger(100),
      ...options,
    });
  };

  const animateCounter = (element: HTMLElement, endValue: number, duration = 2000) => {
    anime({
      targets: { value: 0 },
      value: endValue,
      duration,
      easing: 'easeOutExpo',
      update: function(anim) {
        element.innerHTML = Math.round(anim.animatables[0].target.value).toLocaleString();
      }
    });
  };

  const animateFloat = (selector: string) => {
    anime({
      targets: selector,
      translateY: [-10, 10],
      duration: 2000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });
  };

  const animateGlow = (selector: string) => {
    anime({
      targets: selector,
      boxShadow: [
        '0 0 10px rgba(34, 197, 94, 0.3)',
        '0 0 30px rgba(34, 197, 94, 0.8)',
        '0 0 10px rgba(34, 197, 94, 0.3)'
      ],
      duration: 2000,
      easing: 'easeInOutSine',
      loop: true,
    });
  };

  const animateSlideUp = (selector: string, delay = 0) => {
    anime({
      targets: selector,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 1000,
      easing: 'easeOutCubic',
      delay,
    });
  };

  return {
    animateIn,
    animateCounter,
    animateFloat,
    animateGlow,
    animateSlideUp,
    elementsRef,
  };
};
