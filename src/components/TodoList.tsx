import React, { ChangeEvent, useRef } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useClickOutside } from "../hooks/useClickOutside";
import { ProjectStatus, Todo } from "../model/todo.model";
import NewTodo from "./NewTodo";
import { filterTodos } from "../util/util-functions";

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
  // const dragStartHandler = (
  //   event: DragEvent<HTMLLIElement>,
  //   todoId: string
  // ) => {
  //   event.dataTransfer.setData("todo_id", todoId);
  //   event.dataTransfer.effectAllowed = "move";
  // };

  let todos: { filtered: Todo[]; status: string; noTodos: JSX.Element } = {
    filtered: [],
    status: "",
    noTodos: <li></li>,
  };

  if (list === "overdue") {
    todos = {
      filtered: filterTodos(items, ProjectStatus.Overdue),
      status: "overdue",
      noTodos: <li>No overdue tasks.</li>,
    };
  } else if (list === "active") {
    todos = {
      filtered: filterTodos(items, ProjectStatus.Active),
      status: "active",
      noTodos: (
        <li>
          Start being productive today.
          <br /> Add some tasks to your list.
        </li>
      ),
    };
  } else {
    todos = {
      filtered: filterTodos(items, ProjectStatus.Finished),
      status: "finished",
      noTodos: <li>All finished. Well done!</li>,
    };
  }

  const ulRef = useRef<HTMLUListElement>(null);

  useClickOutside(ulRef, onClickOutside);

  return (
    <ul ref={ulRef}>
      {todos.filtered.length !== 0 ? (
        <TransitionGroup>
          {todos.filtered.map((todo) => {
            return !todo.isEditable ? (
              <CSSTransition key={todo.id} timeout={300} classNames="todo">
                <li
                  draggable="true"
                  className={`todo ${todos.status}`}
                  // onDragStart={(event) => dragStartHandler(event, todo.id)}
                >
                  <div className="todo-primary-info">
                    <div>
                      <input
                        checked={todo.status === 0 || 2 ? false : true}
                        type="checkbox"
                        className={todo.priority}
                        onChange={(event) => {
                          onToggleTodoStatus(todo.id, todo.status, event);
                        }}
                      />
                      <span className="draggable">&#8285;&#8285;</span>
                      <div className="todo-text">{todo.text}</div>
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
              </CSSTransition>
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
          })}
        </TransitionGroup>
      ) : (
        todos.noTodos
      )}
    </ul>
  );
};

export default TodoList;
