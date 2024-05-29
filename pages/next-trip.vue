<template lang="pug">
section.ctdn-bg.sec-wh
  #countdown.countdown
    .counting-value.days
    .counting-size days
    .counting-value.hours
    .counting-size hours
    .counting-value.minutes
    .counting-size min 
    .counting-value.seconds
    .counting-size sec
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
const title = ref('gripp.link | Next Trip Date')

onMounted(() => {
  const countdownElement = document.getElementById('countdown')
  const countElementDays = document.querySelector('.counting-value.days')
  const countElementHours = document.querySelector('.counting-value.hours')
  const countElementMinutes = document.querySelector('.counting-value.minutes')
  const countElementSeconds = document.querySelector('.counting-value.seconds')
  const end = new Date('June 12, 2024 22:45:00')
  const _second: number = 1000
  const _minute: number = _second * 60
  const _hour: number = _minute * 60
  const _day: number = _hour * 24
  let timer: string | number | any | undefined

  function showRemaining () {
    let now = new Date();
    let distance = end.getTime() - now.getTime();
    if (distance < 0) {

      clearInterval(timer);
      if (countdownElement) {
        countdownElement.innerHTML = 'Aguarde a próxima viagem!';
      }

      return;
    }
    let days = Math.floor(distance / _day)
    let hours = Math.floor((distance % _day) / _hour) < 10 ? '0' + Math.floor((distance % _day) / _hour) : Math.floor((distance % _day) / _hour)
    let minutes = Math.floor((distance % _hour) / _minute) < 10 ? '0' + Math.floor((distance % _hour) / _minute) : Math.floor((distance % _hour) / _minute)
    let seconds = Math.floor((distance % _minute) / _second) < 10 ? '0' + Math.floor((distance % _minute) / _second) : Math.floor((distance % _minute) / _second)
    
    if (countdownElement) {
      if (countElementDays) {
        countElementDays.innerHTML = `${days}`
      }
      if (countElementHours) {
        countElementHours.innerHTML = `${hours}`
      }
      if (countElementMinutes) {
        countElementMinutes.innerHTML = `${minutes}`
      }
      if (countElementSeconds) {
        countElementSeconds.innerHTML = `${seconds}`
      }
    }
  }
  // showRemaining()
  timer = setInterval(showRemaining, 1000)

  const backgroundImages: Array<string> = [
    '/praca-da-liberdade.jpeg',
    '/belo-horizonte-conheca-a-rica-cultura-e-gastronomia-da-cidade-mineira-149_widelg.jpg',
    '/morar-em-Belo-Horizonte.jpg.webp',
    '/praca-da-liberdade2.jpeg',
    '/morar-em-Belo-Horizonte2.jpeg'
  ]
  
  const sequencilizeBg = () => {
    let index = 0
    return () => {
      const bg = backgroundImages[index]
      index = index === backgroundImages.length - 1 ? 0 : index + 1
      document.querySelector('.ctdn-bg')?.setAttribute('style', `background-image: url('${bg}')`)
    }
  }
  const randomizeBg = () => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length)
    const randomBg = backgroundImages[randomIndex]
    document.querySelector('.ctdn-bg')?.setAttribute('style', `background-image: url('${randomBg}')`)
  }

  // randomizeBg()
  timer = setInterval(sequencilizeBg, 5000)

})

useSeoMeta({
  title,
  description: () => `description: ${title.value}`
})

</script>

<style lang="stylus" scoped>
.ctdn-bg
  background url('/praca-da-liberdade.jpeg')
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
  .countdown
    display flex
    justify-content center
    align-items baseline
    z-index 666
    font-size 6rem
    margin-top -40px
    .counting-size
      font-size 2rem
      color rgba(#FFF, 0.6)
    .counting-value
      font-size 6rem
      width 100px
      height 85px
      color rgba(#FFF, 0.9)
body.light
  .ctdn-bg
    &:before
      background rgba(211, 211, 211, 0.66)
  .countdown
    .counting-size
      color rgba(#282a36, 0.6)
    .counting-value
      color rgba(#282a36, 0.9)
@media (max-width: 500px)
  .ctdn-bg
    .countdown
      flex-direction column
      align-items center
</style>