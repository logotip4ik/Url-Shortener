<template>
  <div
    class="min-h-screen
    bg-grey-light
      font-sans
      flex
      justify-center
      items-center"
  >
    <div class="bg-grey-lightest px-4 py-6 rounded container text-center relative">
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
        <transition @enter="enterAnim" mode="out-in">
          <CreateLink v-if="currTab"></CreateLink>
          <FindLink v-else></FindLink>
        </transition>
      </div>
      <VOverlay :show="loading"></VOverlay>
    </div>
  </div>
</template>

<script>
import VOverlay from '@/components/V-Overlay.vue';
import FindLink from '@/components/FindLink.vue';
import CreateLink from '@/components/CreateLink.vue';

import { openDB } from 'idb';
import { provide, ref } from 'vue';
import gsap from 'gsap';

export default {
  name: 'App',
  components: {
    VOverlay,
    FindLink,
    CreateLink,
  },
  setup() {
    // True = Creating Tab, False for finding
    const db = ref({});
    const currTab = ref(true);
    const loading = ref(false);
    provide('loading', loading);
    const links = ref([]);

    provide('links', links);
    provide('db', db);

    const toggleCurrTab = () => {
      currTab.value = !currTab.value;
    };

    async function createDB() {
      db.value = await openDB('Links', 1, {
        upgrade(database) {
          if (database.objectStoreNames.contains('links')) return;
          console.info('Creating new DB or new version');
          database.createObjectStore('links', { keyPath: '_id' });
        },
      });
    }

    createDB();

    function toggleLoading(to = null) {
      if (to === true) {
        loading.value = to;
      } else if (to === false) {
        loading.value = to;
      } else {
        loading.value = !loading.value;
      }
    }
    provide('toggleLoading', toggleLoading);

    async function addLink(link_) {
      if (!link_) return;
      // eslint-disable-next-line no-underscore-dangle
      const inDB = await db.value.get('links', link_._id);
      if (!inDB) {
        await db.value.put('links', link_);
      }
      // eslint-disable-next-line no-underscore-dangle
      if (links.value.filter((link) => link._id === link_._id).length < 1) links.value.push(link_);
    }
    provide('addLink', addLink);

    function enterAnim(el) {
      gsap.from(el, {
        opacity: 0,
        scale: 0.5,
        duration: 0.2,
      });
    }

    return {
      // Data
      currTab,
      loading,
      // Functions
      enterAnim,
      toggleCurrTab,
    };
  },
};
</script>
