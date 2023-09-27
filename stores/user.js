import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { useGeneralStore } from './general';

const $axios = axios().provide.axios;

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: '',
    bio: '',
    image: '',
    token: '',
    follows: [],
  }),
  actions: {
    async login(username, password) {
      let res = await $axios.post(
        '/user/signin',
        {
          username: username,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      this.$state.id = res.data.id;
      this.$state.name = res.data.displayName;
      this.$state.bio = res.data.bio;
      this.$state.image = res.data.image;
      this.$state.token = res.data.token;
      this.$state.follows = res.data.follows;
    },
    updateInfo(data) {
      this.$state.name = data.name;
      this.$state.bio = data.bio;
      this.$state.image =
        data.image || 'https://i.ibb.co/FbqXpnn/user-placeholder.png';
    },
    async register(displayName, username, password, confirmPassword) {
      await $axios.post('/user/signup', {
        displayName: displayName,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      });
    },
    async updateUserImage(data) {
      return await $axios.put('/user/update-image', data, {
        headers: {
          Authorization: `Bearer ${this.$state.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    async updateUser(displayName, bio) {
      const res = await $axios.put(
        '/user/update-profile',
        {
          displayName: displayName,
          bio: bio,
        },
        {
          headers: {
            Authorization: `Bearer ${this.$state.token}`,
          },
        }
      );
      this.$state.name = res.data.displayName;
      this.$state.bio = res.data.bio;
      this.$state.image =
        res.data.image || 'https://i.ibb.co/FbqXpnn/user-placeholder.png';
    },

    async createPost(data) {
      return await $axios.post('/post/create', data, {
        headers: {
          Authorization: `Bearer ${this.$state.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    async createFollow(userFollowId) {
      return await $axios.post(
        '/user/follow',
        {
          userFollowId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.$state.token}`,
          },
        }
      );
    },
    async unFollow(userFollowId) {
      return await $axios.put(
        '/user/unfollow',
        {
          userFollowId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.$state.token}`,
          },
        }
      );
    },
    async deletePost(post) {
      return await $axios.delete(`/post/${post.id}`, {
        headers: {
          Authorization: `Bearer ${this.$state.token}`,
        },
      });
    },

    async addComment(post, comment) {
      let res = await $axios.post(
        '/comment/create',
        {
          post_id: post.id,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${this.$state.token}`,
          },
        }
      );

      if (res.status === 200) {
        await this.updateComments(post);
      }
    },

    async deleteComment(post, commentId) {
      let res = await $axios.delete(`/comment/${commentId}`, {
        post_id: post.id,
      });

      if (res.status === 200) {
        await this.updateComments(post);
      }
    },

    async updateComments(post) {
      let res = await $axios.get(`/comment/all-comments/${post.id}`);
      useGeneralStore().selectedPost.comments = res.data;
    },
    async likePost(post, isPostPage) {
      let res = await $axios.post(
        '/post/favorite',
        {
          postId: isPostPage ? post.post.id : post['_id'],
        },
        {
          headers: {
            Authorization: `Bearer ${this.$state.token}`,
          },
        }
      );
      let singlePost = null;
      if (isPostPage) {
        singlePost = post;
      } else {
        singlePost = useGeneralStore().posts.find(
          (p) => p['_id'] === post['_id']
        );
      }
      singlePost?.favorites?.push(res.data);
    },

    async unlikePost(post, isPostPage) {
      let deleteLike = null;
      let singlePost = null;
      if (isPostPage) {
        singlePost = post;
      } else {
        singlePost = useGeneralStore().posts.find(
          (p) => p['_id'] === post['_id']
        );
      }
      singlePost.favorites.forEach((like) => {
        if (like.user === this.id) {
          deleteLike = like;
        }
      });
      let res = await $axios.put(
        '/post/favorite',
        {
          postId: isPostPage ? post.post.id : post['_id'],
        },
        {
          headers: {
            Authorization: `Bearer ${this.$state.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      for (let i = 0; i < singlePost?.favorites?.length; i++) {
        const like = singlePost.favorites[i];
        console.log(like);
        if (like.id === res.data.id) {
          singlePost.favorites.splice(i, 1);
        }
      }
    },

    async logout() {
      // await $axios.post('/user/logout')
      this.resetUser();
    },

    resetUser() {
      this.$state.id = '';
      this.$state.name = '';
      this.$state.bio = '';
      this.$state.image = '';
      this.$state.token = '';
    },
  },
  persist: true,
});
