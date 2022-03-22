import React, { useRef } from "react";

import { Todo } from "../model/todo.model";

import "./NewTodo.css";

interface TodoAddProps {
  type: "new" | "edit";
  submitTodo: (
    text: string,
    date: Date,
    priority: string,
    todoId?: string
  ) => void;
  todo?: Todo;
  onEditableTodo?: (id: string) => void;
  selectedDay?: string;
  onToggleShowAddTodo?: () => void;
}

const NewTodo: React.FC<TodoAddProps> = (props) => {
  const todoTextRef = useRef<HTMLInputElement>(null);
  const todoDateRef = useRef<HTMLInputElement>(null);
  const todoPriorityRef = useRef<HTMLSelectElement>(null);

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    const enteredText = todoTextRef.current!.value;
    const enteredDate = new Date(todoDateRef.current!.value);
    const enteredPriority = todoPriorityRef.current!.value;
    if (props.type === "new") {
      props.submitTodo(enteredText, enteredDate, enteredPriority);
    } else {
      props.submitTodo(
        enteredText,
        enteredDate,
        enteredPriority,
        props.todo!.id
      );
    }
    todoTextRef.current!.value = "";
  };

  return (
    <form onSubmit={todoSubmitHandler}>
      <div>
        <input
          type="text"
          id="todo-text"
          ref={todoTextRef}
          placeholder="Title"
          defaultValue={props.type === "edit" ? props.todo!.text : ""}
          required
        />
        <input
          type="date"
          id="todo-date"
          ref={todoDateRef}
          min={new Date().toISOString().split("T")[0]}
          defaultValue={
            props.type === "edit"
              ? new Date(props.todo!.fullDate).toISOString().substring(0, 10)
              : new Date().toISOString().substring(0, 10)
          }
          required
        />
        <select
          id="todo-priority"
          ref={todoPriorityRef}
          defaultValue={props.type === "edit" ? props.todo!.priority : "p1"}
        >
          <option value="p1">Priority 1</option>
          <option value="p2">Priority 2</option>
          <option value="p3">Priority 3</option>
          <option value="p4">Priority 4</option>
        </select>
      </div>
      <div className="actions">
        <button className="add__btn" type="submit">
          {props.type === "edit" ? "Edit todo" : "Add todo"}
        </button>
        <button
          className="cancel__btn"
          type="button"
          onClick={() =>
            props.type === "edit"
              ? props.onEditableTodo!(props.todo!.id)
              : props.onToggleShowAddTodo!()
          }
        >
          Close
        </button>
      </div>
    </form>
  );
};

export default NewTodo;
