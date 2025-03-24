import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, deleteTask, fetchWeather } from "../redux/action/taskActions";

const Todo = () => {
  const [task, setTask] = useState("");
  const [priority, setTaskPriority] = useState({
    value: 1,
    text: "High",
    checked: false,
  });
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();

  const tasks = useSelector((state) => state.tasks.tasks);
  const weather = useSelector((state) => state.tasks.weather);

  console.log(
    "tasks: ",
    tasks.map((task) => console.log(task)) 
  );

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach((task) =>
      dispatch(addTask(task.text, task.priority, task.id))
    );
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (task.trim()) {
      dispatch(addTask(task, { ...priority, checked: isChecked }, Date.now()));
      resetForm();
    }
  };
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          getCityName(position.coords.latitude, position.coords.longitude),
        () => dispatch(fetchWeather("amroha")) // Fallback to default city
      );
    } else {
      dispatch(fetchWeather("amroha"));
    }
  }, [dispatch]);

  const getCityName = (lat, lon) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    )
      .then((res) => res.json())
      .then((data) => {
        const city = data.address.city || data.address.town || "Unknown";
        dispatch(fetchWeather(city));
      })
      .catch(() => dispatch(fetchWeather("amroha")));
  };

  const suggestions = {
    Rain: "Carry an umbrella ☔",
    Clear: "You can go out 🌞",
    Clouds: "Read a book 📚",
    Snow: "Shovel the snow ❄️",
    Thunderstorm: "Stay indoors ⚡",
    Drizzle: "Drive carefully 🚗",
    Mist: "Wear a mask 😷",
  };

  const resetForm = () => {
    setTask("");
    setTaskPriority({ value: 1, text: "High", checked: false });
    setIsChecked(false);
  };

  const handleOutDoor = (e) => {
    setIsChecked(e.target.checked);
    setTaskPriority((prev) => ({ ...prev, checked: e.target.checked }));
  };

  // Handle priority change
  const handlePriorityChange = (e) => {
    const { value, selectedIndex, options } = e.target;
    setTaskPriority({
      ...priority,
      value: Number(value),
      text: options[selectedIndex].text,
    });
  };

  // Sort tasks by priority
  const sortedTasks = tasks
    .slice()
    .sort((a, b) => Number(a.priority.value) - Number(b.priority.value));

  return (
    <div className="todo_container">
      <h2>To-Do List</h2>
      <div className="todo_input_and_btn_box">
        <input
          className="task_input"
          type="text"
          placeholder="Add a new task..."
          value={task}
          onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
          onChange={(e) => setTask(e.target.value)}
        />
        <div className="lable_checkbox_selec">
          <div className="label_checkbox">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleOutDoor}
            />
            <label>outdoor ?</label>{" "}
          </div>

          <select
            value={priority.value}
            className="select_options"
            onChange={handlePriorityChange}
          >
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>
        </div>

        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <div className="task_list">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((item) => (
            <div key={item.id} className="each_task">
              <div>
                {item.text}

                <span className="weather_text">
                  {item.priority.checked &&
                    weather?.weather[0]?.main &&
                    ` - ${suggestions[weather.weather[0].main]}`}
                </span>
              </div>
              <div className="priority_delete">
                {item.priority.text}
                <button onClick={() => dispatch(deleteTask(item.id))}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No tasks found</div>
        )}
      </div>
      {/* Weather Info */}
      <div>
        <h3>Weather Info:</h3>
        {weather ? (
          <p>
            {weather.name}: {Math.round(weather.main.temp)}°C,{" "}
            {weather.weather[0].description}
          </p>
        ) : (
          <div className="loader"></div>
        )}
      </div>
    </div>
  );
};

export default Todo;
