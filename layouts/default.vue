<template lang="pug">
article
  .wrapper
    slot
    struct-menu
</template>

<script lang="ts" setup>

</script>

<style lang="stylus" scoped>
.wrapper
  display flex
  flex-direction row
  width 100%
  height calc(100dvh - 60px)
  background-color #282a36
  border 3px solid rgba(0, 0, 0, 0.6)
  border-radius 15px
  padding 1rem
  position relative
  overflow hidden
  :deep(section)
    width calc(100% - (250px + 30px))
    height 100%
@media (max-width: 820px)
  .wrapper
    height calc(100dvh - 20px)
    :deep(section)
      width 100%
</style>