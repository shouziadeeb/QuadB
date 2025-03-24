const initialState = {
  tasks: [],
  weather: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload }],
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case "FETCH_WEATHER_SUCCESS":
      return {
        ...state,
        weather: action.payload,
      };
    case "FETCH_WEATHER_ERROR":
      return {
        ...state,
        weather: null,
      };
    default:
      return state;
  }
};

export default taskReducer;
