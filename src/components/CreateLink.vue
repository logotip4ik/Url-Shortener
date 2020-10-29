<template>
  <div class="flex flex-col justify-center mb-4">
    <div class="w-full flex flex-col">
      <input
        v-model="slug"
        placeholder="Slug..."
        maxlength="32"
        class="px-3 py-2 w-full mb-1
            border rounded hover:border-grey
            focus:border-grey focus:shadow"
      />
      <small class="text-right mb-2">{{ lenSlug }}/32</small>
    </div>
    <div class="w-full flex border rounded">
      <button
        @click="toggleDangling"
        class="rounded-l px-3
          border-r bg-grey-lighter focus:outline-none
          hover:bg-grey-light"
      >
        {{ dungle ? 'https://' : 'http://' }}
      </button>
      <input
        v-model="url"
        placeholder="example.com"
        class="px-3 py-2 w-full
            rounded-r hover:border-grey
            focus:border-grey focus:shadow"
      />
    </div>
    <small class="text-red-dark text-left mt-1" v-if="error">You must fill in this field</small>
  </div>
  <button
    @click="createLink"
    class="rounded px-5 py-3 border bg-grey-lighter focus:outline-none hover:bg-grey-light"
  >
    Create
  </button>
</template>

<script>
import { kebabCase } from 'lodash';
import { ref, computed, watch } from 'vue';

export default {
  name: 'CreateLink',
  setup() {
    const loading = ref(false);
    const error = ref(false);
    // True for https://, False http://
    const dungle = ref(true);
    const rawSlug = ref('');
    const url = ref('');

    const slug = computed({
      get: () => rawSlug.value,
      set: (val) => {
        rawSlug.value = kebabCase(val);
      },
    });
    const lenSlug = computed(() => rawSlug.value.length);

    watch(rawSlug, (val) => console.log(val));

    const toggleDangling = () => {
      dungle.value = !dungle.value;
    };

    async function createLink() {
      if (!url.value) {
        error.value = true;
        return;
      }
      error.value = false;
      const res = await (
        await fetch('/api/createLink', {
          method: 'POST',
          body: JSON.stringify({
            name: slug.value.trim(),
            url: dungle.value ? `https://${url.value}` : `http://${url.value}`,
          }),
        })
      ).json();
      console.log(res);
    }

    return {
      // Data
      url,
      error,
      dungle,
      loading,
      // Computed
      slug,
      lenSlug,
      // Functions
      createLink,
      toggleDangling,
    };
  },
};
</script>
