<template>
  <main class="of-x-hidden px-7 py-10">
    <RouterView />
    <Footer :key="$route.path" />
  </main>
</template>
