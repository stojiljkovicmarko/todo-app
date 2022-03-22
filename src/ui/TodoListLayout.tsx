import React from "react";

import "./TodoListLayout.css";

interface ListLayoutProps {
  children: {
    props: object;
  };
  type: "active" | "finished" | "overdue";
}

const TodoListLayout: React.FC<ListLayoutProps> = ({ type, children }) => {
  const isActive = type === "active";

  let renderClasses = {
    layout: "",
    heading: "",
  };

  if (type === "overdue") {
    renderClasses.layout = "layout-overdue";
    renderClasses.heading = "overdue-layout-heading";
  }
  if (type === "active") {
    renderClasses.layout = "layout-active";
    renderClasses.heading = "active-layout-heading";
  }
  if (type === "finished") {
    renderClasses.layout = "layout-finished";
    renderClasses.heading = "finished-layout-heading";
  }

  return (
    <div className={`todos-layout ${renderClasses.layout}`}>
      <h2 className={renderClasses.heading}>
        {type === "overdue"
          ? "OVERDUE TASKS"
          : isActive
          ? "ACTIVE TASKS"
          : "FINISHED TASKS"}
      </h2>
      {children}
    </div>
  );
};

export default TodoListLayout;
