<template lang="pug">
section
  p.name gabriel gripp
  p.title engineering manager @ pagar.me
  figure
    img(src="profile13.jpg")
  ul
    li(v-for="link in links")
      a(:href='link.url', :style="{'background': link.colorFg}") {{ link.label }}
</template>

<script lang="ts">

export default {
  data () {
    return {
      links: [
        {
          url: 'https://linkedin.com/in/grippado',
          label: 'linkedin',
          colorFg: '#0e76a8'
        },
        {
          url: 'https://instagram.com/grippado',
          label: 'instagram',
          colorFg: 'linear-gradient(135deg, rgba(64,93,230,1) 0%, rgba(91,81,216,1) 10%, rgba(131,58,180,1) 20%, rgba(193,53,132,1) 30%, rgba(225,48,108,1) 40%, rgba(253,29,29,1) 50%, rgba(245,96,64,1) 60%, rgba(247,119,55,1) 70%, rgba(252,175,69,1) 80%, rgba(255,220,128,1) 90%, rgba(255,220,128,1) 100%)'
        },
        {
          url: 'https://github.com/grippado',
          label: 'github',
          colorFg: '#333333'
        },
        {
          url: 'https://twitter.com/grippado',
          label: 'twitter',
          colorFg: '#1DA1F2'
        },
        {
          url: 'https://facebook.com/grippado',
          label: 'facebook',
          colorFg: '#4267B2'
        },
      ]
    }
  },
  computed: {},
  methods: {},
  mounted () {
    console.log(this)
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
    p
      margin-bottom 1.3rem
      &.name
        font-size 1.8rem
        font-weight 300
      &.title
        font-size 1.2rem
        font-weight 700
    figure
      img
        width 100%
        max-width 199px
        border-radius 50%
    ul
      width 100%
      max-width 333px
      height 460px
      li
        margin 1.3rem 0
        height 45px
        a
          background-color lightness(#282a36, 33%)
          border-radius 1rem
          padding .69rem 1rem
          color #FFF
          display block
          text-align center
          font-size 1.4rem
          font-weight 300
          transform scale(1)
          &:hover
            font-size 1.77rem
            font-weight 700
            transform scale(1.07)
</style>