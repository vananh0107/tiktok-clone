<template>
  <div :id="`PostMain-${post['_id']}`" class="flex border-b py-6">
    <div @click="isLoggedIn(post.user)" class="cursor-pointer" >
      <img
        class="rounded-full max-h-[60px] w-[55px] h-[52px]"
        width="60"
        :src="
          post.user.image || 'https://i.ibb.co/FbqXpnn/user-placeholder.png'
        "
      />
    </div>
    <div class="pl-3 w-full px-4">
      <div class="flex items-center justify-between pb-0.5">
        <button @click="isLoggedIn(post.user)">
          <span class="font-bold hover:underline cursor-pointer">
            {{ $generalStore.allLowerCaseNoCaps(post.user.displayName) }}
          </span>
          <span
            class="text-[13px] text-light text-gray-500 pl-1 cursor-pointer"
          >
            {{ post.user.displayName }}
          </span>
        </button>

        <button
          v-if="isFollowed"
          class="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md"
          @click="
            message==='Follow' ? handleFollow(post.author) : handleUnFollow(post.author)
          "
        >
          {{ message }}
        </button>
      </div>
      <div
        class="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]"
      >
        {{ post.caption }}
      </div>
      <div class="text-[14px] text-gray-500 pb-0.5">
        #fun #cool #SuperAwesome
      </div>
      <div class="text-[14px] pb-0.5 flex items-center font-semibold">
        <Icon name="mdi:music" size="17" />
        <div class="px-1">original sound - AWESOME</div>
        <Icon name="mdi:heart" size="20" />
      </div>

      <div class="mt-2.5 flex">
        <div
          @click="displayPost(post)"
          class="relative min-h-[480px] max-h-[580px] max-w-[280px] phone:w-[240px] flex items-center bg-black rounded-xl cursor-pointer"
        >
          <video
            v-if="post.video"
            ref="video"
            loop
            class="rounded-xl object-cover mx-auto h-full"
            :src="post.video"
          />
          <img
            class="absolute right-2 bottom-0"
            width="90"
            src="~/assets/images/tiktok-logo-white.png"
          />
        </div>
        <div class="relative mr-[75px] phone:mr-[0px]">
          <div class="absolute bottom-0 pl-2">
            <div class="pb-4 text-center">
              <button
                @click="isLiked ? unlikePost(post) : likePost(post)"
                class="rounded-full bg-gray-200 p-2 cursor-pointer"
              >
                <Icon
                  name="mdi:heart"
                  size="25"
                  :color="isLiked ? '#F02C56' : ''"
                />
              </button>
              <span class="text-xs text-gray-800 font-semibold">{{
                post?.favorites?.length
              }}</span>
            </div>

            <div class="pb-4 text-center">
              <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
                <Icon name="bx:bxs-message-rounded-dots" size="25" />
              </div>
              <span class="text-xs text-gray-800 font-semibold">{{post.comments.length}}</span>
            </div>

            <div class="text-center">
              <div class="rounded-full bg-gray-200 p-2 cursor-pointer" id="fake-button">
                <Icon name="ri:share-forward-fill" size="25" />
              </div>
              <span class="text-xs text-gray-800 font-semibold">55</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $generalStore, $userStore } = useNuxtApp();
const props = defineProps(['post']);
const { post } = toRefs(props);
const router = useRouter();

let video = ref(null);
let message = ref('');
onMounted(() => {
  let observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting) {
        video.value?.play();
      } else {
        video.value?.pause();
      }
    },
    { threshold: [0.6] }
  );
  observer.observe(document.getElementById(`PostMain-${post.value['_id']}`));
});

onBeforeUnmount(() => {
  //   video.value.pause();
  //   video.value.currentTime = 0;
  //   video.value.src = '';
});
const isFollowed = computed(() => {
  let res = $userStore?.follows?.find((id) => id === post.value.author);
  if(post.value.author===$userStore.id) return false;
  if ($userStore.id) {
    if (res) message = 'Unfollow';
    else message = 'Follow';
    return true;
  }
  return false;
});
const handleFollow = async (userFollowId) => {
  let res = await $userStore.createFollow(userFollowId);
  $userStore.follows = res.data.user.follows;
  $generalStore.getFollowingUsers($userStore.token);
};
const handleUnFollow = async (userFollowId) => {
  let res = await $userStore.unFollow(userFollowId);
  $userStore.follows = res.data.user.follows;
  $generalStore.getFollowingUsers($userStore.token);
};
const isLiked = computed(() => {
  let res = post?.value?.favorites?.find((like) => like.user === $userStore.id);
  if (res) {
    return true;
  }
  return false;
});

const likePost = async (post) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true;
    return;
  }
  try {
    await $userStore.likePost(post);
  } catch (error) {
    console.log(error);
  }
};

const unlikePost = async (post) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true;
    return;
  }
  try {
    const result = await $userStore.unlikePost(post, false);
  } catch (error) {
    console.log(error);
  }
};

const isLoggedIn = (user) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true;
    return;
  }
  setTimeout(() => router.push(`/profile/${user['_id']}`), 200);
};

const displayPost = (post) => {
  if (!$userStore.id) {
    $generalStore.isLoginOpen = true;
    return;
  }
   $generalStore.setBackUrl('/')
  $generalStore.selectedPost = null;
  setTimeout(() => router.push(`/post/${post['_id']}`), 300);
};
</script>
