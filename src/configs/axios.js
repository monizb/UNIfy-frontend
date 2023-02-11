import axios from "axios"


const instance = axios.create({
    baseURL: "https://unify-backend2.vercel.app/api"
})

export default instance;