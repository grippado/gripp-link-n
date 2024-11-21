<template lang="pug">
.ctdn-wrapper
  div(:class="`${wrapperClass} countdown`")
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  title: string
  date: string,
  wrapperClass?: string
}>()

const title = ref(props.title)

onMounted(() => {
  const countdownElement = document.querySelector(`.${props.wrapperClass}`)
  const _second: number = 1000
  const _minute: number = _second * 60
  const _hour: number = _minute * 60
  const _day: number = _hour * 24
  let timer: any

  function showRemaining () {
    let distance = new Date(props.date).getTime() - new Date().getTime()
    let days = Math.floor(distance / _day)
    let hours = Math.floor((distance % _day) / _hour) < 10 ? '0' + Math.floor((distance % _day) / _hour) : Math.floor((distance % _day) / _hour)
    let minutes = Math.floor((distance % _hour) / _minute) < 10 ? '0' + Math.floor((distance % _hour) / _minute) : Math.floor((distance % _hour) / _minute)
    let seconds = Math.floor((distance % _minute) / _second) < 10 ? '0' + Math.floor((distance % _minute) / _second) : Math.floor((distance % _minute) / _second)

    if (distance < 0) {
      clearInterval(timer)
      if (countdownElement) {
        countdownElement.innerHTML = 'Aguarde a próxima viagem!'
      }
      return false
    }

    if (countdownElement) {
      countdownElement.innerHTML = `<div class="counting-column">
                                      <div class="counting-value">${days}</div>
                                      <div class="counting-size">days</div>
                                    </div>
                                    <div class="counting-column">
                                      <div class="counting-value">${hours}</div>
                                      <div class="counting-size">hours</div>
                                    </div>
                                    <div class="counting-column">
                                      <div class="counting-value">${minutes}</div>
                                      <div class="counting-size">min</div>
                                    </div>
                                    <div class="counting-column">
                                      <div class="counting-value">${seconds}</div>
                                      <div class="counting-size">sec</div>
                                    </div>`
    }
  }
  //showRemaining()
  timer = setInterval(showRemaining, 1000)

  const backgroundImages: Array<string> = [
    // '/vitoria1.jpeg',
    // '/vv1.jpeg',
    '/12a-16-800x533.jpg',
    '/cumuruxatiba-bahia-3.webp'
  ]

  const randomizeBg = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length)
    const randomBg = backgroundImages[randomIndex]
    document.querySelector('.ctdn-bg')?.setAttribute('style', `background-image: url('${randomBg}')`)
  }

  setInterval(randomizeBg, 10000)
})

useSeoMeta({
  title,
  description: () => `description: ${title.value}`
})

</script>

<style lang="stylus" scoped>
.ctdn-bg
  .ctdn-wrapper
    z-index 666
    margin-top -40px
    .countdown
      display flex
      font-size 6rem
      :deep(.counting-column)
        display flex
        flex-direction column
        width 120px
        line-height 50px
      :deep(.counting-size)
        font-size 1.33rem
        letter-spacing -1px
        color rgba(#FFF, 0.6)
        text-align center
      :deep(.counting-value)
        font-size 6rem
        letter-spacing -3px
        color rgba(#FFF, 0.9)
        text-align center

// LIGHT MODE
body.light
  .countdown
    :deep(.counting-size),
    :deep(.counting-value)
      color rgba(#282a36, 0.9)

// MEDIA QUERIES
@media (max-width: 600px)
  .ctdn-bg
    .countdown
      flex-direction column
      align-items center
      :deep(.counting-column)
        margin 10px 0
</style>
