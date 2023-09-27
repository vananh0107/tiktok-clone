import { defineStore } from 'pinia';
import { useUserStore } from './user';
import axios from '../plugins/axios';

const $axios = axios().provide.axios;

export const useGeneralStore = defineStore('general', {
  state: () => ({
    isLoginOpen: false,
    isEditProfileOpen: false,
    selectedPost: null,
    ids: null,
    isBackUrl: '/',
    posts: null,
    suggested: null,
    following: null,
    search: null,
  }),
  actions: {
    bodySwitch(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
        return;
      }
      document.body.style.overflow = 'visible';
    },
    resetGeneralStore() {
      this.following = null;
    },
    allLowerCaseNoCaps(str) {
      return str.split(' ').join('').toLowerCase();
    },

    setBackUrl(url) {
      this.isBackUrl = url;
    },

    async hasSessionExpired() {
      await $axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          switch (error.response.status) {
            case 401:
            case 419:
            case 503:
              useUserStore().resetUser();
              window.location.href = '/';
              break;
            case 500:
              alert('Oops, something went wrong!  The team has been notified.');
              break;
            default:
              return Promise.reject(error);
          }
        }
      );
    },

    async getPostById(id) {
      let res = await $axios.get(`/post/${id}`);
      this.$state.selectedPost = res.data.postData;
      this.$state.ids = res.data.ids;
    },
    async getSuggestUsers() {
      let res = await $axios.get(`/user/get-suggest-users`);
      this.suggested = res.data.userList.slice(0, 3);
    },
    async getFollowingUsers(token) {
      let res = await $axios.get(`/user/get-follow-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.following = res.data.follows.slice(0, 3);
    },

    updateSideMenuImage(array, user) {
      for (let i = 0; i < array.length; i++) {
        const res = array[i];
        if (res.id == user.id) {
          res.image = user.image;
        }
      }
    },

    async getAllUsersAndPosts() {
      const res = await $axios.get('/post/allPost');
      this.posts = res.data;
    },
    async handleSearch(query) {
      console.log(query);
      const res = await $axios.put('/user/search', {
        query:query,
      });
      this.search = res.data;
    },
  },
  persist: true,
});
