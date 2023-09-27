import { defineStore } from 'pinia'
import axios from '../plugins/axios'

const $axios = axios().provide.axios
export const useProfileStore = defineStore('profile', {
  state: () => ({
    id: '',
    name: '',
    bio: '',
    image: '',
    posts: null,
    allLikes: 0,
    followers: null,
    follows:null
  }),
  actions: {
    async getProfile(id) {
      let res = await $axios.get(`/user/profile/${id}`,)
      this.$state.id = res.data.user.id
      this.$state.name = res.data.user.displayName
      this.$state.bio = res.data.user.bio
      this.$state.image = res.data.user.image||'https://i.ibb.co/FbqXpnn/user-placeholder.png'
      this.$state.posts = res.data.posts
      this.$state.followers = res.data.followers
      this.$state.follows = res.data.user.follows
      // this.allLikesCount()
    },

    allLikesCount() {
        this.allLikes = 0
        for (let i = 0; i < this.posts.length; i++) {
            const post = this.posts[i];
             for (let j = 0; j < post.likes.length; j++) {
                this.allLikes++
             }
        }
    },

    resetUser() {      
        this.$state.id = ''
        this.$state.name = ''
        this.$state.bio = ''
        this.$state.image = ''
        this.$state.posts = ''
      }
  },
  persist: true,
})
