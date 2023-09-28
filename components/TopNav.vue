<template>
  <div
    id="TopNav"
    class="fixed bg-white z-30 flex items-center w-full border-b h-[61px]"
  >
    <div
      :class="route.fullPath === '/' ? 'max-w-[1150px]' : ''"
      class="flex items-center justify-between w-full px-6 mx-auto"
    >
      <div :class="route.fullPath === '/' ? 'w-[80%]' : 'lg:w-[20%] w-[70%]'">
        <NuxtLink to="/">
          <img width="115" src="~/assets/images/tiktok-logo.png" />
        </NuxtLink>
      </div>

      <div class="relative max-w-[380px] w-full">
        <div
          class="hidden md:flex items-center bg-[#F1F1F2] p-1 rounded-full max-w-[380px] w-full"
        >
          <input
            type="text"
            class="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            placeholder="Search accounts"
            v-model="searchTerm"
            @input="performSearch"
            @blur="hideSearchResults"
            @click="performSearch"
          />
          <div class="px-3 py-1 flex items-center border-l border-l-gray-300">
            <Icon name="ri:search-line" color="#A1A2A7" size="22" />
          </div>
        </div>

        <div
          v-if="showResults"
          class="mt-2 p-2 bg-white shadow-md rounded-md absolute w-full max-h-[266px] overflow-y-auto"
        >
          <ul>
            <li
              v-for="user in $generalStore.search"
              @click="navigateToProfileUser(user.id)"
            >
              <div
                class="flex items-center hover:bg-gray-100 rounded-md w-full py-1.5 px-2 cursor-pointer"
              >
                <img
                  v-if="user.image"
                  class="rounded-full lg:mx-0 mr-5 w-[35px] h-[32px]"
                  width="35"
                  :src="user.image"
                />
                <div class="lg:pl-2.5 lg:block">
                  <div class="flex items-center">
                    <div class="font-bold text-[14px]">
                      {{ $generalStore.allLowerCaseNoCaps(user.username) }}
                    </div>
                    <div
                      class="ml-1 rounded-full bg-[#58D5EC] h-[14px] relative"
                    >
                      <Icon
                        class="relative -top-[7px]"
                        name="teenyicons:tick-small-solid"
                        color="#FFFFFF"
                        size="15"
                      />
                    </div>
                  </div>

                  <div class="font-light text-[12px] text-gray-600">
                    {{ user.displayName }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="flex items-center justify-end gap-3 min-w-[275px] max-w-[320px] w-full"
      >
        <button
          @click="isLoggedIn()"
          class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
        >
          <Icon name="mdi:plus" color="#000000" size="22" />
          <span class="px-2 font-medium text-[15px]">Upload</span>
        </button>

        <div v-if="!$userStore.id" class="flex items-center">
          <button
            @click="$generalStore.isLoginOpen = true"
            class="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px]"
          >
            <span class="mx-4 font-medium text-[15px]">Log in</span>
          </button>
          <Icon name="mdi:dots-vertical" color="#161724" size="25" />
        </div>
        <div v-else class="flex items-center">
          <Icon
            class="ml-1 mr-4"
            name="carbon:send-alt"
            color="#161724"
            size="30"
          />
          <Icon
            class="mr-5"
            name="bx:message-detail"
            color="#161724"
            size="27"
          />
          <div class="relative">
            <button class="mt-1" @click="showMenu = !showMenu">
              <img
                class="rounded-full w-[36px] h-[34px]"
                width="36"
                :src="$userStore.image"
              />
            </button>

            <div
              v-if="showMenu"
              id="PopupMenu"
              class="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[43px] -right-2"
            >
              <NuxtLink
                :to="`/profile/${$userStore.id}`"
                @click="toggleMenu"
                class="flex items-center justify-start py-3 px-2 hover:bg-gray-100 cursor-pointer"
              >
                <Icon name="ph:user" size="20" />
                <span class="pl-2 font-semibold text-sm">Profile</span>
              </NuxtLink>
              <div
                @click="logout()"
                class="flex items-center justify-start py-3 px-1.5 hover:bg-gray-100 border-t cursor-pointer"
              >
                <Icon name="ic:outline-login" size="20" />
                <span class="pl-2 font-semibold text-sm">Log out</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $userStore, $generalStore, $profileStore } = useNuxtApp();
const route = useRoute();
const router = useRouter();
let searchTerm = ref('');
let showResults = ref(false);
let showMenu = ref(false);
const performSearch = async () => {
  if (searchTerm.value == '') {
    showResults.value = false;
    $generalStore.search = [];
  } else {
    await $generalStore.handleSearch(searchTerm.value);
    showResults.value = $generalStore.search.length > 0;
  }
};
const hideSearchResults = () => {
  // setTimeout(() => {
  //   showResults.value = false;
  // }, 400);
};
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
const isLoggedIn = () => {
  if ($userStore.id) {
    router.push('/upload');
  } else {
    $generalStore.isLoginOpen = true;
  }
};

const logout = () => {
  try {
    $userStore.logout();
    $profileStore.resetUser();
    $generalStore.resetGeneralStore();
    router.push('/');
  } catch (error) {
    console.log(error);
  }
};
const navigateToProfileUser = (id) => {
  setTimeout(() => router.push(`/profile/${id}`), 100);
};
</script>
