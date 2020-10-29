<template>
  <div class="flex flex-col justify-center mb-4">
    <input
      placeholder="Slug..."
      class="px-3 py-2 mb-4
            border rounded hover:border-grey
            focus:border-grey focus:shadow"
    />
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
        placeholder="example.com"
        class="px-3 py-2 w-full
            rounded-r hover:border-grey
            focus:border-grey focus:shadow"
      />
    </div>
  </div>
  <button>Create</button>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'CreateLink',
  setup() {
    const dungle = ref(true);

    const toggleDangling = () => {
      dungle.value = !dungle.value;
    };

    return {
      // Data
      dungle,
      // Functions
      toggleDangling,
    };
  },
};
</script>
