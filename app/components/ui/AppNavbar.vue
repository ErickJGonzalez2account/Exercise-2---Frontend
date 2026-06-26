<template>
  <nav class="navbar">
    <div class="navbar__inner">
      <div class="navbar__brand">
        <span class="navbar__logo">
          <svg viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="2" fill="#6366F1"/>
            <rect x="11" y="2" width="7" height="7" rx="2" fill="#818CF8" opacity="0.6"/>
            <rect x="2" y="11" width="7" height="7" rx="2" fill="#818CF8" opacity="0.6"/>
            <rect x="11" y="11" width="7" height="7" rx="2" fill="#6366F1" opacity="0.4"/>
          </svg>
        </span>
        <span class="navbar__name">Tareas</span>
      </div>
      <span class="navbar__badge">Erick J.</span>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: #0F1117;
  border-bottom: 1px solid #1E2130;
  position: sticky;
  top: 0;
  z-index: 50;
}
.navbar__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.navbar__logo svg {
  width: 22px;
  height: 22px;
}
.navbar__name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #F1F5F9;
  letter-spacing: -0.01em;
}
.navbar__badge {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #4B5563;
  text-transform: uppercase;
}
@media (max-width: 768px) {
  .navbar__inner {
    padding: 0 12px;
  }
}
</style>