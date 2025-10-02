import Axios from "axios";

const AxiosInstance = Axios.create({
  baseURL: "https://api.cnhsalumniassociation.ph/api/v1",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default AxiosInstance;
