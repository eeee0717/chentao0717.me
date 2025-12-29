<script setup lang="ts">
function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

const { y: scroll } = useWindowScroll()
</script>

<template>
  <header class="header z-40 relative">
    <button
      title="Scroll to top"
      fixed right-3 bottom-3 w-10 h-10 hover:op100 rounded-full
      hover-bg-hex-8883 transition duration-300 z-100 print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
    <nav class="nav">
      <RouterLink
        class="w-10 h-10 select-none outline-none flex items-center justify-center"
        to="/"
        focusable="false"
      >
        <Logo />
      </RouterLink>
      <div class="right" print:op0>
        <RouterLink to="/posts" title="Blog">
          <span class="lt-md:hidden">Blog</span>
          <div i-ri-article-line md:hidden />
        </RouterLink>
        <RouterLink to="/projects" title="Projects">
          <span class="lt-md:hidden">Projects</span>
          <div i-ri-lightbulb-line class="md:hidden" />
        </RouterLink>
        <RouterLink to="/demos" title="Demos">
          <span class="lt-md:hidden">Demos</span>
          <div i-ri-screenshot-line class="md:hidden" />
        </RouterLink>
        <RouterLink to="/photos" title="Photos">
          <div i-ri-camera-3-line />
        </RouterLink>
        <RouterLink to="/footprints" title="Footprints">
          <div i-ri-map-pin-line />
        </RouterLink>
        <a href="https://x.com/chentao_007" target="_blank" title="Twitter" class="lt-md:hidden">
          <div i-ri-twitter-x-fill />
        </a>
        <a href="https://github.com/eeee0717" target="_blank" title="GitHub" class="lt-md:hidden">
          <div i-uil-github-alt />
        </a>
        <!-- <a href="/feed.xml" target="_blank" title="RSS" class="lt-md:hidden">
          <div i-la-rss-square style="font-size:1.25rem; margin: 0 -0.125rem;" />
        </a> -->
        <ToggleTheme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.nav {
  padding: 1.5rem 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
