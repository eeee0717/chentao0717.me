<template>
  <Box class="col-span-4 row-span-2">
    <div class="location-card w-full h-full rounded-2xl">
      <div flex flex-row items-center text-white>
        <div m-2 i-carbon-location />
        <span>现居</span>
      </div>
      <div id="address" m-2 class="absolute hover:display:block hidden">
        <h3 class="text-white">
          北京市<br>朝阳区
        </h3>
      </div>
      <div class="icon-wrapper">
        <div i-carbon-circle-filled class="centered-icon color-blue" />
      </div>
    </div>
  </Box>
</template>

<style scoped>
.location-card {
  @apply transition-all bg-center bg-cover bg-no-repeat bg-blend-overlay bg-transparent;
  background-image: url('/images/2024final/2024-location.png');
  & {
    grid-area: var(--sm);
  }
  @screen lg {
    grid-area: var(--lg);
  }
  @media (prefers-color-scheme: dark) {
    background-color: rgba(0, 0, 0, 0.7);
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
    @apply text-white;
    #address {
      display: block;
    }
  }
}

.icon-wrapper {
  @apply relative w-full h-full flex items-center justify-center;
}

.centered-icon {
  @apply absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
