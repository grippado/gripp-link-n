<template lang="pug">
header
  .set-theme(@click="applyLightTheme")
    label goto theme
    span.light-text LIGHT
    span.dark-text DARK
</template>

<script lang="ts" setup>
const applyLightTheme = () => {
  document.body.classList.toggle('light')
  document.querySelector('.set-theme')?.classList.toggle('light')
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark')
}
</script>

<style lang="stylus" scoped>
header
  position fixed
  padding 0.5rem
  border-bottom 1px solid rgba(255, 255, 255, 0.3)
  width 100vw
  height 40px
  display flex
  justify-content flex-end
  align-items center
  label
    font-size .5rem
    height 10px
  .set-theme
    cursor pointer
    color #FFF
    background-color transparent
    border-radius 0.9rem
    width 50px
    height 40px
    position relative
    text-align center
    span
      text-align center
      font-size 1rem
      height 14px
      display block
      overflow hidden
      &.light-text
        height 14px
        color yellow
      &.dark-text
        height 0
        color darkblue
    &.light
      label
        color #282a36
      span
        &.light-text
          height 0
        &.dark-text
          height 14px
@media (max-height: 345px)
  header
    display none
</style>
