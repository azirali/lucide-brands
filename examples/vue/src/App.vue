<script setup>
import { ref } from 'vue';
import { Mail, Send } from '@lucide/vue';
import * as brands from 'lucide-brands/vue';

// One entry per icon (skip the GithubIcon / LucideGithub / Chrome aliases).
const icons = Object.entries(brands).filter(
  ([name]) => !name.endsWith('Icon') && !name.startsWith('Lucide') && name !== 'Chrome',
);
const size = ref(32);
const strokeWidth = ref(2);
</script>

<template>
  <main>
    <h1>lucide-brands/vue</h1>
    <p>
      Brand icons from <code>lucide-brands/vue</code> next to regular icons from <code>@lucide/vue</code>
      (<Mail :size="16" /> <Send :size="16" />).
    </p>
    <label>Size {{ size }}px <input v-model.number="size" type="range" min="16" max="64" /></label>
    <label>Stroke {{ strokeWidth }} <input v-model.number="strokeWidth" type="range" min="0.5" max="3" step="0.25" /></label>
    <ul>
      <li v-for="[name, icon] in icons" :key="name">
        <component :is="icon" :size="size" :stroke-width="strokeWidth" />
        <code>{{ name }}</code>
      </li>
    </ul>
  </main>
</template>

<style>
main { font-family: system-ui, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 16px; }
label { margin-right: 16px; }
ul { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; padding: 0; list-style: none; }
li { display: grid; justify-items: center; gap: 8px; padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
</style>
