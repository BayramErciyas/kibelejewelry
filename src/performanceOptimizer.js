const PRODUCT_CACHE_TTL_MS = 90_000;
const originalFetch = window.fetch.bind(window);
const responseCache = new Map();
const inFlightRequests = new Map();

const isProductsRequest = (input) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  return url.includes('/rest/v1/products');
};

const getRequestMethod = (input, init) =>
  String(init?.method || input?.method || 'GET').toUpperCase();

const buildCacheKey = (input, init) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  const headers = new Headers(init?.headers || input?.headers || {});
  const range = headers.get('range') || '';
  const acceptProfile = headers.get('accept-profile') || '';
  return `${url}|${range}|${acceptProfile}`;
};

window.fetch = async (input, init = {}) => {
  const method = getRequestMethod(input, init);

  if (!isProductsRequest(input)) {
    return originalFetch(input, init);
  }

  if (method !== 'GET') {
    responseCache.clear();
    inFlightRequests.clear();
    return originalFetch(input, init);
  }

  const cacheKey = buildCacheKey(input, init);
  const now = Date.now();
  const cached = responseCache.get(cacheKey);

  if (cached && now - cached.timestamp < PRODUCT_CACHE_TTL_MS) {
    return cached.response.clone();
  }

  if (inFlightRequests.has(cacheKey)) {
    const response = await inFlightRequests.get(cacheKey);
    return response.clone();
  }

  const requestPromise = originalFetch(input, init)
    .then((response) => {
      if (response.ok) {
        responseCache.set(cacheKey, {
          timestamp: Date.now(),
          response: response.clone(),
        });
      }
      return response;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, requestPromise);
  const response = await requestPromise;
  return response.clone();
};

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (!(video instanceof HTMLVideoElement) || !video.autoplay) return;

      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        const playPromise = video.play();
        playPromise?.catch?.(() => {});
      } else {
        video.pause();
      }
    });
  },
  {
    rootMargin: '180px 0px',
    threshold: [0, 0.15, 0.5],
  },
);

const optimizeVideo = (video) => {
  if (!(video instanceof HTMLVideoElement)) return;

  if (video.preload === 'auto') {
    video.preload = 'metadata';
  }

  if (video.autoplay) {
    videoObserver.observe(video);
  }
};

const optimizeImage = (image) => {
  if (!(image instanceof HTMLImageElement)) return;

  image.decoding = 'async';

  if (
    !image.loading &&
    image.closest('.luxury-product-grid, .product-grid, .home-collections-grid')
  ) {
    image.loading = 'lazy';
  }
};

const optimizeNode = (node) => {
  if (!(node instanceof Element)) return;

  if (node.matches('video')) optimizeVideo(node);
  if (node.matches('img')) optimizeImage(node);

  node.querySelectorAll?.('video').forEach(optimizeVideo);
  node.querySelectorAll?.('img').forEach(optimizeImage);
};

const mediaObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach(optimizeNode);
  });
});

const startMediaOptimization = () => {
  document.querySelectorAll('video').forEach(optimizeVideo);
  document.querySelectorAll('img').forEach(optimizeImage);

  mediaObserver.observe(document.documentElement, {
    subtree: true,
    childList: true,
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMediaOptimization, {
    once: true,
  });
} else {
  startMediaOptimization();
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) return;

  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.pause();
  });
});

const performanceStyle = document.createElement('style');
performanceStyle.textContent = `
  .luxury-item-card,
  .product-card,
  .home-collection-card {
    content-visibility: auto;
    contain-intrinsic-size: auto 620px;
  }
`;
document.head.appendChild(performanceStyle);
