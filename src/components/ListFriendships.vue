<script setup lang="ts">
import friendshipsData from '~/data/friendships.yaml'

interface Friendship {
  username: string
  avatar: string
  website: string
  description: string
  date: string
}

const friendships = friendshipsData as Friendship[]

const sortedFriendships = computed(() => {
  return [...friendships].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

function handleMouseMove(event: MouseEvent) {
  const card = event.currentTarget as HTMLElement
  const bounds = card.getBoundingClientRect()
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top
  card.style.setProperty('--cursor-x', `${x}px`)
  card.style.setProperty('--cursor-y', `${y}px`)
}
</script>

<template>
  <div class="max-w-200 mx-auto">
    <p text-center mt--6 mb8 op50 text-lg italic>
      Friends I've met on the internet.
    </p>
    <div
      class="friendship-grid py-2 mx-auto"
      grid="~ cols-1 sm:cols-2 md:cols-3 gap-4"
    >
      <a
        v-for="friend, idx in sortedFriendships"
        :key="idx"
        :href="friend.website"
        target="_blank"
        rel="noopener noreferrer"
        class="glow-card rounded-lg no-underline!"
        slide-enter
        :style="{ '--enter-stage': idx + 1 }"
        @mousemove="handleMouseMove"
      >
        <div class="glow-shadow" aria-hidden="true" />
        <div class="card-content flex items-center gap-4 p-4">
          <img
            :src="friend.avatar"
            :alt="friend.username"
            class="w-16 h-16 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          >
          <div class="flex-1 min-w-0">
            <div class="font-medium text-base truncate">
              {{ friend.username }}
            </div>
            <div class="text-sm op50 mt-1 line-clamp-2">
              {{ friend.description }}
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.glow-card {
  --cursor-x: 50%;
  --cursor-y: 50%;
  --glow-opacity: 0;
  --shadow-opacity: 0;
  --glow-color: rgba(34, 197, 94, var(--glow-opacity));
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-image: radial-gradient(
    400px circle at var(--cursor-x) var(--cursor-y),
    var(--glow-color),
    transparent 70%
  );
  background-repeat: no-repeat;
  border: 1px solid rgba(125, 125, 125, 0.2);
  transition: transform 0.2s ease;
}

.glow-card::after {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  background: var(--c-bg);
  z-index: 0;
}

.glow-card > * {
  position: relative;
  z-index: 1;
}

.glow-card:hover {
  --glow-opacity: 0.6;
  --shadow-opacity: 0.8;
  transform: translateY(-2px);
}

.glow-shadow {
  pointer-events: none;
  position: absolute;
  width: 80%;
  height: 80%;
  top: var(--cursor-y);
  left: var(--cursor-x);
  transform: translate(-50%, -50%);
  filter: blur(60px);
  opacity: var(--shadow-opacity);
  transition: opacity 150ms ease;
  background: linear-gradient(
    180deg,
    #22c55e 0%,
    rgba(34, 197, 94, 0) 140%
  );
  z-index: 0;
}

.card-content {
  position: relative;
  z-index: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
