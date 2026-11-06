<template>
  <div class="home">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="home-portrait slide-enter">
        <AvatarAscii />
      </div>
      <div class="home-copy slide-enter" lang="en">
        <div class="home-bio prose">
          <slot />
        </div>
        <div class="home-social" aria-label="Find me on">
          <a href="https://github.com/eeee0717" target="_blank" rel="noopener noreferrer"><span i-simple-icons-github aria-hidden="true" /> GitHub</a>
          <a href="https://www.twitter.com/chentao_007" target="_blank" rel="noopener noreferrer"><span i-ri-twitter-x-fill aria-hidden="true" /> Twitter</a>
          <a href="https://www.instagram.com/eeee0717_/" target="_blank" rel="noopener noreferrer"><span i-simple-icons-instagram aria-hidden="true" /> Instagram</a>
          <a href="https://space.bilibili.com/52423255" target="_blank" rel="noopener noreferrer"><span i-simple-icons-bilibili aria-hidden="true" /> 哔哩哔哩</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  --home-ink: #262626;
  --home-muted: #737373;
  display: flex;
  flex: 1;
  align-items: center;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  color: var(--home-ink);
}

:global(html.dark .home) {
  --home-ink: #ededeb;
  --home-muted: #a3a3a3;
}

.home-hero {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(40px, 6vw, 88px);
  padding: 16px 0 24px;
}

.home-portrait {
  min-width: 0;
  --enter-stage: 1;
}

.home-copy {
  min-width: 0;
  max-width: 460px;
  --enter-stage: 2;
}

.home-bio :deep(.home-title) {
  margin: 0 0 24px;
  color: var(--home-ink);
  font-size: clamp(32px, 3.3vw, 44px);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.home-bio :deep(.home-title span) {
  display: block;
  margin-top: 4px;
  font-size: 0.88em;
  letter-spacing: 0;
}

.home-social {
  --uno: font-mono;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 24px;
  font-size: 12px;
}

.home-social a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  color: var(--home-muted);
}

.home-social a:hover {
  color: var(--home-ink);
}

.home a:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 4px;
}

@media (min-width: 761px) and (max-height: 800px) {
  .home-hero {
    padding: 8px 0 16px;
  }

  .home-bio :deep(p) {
    margin-block: 12px;
  }

  .home-social {
    margin-top: 16px;
  }
}

@media (max-width: 760px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    min-height: 0;
    padding: 0 0 44px;
  }

  .home-portrait {
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
  }

  .home-copy {
    max-width: 520px;
    margin: 0 auto;
  }
}
</style>
