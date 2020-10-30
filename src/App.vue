<template>
  <div
    class="min-h-screen
    bg-grey-light
      font-sans
      flex
      justify-center
      items-center"
  >
    <div class="bg-grey-lightest px-4 py-6 rounded container text-center">
      <h1 class="mb-4">URL Shortener</h1>
      <div>
        <button
          @click="toggleCurrTab"
          :class="[
            'focus:outline-none',
            'px-5',
            'py-2',
            'mr-4',
            'rounded',
            'rounded-b-none',
            'border-t',
            'border-r',
            'border-l',
            currTab ? 'bg-grey-light' : 'bg-grey-lighter',
          ]"
        >
          Creating
        </button>
        <button
          @click="toggleCurrTab"
          :class="[
            'focus:outline-none',
            'px-5',
            'py-2',
            'rounded',
            'rounded-b-none',
            'border-t',
            'border-r',
            'border-l',
            currTab ? 'bg-grey-lighter' : 'bg-grey-light',
          ]"
        >
          Finding
        </button>
      </div>
      <hr class="border mb-4 mt-0" />
      <div class="w-full">
        <CreateLink v-if="currTab"></CreateLink>
        <FindLink v-else></FindLink>
      </div>
    </div>
  </div>
</template>

<script>
import { openDB } from 'idb';
import CreateLink from '@/components/CreateLink.vue';
import FindLink from '@/components/FindLink.vue';

import { provide, ref } from 'vue';

export default {
  name: 'App',
  components: {
    FindLink,
    CreateLink,
  },
  setup() {
    // True = Creating, False for finding
    const currTab = ref(true);
    const db = ref({});

    provide('db', db);

    const toggleCurrTab = () => {
      currTab.value = !currTab.value;
    };

    async function createDB() {
      db.value = await openDB('Links', 1, {
        upgrade(database) {
          if (database.objectStoreNames.contains('links')) return;
          console.info('I am creating new DB or new version');
          database.createObjectStore('links', { keyPath: 'name' });
        },
      });
    }

    createDB();

    return {
      // Data
      currTab,
      // Functions
      toggleCurrTab,
    };
  },
};
</script>
