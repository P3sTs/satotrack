
import { useEffect, useRef } from 'react';

// Simple animation utilities without external dependencies
export const useAnimations = () => {
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const animateIn = (selector: string, options?: { delay?: number; duration?: number }) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`🎬 No elements found for selector: ${selector}`);
        return;
      }
      
      elements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        const delay = options?.delay || 0;
        const duration = options?.duration || 800;
        
        // Set initial state with important to override any conflicting styles
        htmlElement.style.setProperty('opacity', '0', 'important');
        htmlElement.style.setProperty('transform', 'translateY(20px)', 'important');
        htmlElement.style.setProperty('transition', `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`, 'important');
        
        // Animate in with stagger
        setTimeout(() => {
          htmlElement.style.setProperty('opacity', '1', 'important');
          htmlElement.style.setProperty('transform', 'translateY(0px)', 'important');
        }, delay + (index * 100));
      });
    } catch (error) {
      console.error('🎬 Error in animateIn:', error);
    }
  };

  const animateCounter = (element: HTMLElement, endValue: number, duration = 2000) => {
    if (!element) return;
    
    const startValue = 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutExpo)
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
      
      element.innerHTML = currentValue.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  };

  const animateFloat = (selector: string) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`🎈 No elements found for float animation: ${selector}`);
        return;
      }
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.setProperty('animation', 'float 4s ease-in-out infinite', 'important');
      });
    } catch (error) {
      console.error('🎈 Error in animateFloat:', error);
    }
  };

  const animateGlow = (selector: string) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`✨ No elements found for glow animation: ${selector}`);
        return;
      }
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.setProperty('animation', 'glowPulse 2s ease-in-out infinite alternate', 'important');
      });
    } catch (error) {
      console.error('✨ Error in animateGlow:', error);
    }
  };

  const animateSlideUp = (selector: string, delay = 0) => {
    try {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`⬆️ No elements found for slide up animation: ${selector}`);
        return;
      }
      elements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        
        // Set initial state
        htmlElement.style.opacity = '0';
        htmlElement.style.transform = 'translateY(50px)';
        htmlElement.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Animate in
        setTimeout(() => {
          htmlElement.style.opacity = '1';
          htmlElement.style.transform = 'translateY(0px)';
        }, delay + (index * 100));
      });
    } catch (error) {
      console.error('⬆️ Error in animateSlideUp:', error);
    }
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
