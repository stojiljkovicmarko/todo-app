import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./TodosContainer.css";

const TodosContainer: React.FC<{}> = ({ children }) => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname.split("/")[2]);

  console.log("render...");

  return (
    <div className="todos-container">
      <nav>
        <ul>
          <li
            onClick={() => setActiveLink("overdue")}
            className={activeLink === "overdue" ? "active-link-overdue" : ""}
          >
            <Link to="todo-app/overdue">OVERDUE</Link>
          </li>
          <li
            onClick={() => setActiveLink("active")}
            className={activeLink === "active" ? "active-link-active" : ""}
          >
            <Link to="todo-app/active">ACTIVE</Link>
          </li>
          <li
            onClick={() => setActiveLink("finished")}
            className={activeLink === "finished" ? "active-link-finished" : ""}
          >
            <Link to="todo-app/finished">FINISHED</Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
};

export default TodosContainer;
