<template>
  <div class="w-full h-full">
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
            <code class="rounded bg-pink-lighter text-red-darker px-2 break-words">{{
              link.url
            }}</code>
          </h4>
        </div>
      </div>
      <div class="flex flex-col md:mt-2 sm:mt-2" v-if="links.length > 0">
        <h3>Your Links</h3>
        <div class="mt-2 rounded border h-24 scroll-snap overflow-auto">
          <div
            v-for="link in links"
            :key="link._id"
            class="snap h-24 mt-1 flex flex-col justify-center items-center"
          >
            <h4>
              Name:
              <code class="rounded bg-pink-lighter text-red-darker px-2">{{ link.name }}</code>
            </h4>
            <h4>
              Url:
              <code class="rounded bg-pink-lighter text-red-darker px-2 break-words">{{
                link.url
              }}</code>
            </h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import { inject, ref, computed, watch } from 'vue';
import { camelCase } from 'lodash';

export default {
  name: 'FindLink',
  setup() {
    const db = inject('db');
    const links = inject('links');
    const toggleLoading = inject('toggleLoading');
    const addLink = inject('addLink');

    const error = ref(false);
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
      toggleLoading(true);
      const res = await fetch('/api/findLinkByName', {
        method: 'POST',
        body: JSON.stringify({
          name: name.value.trim(),
        }),
      });
      const foundedLink = await res.json();
      if (foundedLink.link) {
        addLink(foundedLink.link);
      }
      link.value = foundedLink.link;
      toggleLoading(false);
    }

    async function getAllLinks() {
      links.value = await db.value.getAll('links');
    }
    getAllLinks();

    watch(
      links,
      (val) => {
        console.log(val);
      },
      { deep: true },
    );

    return {
      // Data
      link,
      links,
      error,
      // Computed
      name,
      // Functions
      findLink,
    };
  },
};
</script>

<style scoped>
.scroll-snap {
  scroll-snap-type: y mandatory;
  scrollbar-width: 10px;
}
.snap {
  scroll-snap-align: center;
}
</style>
