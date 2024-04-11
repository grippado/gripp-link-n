<template lang="pug">
header
  .set-theme(@click="applyLightTheme")
    span
</template>

<script lang="ts" setup>
const applyLightTheme = () => {
  document.body.classList.toggle('light')
  document.querySelector('.set-theme')?.classList.toggle('light')
}
</script>

<style lang="stylus" scoped>
header
  transition all 0.33s ease-in-out
  position fixed
  padding 0.5rem
  border-bottom 1px solid rgba(255, 255, 255, 0.3)
  width 100vw
  .set-theme
    cursor pointer
    color #FFF
    background-color #FFF
    border-radius 0.9rem
    transition all 0.33s ease-in-out
    width 50px
    height 23px
    position relative
    span
      transition all 0.33s ease-in-out
      position absolute
      left 2px
      top -2px
      &::before
        content '🌞'
    &.light
      justify-content right
      transition all 0.33s ease-in-out
      span
        transition all 0.33s ease-in-out
        left 27px
        &::before
          transition all 0.33s ease-in-out
          content '🌚'
</style>
