<template lang="pug">
section
  //- | {{ data }}
  p.name gabriel gripp
  p.title engineering manager @ 
    em pagar.me
  figure
    img(:src="imageUrl")
  ul
    li(v-for="link in links")
      a(:href='link.url', :style="{'background': link.colorFg}") {{ link.label }}
    li(@click="testeTokenize")
      a teste tokenize {{ pkTeste }}
</template>

<script setup lang="ts">
  // const { data } = await useFetch('/api/links')
  // const links = ref(data?.value?.staticLinks)
  // const imageUrl = ref(data?.value?.staticImageUrl)

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
      "label": "twitter",
      "colorFg": "#1DA1F2"
    },
    {
      "id": 5,
      "url": "https://facebook.com/grippado",
      "label": "facebook",
      "colorFg": "#4267B2"
    }
  ]
  const imageUrl = "https://gripp.run/img?img=https://gripp.run/static/profile13.jpg&quality=13&grey=true"
  
  // const pkTeste = 'pk_E0BgbJzHOJSogo7R' //Prod Gabriel
  // const pkTeste = 'pk_9lM8qv1iJQsa3OZe' //Prod Luidgi
  const pkTeste = 'pk_test_lMjNYjiQRSgmxrPO'  //Sandbox Luidgi
  // const pkTeste = 'pk_test_67AJG6DFQf1VdXYO'  //Sandbox Irroba
  // const pkTeste = 'ppk_5qdEnO9iWHdZ3v6V'  //Prod Irroba

  const testeTokenize = () => {
    // console.log('teste')
    {
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json', 'content-type': 'application/json'
        },
        body: JSON.stringify({
          card: {
            number: '4000000000000010',
            holder_name: 'Fulano de Tal',
            holder_document: '24920347634',
            exp_month: '11',
            exp_year: '30',
            cvv: '699',
            brand: 'visa',
            label: 'visa'
          },
          type: 'card'
        })
      };

      fetch(`https://api.pagar.me/core/v5/tokens?appId=${pkTeste}`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
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
        font-weight 400
        background linear-gradient(135deg, rgba(64,93,230,1) 0%, rgba(91,81,216,1) 10%, rgba(131,58,180,1) 20%, rgba(193,53,132,1) 30%, rgba(225,48,108,1) 40%, rgba(253,29,29,1) 50%, rgba(245,96,64,1) 60%, rgba(247,119,55,1) 70%, rgba(252,175,69,1) 80%, rgba(255,220,128,1) 90%, rgba(255,220,128,1) 100%)
        -webkit-background-clip text
        -webkit-text-fill-color transparent
      &.title
        font-size 1.2rem
        font-weight 700
        em
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
          &:hover,
          &focus
            font-size 1.77rem
            font-weight 700
            transform scale(1.07)
</style>