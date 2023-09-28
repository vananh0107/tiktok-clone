import axios from "axios"

export default defineNuxtPlugin((NuxtApp) => {

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'https://tiktok-clone-api-701l.onrender.com/api'
    return {
        provide: { 
            axios: axios
        },
    }
})