<template lang="pug">
NuxtLayout
  NuxtPage
</template>

<script setup lang="ts">
const route = useRoute()
const title = ref('gripp.link | gabriel gripp')

useSeoMeta({
  title,
  description: () => `description: ${title.value}`
})
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;600&display=swap');
  *
    padding 0
    margin 0
    border 0
    outline none
    list-style none
    box-sizing border-box
    font-size 16px
    text-decoration none
    font-family: 'Inconsolata', monospace;
    transition all 0.33s ease-in-out
  a
    cursor pointer

  html,
  body,
  #__nuxt
    height 100%

  article
    height 100%
    background-color #282a36
    color #FFF
    header
      background-color #282a36
  // light theme
  body.light
    article
      background-color #D3D3D3
      color #282a36
      header
        background-color #D3D3D3
        border-bottom 1px solid rgba(40 42 54, 0.4)
</style>