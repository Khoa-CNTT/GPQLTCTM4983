/**
 * Performance optimization utilities for UNIKO frontend
 * 
 * This file contains utilities to improve performance and reduce page load times
 */

// Function to prefetch critical resources
export const prefetchCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  // For UNIKO dashboard routes
  const dashboardRoutes = ['/dashboard', '/dashboard/overview', '/dashboard/transactions', '/dashboard/analytics'];
  
  // Only prefetch if user is likely to navigate to dashboard (e.g., logged in)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    // Prefetch dashboard routes
    dashboardRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }
};

// Function to defer non-critical assets
export const deferNonCriticalAssets = () => {
  if (typeof window === 'undefined') return;
  
  // Observe images and load them when in viewport
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  };
  
  // Execute when DOM is loaded
  if (document.readyState === 'complete') {
    lazyLoadImages();
  } else {
    window.addEventListener('load', lazyLoadImages);
  }
};

// Function to measure and report performance metrics
export const measurePerformance = () => {
  if (typeof window === 'undefined' || !window.performance || !window.performance.timing) return;
  
  // Report performance on window load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = window.performance.timing;
      
      // Calculate key metrics
      const metrics = {
        // Time to first byte
        ttfb: timing.responseStart - timing.navigationStart,
        // DOM Content Loaded
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        // Load complete
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        // First paint (approximation)
        firstPaint: timing.domInteractive - timing.navigationStart,
      };
      
      // Log metrics
      console.log('Performance metrics:', metrics);
      
      // Send to analytics if available
      if (window.gtag) {
        window.gtag('event', 'performance_metrics', metrics);
      }
    }, 0);
  });
};

// Optimize React component rendering
export const optimizeRendering = {
  // Prevent unnecessary re-renders
  shouldComponentUpdate: (prevProps, nextProps) => {
    // Deep comparison helper
    const isEqual = (objA, objB) => {
      if (objA === objB) return true;
      
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      
      if (keysA.length !== keysB.length) return false;
      
      return keysA.every(key => {
        if (typeof objA[key] === 'object' && objA[key] !== null && 
            typeof objB[key] === 'object' && objB[key] !== null) {
          return isEqual(objA[key], objB[key]);
        }
        return objA[key] === objB[key];
      });
    };
    
    return !isEqual(prevProps, nextProps);
  },
  
  // Debounce function for event handlers
  debounce: (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function for scroll events
  throttle: (func, limit = 100) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => {
          inThrottle = false;
        }, limit);
      }
    };
  }
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
  prefetchCriticalResources();
  deferNonCriticalAssets();
  measurePerformance();
};

export default {
  prefetchCriticalResources,
  deferNonCriticalAssets,
  measurePerformance,
  optimizeRendering,
  initPerformanceOptimizations
}; 