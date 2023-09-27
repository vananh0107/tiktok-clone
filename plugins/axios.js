import axios from "axios"

export default defineNuxtPlugin((NuxtApp) => {

    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:4000/api'
    return {
        provide: { 
            axios: axios
        },
    }
})