<template lang="pug">
section.link-list
  .card-info-img
    p.name gabriel gripp
    p.title engineering manager
      em pagar.me [StoneCo]
    figure
      img(:src="imageUrl")
  ul
    li(v-for="link in links")
      a(:href='link.url', :style="{'background': link.colorFg}") {{ link.label }}
</template>

<script setup lang="ts">
  const links = [
    {
      "id": 1,
      "url": "https://linkedin.com/in/grippado",
      "label": "linkedin",
      "colorFg": "#0e76a8"
    },
    {
      "id": 2,
      "url": "https://instagram.com/grippado",
      "label": "instagram",
      "colorFg": "linear-gradient(135deg, rgba(64,93,230,1) 0%, rgba(91,81,216,1) 10%, rgba(131,58,180,1) 20%, rgba(193,53,132,1) 30%, rgba(225,48,108,1) 40%, rgba(253,29,29,1) 50%, rgba(245,96,64,1) 60%, rgba(247,119,55,1) 70%, rgba(252,175,69,1) 80%, rgba(255,220,128,1) 90%, rgba(255,220,128,1) 100%)"
    },
    {
      "id": 3,
      "url": "https://github.com/grippado",
      "label": "github",
      "colorFg": "#333333"
    },
    {
      "id": 4,
      "url": "https://twitter.com/grippado",
      "label": "x~twitter",
      "colorFg": "#1DA1F2"
    },
    {
      "id": 5,
      "url": "https://facebook.com/grippado",
      "label": "facebook",
      "colorFg": "#4267B2"
    }
  ]
  const imageUrl = "https://gripp.run/img?img=https://gripp.link/profile.jpg&quality=17"
</script>

<style lang="stylus">
body
  article
    .link-list
      display flex
      align-items center
      justify-content center
      flex-direction column
      height 100%
      padding-top 40px
      .card-info-img
        display flex
        align-items center
        justify-content center
        flex-direction column
        width 35%
        p
          margin-bottom 1.3rem
          &.name
            font-size 1.8rem
            font-weight 400
            color #FFF
          &.title
            font-size 1.2rem
            font-weight 700
            color #FFF
            text-align center
            em
              display block
              color rgb(113, 162, 0)
              font-style normal
        figure
          img
            width 100%
            max-width 199px
            border-radius 50%
      ul
        width 100%
        max-width 333px
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
            &:hover,
            &focus
              font-size 1.77rem
              font-weight 700
              transform scale(1.07)
  &.light
    article
      .link-list
        p
          &.name,
          &.title
            color #282a36
          a
            background-color lightness(#D3D3D3, 33%)
            color #282a36
@media (max-width: 500px)
  body
    article
      .link-list
        .card-info-img
          width 100%
        ul
          max-width 100%
          li
            width 100%
            height 55px
            margin .25rem 0
            a
              padding 1rem
              border-radius 0

@media (max-height: 650px)
  body
    article
      .link-list
        flex-direction row
@media (max-height: 320px)
  body
    article
      .link-list
        padding 0
        justify-content space-evenly
        .card-info-img
          p
            margin-bottom .5rem
        ul
          li
            margin .5rem 0
</style>