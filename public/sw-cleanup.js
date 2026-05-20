self.addEventListener('activate', (event) => {
  // Clean up old Workbox caches that may have failed or are redundant
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('huggingface-'))
          .map((name) => caches.delete(name))
      );
    })
  );
});
