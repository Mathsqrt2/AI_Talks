<script setup lang="ts">
import HeaderComponent from './components/Header.vue';
import ContentComponent from './components/Content.vue';
import FooterComponent from './components/Footer.vue';
</script>

<template>
  <div class="flex w-full min-h-screen flex-col">
    <HeaderComponent />
    <ContentComponent>
      <RouterView />
    </ContentComponent>
    <FooterComponent />
  </div>
</template>