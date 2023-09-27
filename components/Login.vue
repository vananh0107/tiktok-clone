<template>
  <div class="text-center text-[28px] mb-4 font-bold">Log in</div>

  <div class="px-6 pb-1.5 text-[15px]">Username</div>

  <div class="px-6 pb-2">
    <TextInput
      placeholder="Username"
      v-model:input="username"
      inputType="username"
      :autoFocus="true"
      :error="handleError('user')"
    />
  </div>

  <div class="px-6 pb-2">
    <TextInput
      placeholder="Password"
      v-model:input="password"
      inputType="password"
      :error="handleError('password')"
    />
  </div>
  <div class="px-6 text-[12px] text-gray-600">Forgot password?</div>

  <div class="px-6 pb-2 mt-6">
    <button
      :disabled="!username || !password"
      :class="!username || !password ? 'bg-gray-200' : 'bg-[#F02C56]'"
      @click="login()"
      class="w-full text-[17px] font-semibold text-white py-3 rounded-sm"
    >
      Log in
    </button>
  </div>
</template>

<script setup>
const { $userStore, $generalStore } = useNuxtApp();

let username = ref(null);
let password = ref(null);
let errors = ref(null);
const handleError = (type) => {
  let result;
  if(typeof errors.value=='string'){
    if(errors.value.toLowerCase().includes(type))
        result=errors.value
  }
  else{
    errors.value?.forEach((element) => {
    if (element.path == type) {
      console.log(element.msg);
      result = element.msg;
    }
  });
  }
  if (errors.value && result) return result;
  return '';
};
const login = async () => {
  errors.value = null;
  try {
    await $userStore.login(username.value, password.value);
    await $generalStore.getFollowingUsers($userStore.token);
    $generalStore.isLoginOpen = false;
  } catch (error) {
    console.log(error.response.data.errors
      ? error.response.data.errors
      : error.response.data.message)
    errors.value = error.response.data.errors
      ? error.response.data.errors
      : error.response.data.message;
  }
};
</script>
