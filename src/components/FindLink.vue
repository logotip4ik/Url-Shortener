<template>
  <div class="flex flex-wrap w-full items-center justify-around">
    <div class="flex flex-col">
      <h2 class="mb-2 text-left">Name to found:</h2>
      <input
        v-model="name"
        placeholder="example..."
        class="border rounded px-3 py-2 w-full"
        @keypress.enter="findLink"
      />
      <button
        class="rounded border w-16 px-4 py-2 mt-2
      bg-grey-lighter focus:outline-none
      hover:bg-grey-light"
        @click="findLink"
      >
        Find
      </button>
    </div>
    <div class="flex flex-col md:mt-2 sm:mt-2" v-if="link.name">
      <h3>Link founded:</h3>
      <div class="mt-2 mx-6 rounded border px-2 py-3">
        <h4>
          Name:
          <code class="rounded bg-pink-lighter text-red-darker px-2">{{ link.name }}</code>
        </h4>
        <h4>
          Url:
          <code class="rounded bg-pink-lighter text-red-darker px-2">{{ link.url }}</code>
        </h4>
      </div>
    </div>
  </div>
  <VOverlay show="loading"></VOverlay>
  <!-- <div v-if="links.length > 0">
    <h2 class="mb-4">Your Links:</h2>
    <div v-for="link in links" :key="link._id">
      <pre>{{ link }}</pre>
    </div>
  </div> -->
</template>

<script>
import VOverlay from '@/components/V-Overlay.vue';

import { inject, ref, computed } from 'vue';
import { camelCase } from 'lodash';

export default {
  name: 'FindLink',
  setup() {
    const db = inject('db');
    const error = ref(false);
    const loading = ref(false);
    const links = ref([]);
    const link = ref({});
    const rawName = ref('');

    const name = computed({
      get: () => rawName.value,
      set: (val) => {
        rawName.value = camelCase(val);
      },
    });

    async function findLink() {
      if (!name.value) {
        error.value = true;
        return;
      }
      error.value = false;
      loading.value = true;
      const res = await fetch('/api/findLinkByName', {
        method: 'POST',
        body: JSON.stringify({
          name: name.value.trim(),
        }),
      });
      const foundedLink = await res.json();
      link.value = foundedLink.link;
      loading.value = false;
    }

    async function getAllLinks() {
      links.value = await db.value.getAll('links');
    }
    getAllLinks();

    return {
      // Data
      link,
      links,
      error,
      loading,
      // Computed
      name,
      // Functions
      findLink,
    };
  },
  components: {
    VOverlay,
  },
};
</script>
