import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Todo from "../components/Todo";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Todo />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
