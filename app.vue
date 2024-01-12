<template>
  <NuxtPage />
</template>

<script setup lang="ts">
const route = useRoute()
const title = ref('My title')

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
  
  html,
  body,
  #__nuxt,
  article
    height 100%
    background-color #282a36
    color #FFF
  a
    transition all 0.33s ease-in-out
  a:focus,
  a:hover
    transition all 0.33s ease-in-out
</style>