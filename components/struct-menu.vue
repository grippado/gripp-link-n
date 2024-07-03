<template lang="pug">
nav
  .breadcrumbs
    a(v-if="route.name !== 'index'" href="/") 🏠
    span(v-if="route.name !== 'index'") &nbsp;|&nbsp;
    a.injected(:href="route.path") {{ route.name === 'index' ? '🏠' : route.name}}
  ul.links-list
    li(v-for="link in links")
      a(:href='link.url', :style="{'color': link.colorBg}")
        span.desk {{ link.label }}
        span.mobi {{ link.acronym }}
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  {
    "id": 1,
    "url": "https://linkedin.com/in/grippado",
    "label": "linkedin",
    "acronym": "in",
    "colorBg": "#0e76a8"
  },
  {
    "id": 2,
    "url": "https://instagram.com/grippado",
    "label": "instagram",
    "acronym": "ig",
    "colorBg": "linear-gradient(135deg, rgba(64,93,230,1) 0%, rgba(91,81,216,1) 10%, rgba(131,58,180,1) 20%, rgba(193,53,132,1) 30%, rgba(225,48,108,1) 40%, rgba(253,29,29,1) 50%, rgba(245,96,64,1) 60%, rgba(247,119,55,1) 70%, rgba(252,175,69,1) 80%, rgba(255,220,128,1) 90%, rgba(255,220,128,1) 100%)"
  },
  {
    "id": 3,
    "url": "https://github.com/grippado",
    "label": "github",
    "acronym": "gh",
    "colorBg": "#444444"
  },
  {
    "id": 4,
    "url": "https://www.last.fm/user/grippado",
    "label": "last.fm",
    "acronym": "lf",
    "colorBg": "#b90000"
  },
  {
    "id": 5,
    "url": "https://twitter.com/grippado",
    "label": "x~twitter",
    "acronym": "x-tw",
    "colorBg": "#1DA1F2"
  },
  {
    "id": 6,
    "url": "https://facebook.com/grippado",
    "label": "facebook",
    "acronym": "fb",
    "colorBg": "#4267B2"
  },
  {
    "id": 7,
    "url": "https://blog.gripp.link",
    "label": "blog",
    "acronym": "bg",
    "colorBg": "#CD8D00"
  }
]
</script>

<style lang="stylus" scoped>
nav
  width 250px
  height calc(100dvh - 90px)
  position fixed
  top 45px
  bottom unset
  right 45px
  border 3px solid rgba(0, 0, 0, 0.6)
  border-radius 15px
  padding 1rem
  background-color #212223
  display flex
  flex-direction column
  .links-list
    width 100%
    max-width 333px
    border-top 1px solid rgba(255, 255, 255, 0.4)
    margin-top 1rem
    li
      margin 1rem 0
      a
        display block
        text-align left
        font-size 1.4rem
        font-weight 300
        &:hover,
        &focus
          font-weight 700
        .mobi
          display none
  .set-theme
    cursor pointer
    color #FFF
    background-color transparent
    border-radius 0.9rem
    height 40px
    position relative
    text-align center
    margin-top auto
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
@media (max-width: 820px)
  nav
    width calc(100% - 90px)
    height 55px
    top unset
    bottom 25px
    z-index 666
    flex-direction row
    justify-content space-between
    .links-list
      border 0 none
      display flex
      flex-direction row
      justify-content flex-end
      margin 0
      li
        margin 0
        a
          margin 0 1rem
          .desk
            display none
          .mobi
            display block
@media (max-width: 500px)
  .breadcrumbs
    display none
  nav
    .links-list
      justify-content space-between
      li
        a
          margin 0
</style>
