<template lang="pug">
section.ctdn-bg.sec-wh
  countdown-clock(
    :title="'gripp.link | Next Trip Date'"
    :date="'August 24, 2024 13:00:00'"
    :wrapperClass="'countdown1'"
  )
</template>

<style lang="stylus" scoped>
.ctdn-bg
  background-image url('/morar-em-Belo-Horizonte.jpg')
  background-repeat no-repeat
  background-position center center
  background-size cover
  height 100%
  display flex
  justify-content center
  align-items center
  &:before
    content ''
    position absolute
    top 0
    left 0
    width calc(100% - (250px + 30px))
    height 100%
    background rgba(0, 0, 0, 0.67)
    z-index 333

// MEDIA QUERIES
@media (max-width: 820px)
  .ctdn-bg
    height 100vh
    &:before
      width 100%
      height 100%
      background rgba(0, 0, 0, 0.67)
      z-index 333
</style>
