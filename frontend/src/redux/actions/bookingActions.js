import axios from "axios";
import { message } from "antd";


export const bookBike = (reqObj) => async (dispatch) => {


  dispatch({ type: "LOADING", payload: true });
    
  try {
    console.log(reqObj)
     await axios.post("/api/bookings/bookBike" , reqObj);

    dispatch({ type: "LOADING", payload: false });
    message.success("Your bike booked successfully");

    
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
    message.error("Something went wrong , please try later");
  }
};

