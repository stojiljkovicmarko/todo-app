import React, { ChangeEvent, DragEvent, useRef } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { ProjectStatus, Todo } from "../model/todo.model";
import { filterTodos } from "../util/util-functions";
import NewTodo from "./NewTodo";

import "./TodoList.css";

interface TodoListProps {
  list: string;
  items: Todo[];
  onToggleTodoStatus: (
    id: string,
    newStatus: ProjectStatus,
    event: ChangeEvent
  ) => void;
  onDeleteTodo: (id: string) => void;
  onEditableTodo: (id: string) => void;
  onUpdateTodo: (
    text: string,
    date: Date,
    priority: string,
    id?: string
  ) => void;
  onClickOutside: (event: MouseEvent) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  list,
  items,
  onToggleTodoStatus,
  onDeleteTodo,
  onEditableTodo,
  onUpdateTodo,
  onClickOutside,
}) => {
  const dragStartHandler = (
    event: DragEvent<HTMLLIElement>,
    todoId: string
  ) => {
    event.dataTransfer.setData("todo_id", todoId);
    event.dataTransfer.effectAllowed = "move";
  };

  let filteredTodos: Todo[] = [];
  let noTodos = <li></li>;

  if (list === "active") {
    filteredTodos = filterTodos(items, ProjectStatus.Active);
    noTodos = (
      <li>
        Start being productive today.
        <br /> Add some tasks to your list.
      </li>
    );
  } else {
    filteredTodos = filterTodos(items, ProjectStatus.Finished);
    noTodos = <li>All finished. Well done!</li>;
  }

  const ulRef = useRef<HTMLUListElement>(null);

  useClickOutside(ulRef, onClickOutside);

  return (
    <ul ref={list === "active" ? ulRef : null}>
      {filteredTodos.length !== 0
        ? filteredTodos.map((todo) => {
            return !todo.isEditable ? (
              <li
                draggable="true"
                key={todo.id}
                className={`todo ${
                  todo.status === 0 ? "active-todo" : "finished-todo"
                }`}
                onDragStart={(event) => dragStartHandler(event, todo.id)}
              >
                <div className="todo-primary-info">
                  <div>
                    <input
                      checked={todo.status === 0 ? false : true}
                      type="checkbox"
                      className={todo.priority}
                      onChange={(event) => {
                        onToggleTodoStatus(todo.id, todo.status, event);
                      }}
                    />
                    <span className="draggable">&#8285;&#8285;</span>
                    <div>{todo.text}</div>
                  </div>
                  <div className="actions">
                    <button
                      data-tooltip="Edit"
                      className="edit__btn"
                      onClick={onEditableTodo.bind(null, todo.id)}
                    >
                      &#9998;
                    </button>
                    <button
                      data-tooltip="Delete"
                      className="delete__btn"
                      onClick={onDeleteTodo.bind(null, todo.id)}
                    >
                      &#10006;
                    </button>
                  </div>
                </div>
                <div className="todo-secondary-info">
                  <span>{todo.date}</span>
                </div>
              </li>
            ) : (
              <li key={todo.id}>
                <NewTodo
                  type="edit"
                  submitTodo={onUpdateTodo}
                  todo={todo}
                  onEditableTodo={() => onEditableTodo(todo.id)}
                />
              </li>
            );
          })
        : noTodos}
    </ul>
  );
};

export default TodoList;
