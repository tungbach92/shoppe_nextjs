import axios from "axios";

const BASE_URL = "https://us-central1-shopee-demo-c6d2b.cloudfunctions.net/api";
//http://localhost:5001/shopee-demo-c6d2b/us-central1/api
//https://us-central1-shopee-demo-c6d2b.cloudfunctions.net/api

const instance = axios.create({
  baseURL: BASE_URL, // api url(our cloud func)
  cancelToken: axios.CancelToken.source().token,
});

export default instance;
