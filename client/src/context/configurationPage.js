import Axios from "../Axios";

const getConfigurations = async () => {
  try {
    let response = await Axios.get("/configurations");
    return response.data;
  } catch (err) {
    console.log(err.response);
  }
};

export { getConfigurations };
