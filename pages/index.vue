<template lang="pug">
article
  LinksList
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  head () {
    return {
      title: 'gripp.link',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Home page description'
        }
      ],
    };
  }
});
</script>