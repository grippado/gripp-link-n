<template lang="pug">
  section.about-me
    p About Me
    figure
      img(src="https://gripp.link/profile.jpg")
    p.name gabriel gripp
    p 👨‍💻 Currently working as a Engineering Manager at isaac
    p ♥️  Passionate about solving problems, developing products, and empowering people
    p 🛠️ Over 16 years of experience in software development and management
    p 🐙 Living in Brazil 🇧🇷 with my cats, Sancho 🐈‍⬛ and Panqueca 🐈
</template>

<script lang="ts" setup>

</script>

<style lang="stylus" scoped>
.about-me
  display flex
  align-items center
  justify-content center
  flex-direction column
  figure
    margin 1rem 0
    img
      width 100%
      max-width 150px
      border-radius 25%
  p
    text-align center
    font-size 1.2rem
    font-weight 700
    color #FFF
    em
      display block
      color rgb(113, 162, 0)
      font-style normal
  .name
    font-size 1.5rem
    font-weight bold
    margin-bottom 1.3rem
</style>