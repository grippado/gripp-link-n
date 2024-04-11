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
  position fixed
  padding 0.5rem
  border-bottom 1px solid rgba(255, 255, 255, 0.3)
  width 100vw
  display flex
  justify-content flex-end
  .set-theme
    cursor pointer
    color #FFF
    background-color transparent
    border 1px solid rgba(255, 255, 255, 0.3)
    border-radius 0.9rem
    width 50px
    height 23px
    position relative
    self-align center
    span
      position absolute
      left 5px
      top -1px
      &::before
        content '⋆☀︎'
        color yellow
        font-size 1.3rem
    &.light
      border 1px solid rgba(40 42 54, 0.4)
      span
        left 22px
        &::before
          content '☾⋆'
          color darkblue
</style>
