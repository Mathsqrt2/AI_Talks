<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuth } from '../stores/auth';
const auth = useAuth();
</script>

<template>
  <div
    class="flex flex-row justify-between items-center bg-blue-500 text-white-200 w-full h-[96px] p-5"
  >
    <div class="flex flex-row gap-3 items-center">
      <img
        src="/ai_talks_logo.png"
        alt="Logo"
        draggable="false"
        class="w-20 h-20 transition-all brightness-0 invert filter hover:brightness-70"
      />
      <span
        class="text-xl font-bold transition-all text-gray-50 hover:text-gray-200"
      >
        AI Talks v3.0.1
      </span>
    </div>
    <div>
      <ul class="flex flex-row gap-2 items-center">
        <template v-if="auth.user"
          ><li
            class="menu-item bg-blue-400 hover:bg-blue-300"
            @click="auth.logout"
          >
            <RouterLink to="/login">sign out</RouterLink>
          </li>
        </template>
        <template v-else-if="!auth.user && $route.path !== `/login`">
          <li class="menu-item bg-blue-400 hover:bg-blue-300">
            <RouterLink to="/login">sign in</RouterLink>
          </li></template
        >
        <template v-if="!auth.redirectedToStar">
          <li
            class="menu-item bg-blue-400 hover:bg-blue-300"
            @click="auth.markAsRedirected"
          >
            <a href="https://github.com/Mathsqrt2/AI_Talks" target="_blank">
              leave me a star :)
            </a>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<style>
.menu-item {
  transition: all 0.25s ease-in-out;
  padding: 12px 16px;
}

.menu-item:hover {
  cursor: pointer;
}
</style>
