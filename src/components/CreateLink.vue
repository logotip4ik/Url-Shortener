<template>
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
      <div class="w-full flex px-1">
        <small class="text-red-dark mr-auto" v-if="!success.ok">{{ success.message || ' ' }}</small>
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
  <transition name="fade" mode="in-out">
    <div v-show="loading" class="overlay">
      <div class="overlay__inner">
        <div class="overlay__inner--circle"></div>
        <div class="overlay__inner--circle"></div>
        <div class="overlay__inner--circle"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import { camelCase } from 'lodash';
import gsap from 'gsap';
// eslint-disable-next-line
import { ref, computed, watch, inject, reactive, onMounted } from 'vue';

export default {
  name: 'CreateLink',
  setup() {
    const db = inject('db');

    // True for https://, False http://
    const dungle = ref(true);
    const loading = ref(false);
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

    function loadingAnim() {
      gsap.to('.overlay__inner--circle', {
        stagger: {
          each: 0.2,
          yoyo: true,
          repeat: -1,
        },
        duration: 0.4,
        y: -25,
      });
    }

    onMounted(() => loadingAnim());

    async function createLink() {
      if (!url.value) {
        error.value = true;
        return;
      }
      error.value = false;
      loading.value = true;
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
      loading.value = false;
    }

    return {
      // Data
      url,
      error,
      dungle,
      loading,
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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #eee;
  transition: all 200ms ease-in-out;
}

.overlay__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
  justify-content: space-evenly;
}

.overlay__inner--circle {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: #18181e;
  opacity: 0.9;
  border-radius: 50%;
}
</style>
