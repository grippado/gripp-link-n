<template>
  <NuxtPage />
</template>

<script setup lang="ts">
  const route = useRoute()
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap');
  *
    padding 0
    margin 0
    border 0
    outline none
    box-sizing border-box
    font-size 16px
    font-family: 'Open Sans', sans-serif;
  html,
  body,
  #__nuxt,
  article
    height 100%
    background-color #282a36
    color #FFF
</style>