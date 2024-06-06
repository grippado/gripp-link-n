<template lang="pug">
section.ctdn-bg.sec-wh
  countdown-clock(
    :title="'gripp.link | Next Trip Date'"
    :date="'July 3, 2024 22:45:00'"
    :wrapperClass="'countdown1'"
  )
</template>

<style lang="stylus" scoped>
.ctdn-bg
  background-image url('/praca-da-liberdade2.jpeg')
  background-repeat no-repeat
  background-position center center
  background-size cover
  height 100vh
  display flex
  justify-content center
  align-items center
  &:before
    content ''
    position fixed
    top 40px
    left 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.67)
    z-index 333

// LIGHT MODE
body.light
  .ctdn-bg
    &:before
      background rgba(211, 211, 211, 0.66)
</style>
