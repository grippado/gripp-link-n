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
import { Axios } from '../../utils/axios';
import { debounce } from '../../utils/debounce'

const JWT_FAKEIT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJncmlwcC1hcGkiLCJuYW1lIjoiR2FicmllbCBHcmlwcCIsImlhdCI6MjM5ODU3NjkyNDg3NTMyNH0.vPsDvk5C8kuoENJVVXgdIDWOsavZp7ErCoKh7eU5I5c'

export default {
  data () {
    return {
      noteValue: '...loading...',
      debouncingCount: 0
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
      const setNoteDebounced: any = debounce((e: any) => {
        this.setNote()
      }, 1000)

      if (this.debouncingCount == 0) {
        setNoteDebounced(e)
        this.debouncingCount = 0
      }

      this.debouncingCount = 1
      
    },
    async getNote() {
      return await Axios.Get(`https://gripp.run/notes/${this.$route.params.id}`, {
        headers: {
          Authorization: `Bearer ${JWT_FAKEIT}`
        }
      })
    },
    async setNote () {
      const postData = { value: localStorage.getItem(`${this.$route.params.id}`) }
      await Axios.Post(`https://gripp.run/notes/${this.$route.params.id}`, postData, {
        headers: {
          Authorization: `Bearer ${JWT_FAKEIT}`
        }
      })
      this.debouncingCount = 0
    }
  },
  async mounted () {

    window.addEventListener('beforeunload', () => {
      this.setNote()
    })

    if (localStorage.getItem(`${this.$route.params.id}`)) {
      this.noteValue = `${localStorage.getItem(`${this.$route.params.id}`)}`
      return false
    }

    const tempGetNote = await this.getNote().then(((response) => {
      return response.data
    }))

    this.noteValue = tempGetNote[0]?.value ? `${tempGetNote[0]?.value}` : ''

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