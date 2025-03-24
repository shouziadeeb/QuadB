import axios from "axios";
const apikeycode = "9b382d893be25a57125186ae185c474f";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

export const addTask = (task, priority, id) => {
  return {
    type: "ADD_TASK",
    payload: { text: task, priority, id },
  };
};

export const deleteTask = (id) => {
  return {
    type: "DELETE_TASK",
    payload: id,
  };
};

export const fetchWeather = (curCity) => async (dispatch) => {
  try {
    const response = await axios.get(`${apiUrl}${curCity}&appid=${apikeycode}`);
    dispatch({ type: "FETCH_WEATHER_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "FETCH_WEATHER_ERROR", payload: error.message });
  }
};
