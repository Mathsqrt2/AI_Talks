<script setup lang="ts">
import MenuComponent from './Menu.vue';
</script>

<template>
  <div class="content-wrapper flex w-full ">
    <h1>Content</h1>
    <MenuComponent />
    <div class="content-area">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  min-height: calc(100vh - 96px);
}
</style>