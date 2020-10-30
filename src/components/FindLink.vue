<template>
  <h1>Find Link By Its Slug</h1>
  <div v-if="links.length > 0">
    <h2 class="mb-4">Your Links:</h2>
    <div v-for="link in links" :key="link.name">
      <pre>{{ link }}</pre>
    </div>
  </div>
</template>

<script>
import { inject, ref } from 'vue';

export default {
  name: 'FindLink',
  setup() {
    const db = inject('db');
    const links = ref([]);

    async function getAllLinks() {
      links.value = await db.value.getAll('links');
    }
    getAllLinks();

    return {
      links,
    };
  },
};
</script>
