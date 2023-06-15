<template>
  <textarea
    @keyup="onPress"
    v-model="noteValue"
    placeholder="insert note here..."
  ></textarea>
  <div class="footing">
    <a href="/">gripp.link</a>
    note/{{ noteId }}
  </div>
</template>

<script lang="ts">
export default {
  data () {
    return {
      noteValue: '...loading...'
    }
  },
  computed: {
    noteId() {
      return this.$route.params.id
    }
  },
  methods: {
    onPress(e: any) {
      localStorage.setItem(`${this.$route.params.id}`, `${e.target.value}`);
    }
    
  },
  mounted () {
    if (localStorage.getItem(`${this.$route.params.id}`)) {
      this.noteValue = `${localStorage.getItem(`${this.$route.params.id}`)}`
      return false
    }
    else if (localStorage.getItem(`${this.$route.params.id}`) === '') {
      localStorage.removeItem(`${this.$route.params.id}`)
    }
    this.noteValue = ''
  }
}
</script>

<style lang="stylus" scoped>
  textarea
    width 100%
    height calc(100% - 1.7rem)
    resize none
    padding 1rem
    background-color #282a36
    color #FFF
  .footing
    height 1.55rem
    text-align center
</style>