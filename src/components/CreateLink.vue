<template>
  <div class="w-full h-full">
    <div class="flex flex-col justify-center mb-4">
      <div class="w-full flex flex-col">
        <input
          v-model="slug"
          placeholder="Slug..."
          maxlength="32"
          ref="inputSLUG"
          @keypress.enter="$refs.inputURL.focus()"
          class="px-3 py-2 w-full
              border rounded hover:border-grey
              focus:border-grey focus:shadow"
        />
        <div class="w-full flex px-1 mt-1">
          <small class="text-red-dark mr-auto" v-if="!success.ok">{{
            success.message || ' '
          }}</small>
          <small class="text-right mb-4 ml-auto">{{ lenSlug }}/32</small>
        </div>
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
          ref="inputURL"
          placeholder="example.com"
          @keypress.enter="createLink"
          @keypress.up="$refs.inputSLUG.focus()"
          class="px-3 py-2 w-full
              rounded-r hover:border-grey
              focus:border-grey focus:shadow"
        />
      </div>
      <small class="text-red-dark text-left mt-1" v-if="error">You must fill in this field</small>
    </div>
    <button
      ref="createButton"
      @click="createLink"
      class="rounded px-5 py-3 border
        bg-grey-lighter focus:outline-none
        hover:bg-grey-light"
    >
      Create
    </button>
  </div>
</template>

<script>
import { camelCase } from 'lodash';
// eslint-disable-next-line
import { ref, computed, watch, inject, reactive } from 'vue';

export default {
  name: 'CreateLink',
  setup() {
    const db = inject('db');
    const toggleLoading = inject('toggleLoading');
    const addLink = inject('addLink');

    // True for https://, False http://
    const dungle = ref(true);
    const error = ref(false);
    const success = reactive({ ok: null, message: null });
    const rawSlug = ref('');
    const url = ref('');

    const slug = computed({
      get: () => rawSlug.value,
      set: (val) => {
        rawSlug.value = camelCase(val);
      },
    });
    const lenSlug = computed(() => rawSlug.value.length);

    const toggleDangling = () => {
      dungle.value = !dungle.value;
    };

    async function createLink() {
      if (!url.value) {
        error.value = true;
        return;
      }
      error.value = false;
      toggleLoading(true);
      try {
        const res = await fetch('/api/createLink', {
          method: 'POST',
          body: JSON.stringify({
            name: slug.value.trim(),
            url: dungle.value ? `https://${url.value.trim()}` : `http://${url.value.trim()}`,
          }),
        });
        const link = await res.json();
        if (!link.error) {
          await db.value.put('links', link.link);
          url.value = '';
          slug.value = '';
          success.ok = true;
          success.message = null;
          addLink(link.link);
          setTimeout(() => {
            success.ok = null;
          }, 2000);
        } else {
          throw new Error(link.error);
        }
      } catch (err) {
        if (err.message.match(/Instance is not unique./)) {
          success.ok = false;
          success.message = 'This name is already in use';
        }
      }
      toggleLoading();
    }

    return {
      // Data
      url,
      error,
      dungle,
      success,
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
