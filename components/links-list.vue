<template lang="pug">
section
  figure
    img(src="https://gripp.run/static/profile13.jpg")
  ul
    li(v-for="link in links")
      a(:href='link.url') {{ link.label }}
</template>

<script lang="ts">

export default {
  data () {
    return {
      links: [
        {
          url: 'https://twitter.com/grippado',
          label: 'twitter'
        },
        {
          url: 'https://instagram.com/grippado',
          label: 'instagram'
        },
        {
          url: 'https://facebook.com/grippado',
          label: 'facebook'
        },
        {
          url: 'https://linkedin.com/in/grippado',
          label: 'linkedin'
        },
        {
          url: 'https://github.com/grippado',
          label: 'github'
        },
      ]
    }
  },
  computed: {},
  methods: {},
  mounted () {
    console.log(this.links)
  }
}

</script>

<style lang="stylus" scoped>
  section
    display flex
    align-items center
    justify-content center
    flex-direction column
    height 100%
    figure
      img
        width 100%
        max-width 199px
        border-radius 50%
    ul
      width 100%
      max-width 444px
      li
        margin 1.3rem 0
        a
          background-color lightness(#282a36, 33%)
          border-radius 1rem
          padding 13px
          color #FFF
          display block
          text-align center
          font-size 1.4rem
          &:hover
            background-color lightness(#282a36, 44%)
</style>