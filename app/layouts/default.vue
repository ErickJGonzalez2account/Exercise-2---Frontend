<template>
  <div class="app">
    <AppNavbar />
    <main class="app__main">
      <slot />
    </main>
  </div>
</template>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #0F1117;
  color: #F1F5F9;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* SweetAlert2 dark override */
.swal2-container { z-index: 9999 !important; }
</style>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }
.app__main {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px;
}

@media (max-width: 768px) {
  .app__main {
    padding: 16px 12px;
  }
}
</style>