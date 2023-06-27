<template lang="pug">
article
  //- nuxt-gripp
  LinksList
</template>

<script lang="ts">
export default {
  head() {
    return {
      title: 'gripp.link',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Home page description'
        }
      ],
    }
  }
}

</script>