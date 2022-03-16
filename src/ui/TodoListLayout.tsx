import React, { DragEvent } from "react";
import { ProjectStatus } from "../model/todo.model";

import "./TodoListLayout.css";

interface ListLayoutProps {
  children: {
    props: object;
  };
  type: "active" | "finished";
  changeTodoStateDrag: (todoId: string, status: ProjectStatus) => void;
}

const TodoListLayout: React.FC<ListLayoutProps> = ({
  type,
  children,
  changeTodoStateDrag,
}) => {
  const isActive = type === "active";

  const contentToRender =
    children.props.items.length === 0 ? (
      isActive ? (
        <p>Start being productive! Add some todos.</p>
      ) : (
        <p>Well done! You completed all your tasks.</p>
      )
    ) : (
      children
    );

  const dragOverHandler = (event: DragEvent) => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "todo_id") {
      event.preventDefault();
      event.stopPropagation();
      (event.currentTarget as HTMLDivElement).classList.add(
        "drag-target-active"
      );
    }
    return false;
  };

  const dropHandler = (event: DragEvent) => {
    event.preventDefault();
    const todoId = event.dataTransfer.getData("todo_id");
    const layoutClass = (event.currentTarget as HTMLDivElement).classList[1];
    let status = ProjectStatus.Active;
    if (layoutClass === "finished") {
      status = ProjectStatus.Finished;
    }
    changeTodoStateDrag(todoId, status);
    (event.currentTarget as HTMLDivElement).classList.remove(
      "drag-target-active"
    );
  };

  const dragLeaveHandler = (event: DragEvent) => {
    (event.currentTarget as HTMLDivElement).classList.remove(
      "drag-target-active"
    );
  };

  return (
    <div
      className={`todos-layout ${
        isActive ? "layout-active" : "layout-finished"
      }`}
      onDragOver={(event) => dragOverHandler(event)}
      onDrop={(event) => dropHandler(event)}
      onDragLeave={(event) => dragLeaveHandler(event)}
    >
      <h2
        className={
          isActive ? "active-layout-heading" : "finished-layout-heading"
        }
      >
        {isActive ? "ACTIVE TODOS" : "FINISHED TODOS"}
      </h2>
      {contentToRender}
    </div>
  );
};

export default TodoListLayout;
