import React, { useEffect, useState } from "react";

import TodoList from "./components/TodoList";

import { ProjectStatus, Todo } from "./model/todo.model";

import TodoListLayout from "./ui/TodoListLayout";

import { stringifyDate } from "./util/util-functions";
import ChangeMonth from "./components/ChangeMonth/ChangeMonth";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    let initialTodos: Todo[] = [];
    if (savedTodos) {
      initialTodos = JSON.parse(savedTodos);
    }
    return initialTodos;
  });

  const [selectedDay, setSelectedDay] = useState("");

  const onSetSelectedDay = (day: string) => {
    setSelectedDay(day);
  };

  const filteredTodos = todos.filter((todo) => {
    if (selectedDay) {
      return todo.date === selectedDay;
    }
    return (
      new Date(new Date(todo.fullDate).setHours(0, 0, 0, 0)).getTime() ===
      new Date(new Date().setHours(0, 0, 0, 0)).getTime()
    );
  });

  useEffect(() => {
    let hasChange = false;
    //set today at midnight
    const today = new Date().setHours(0, 0, 0, 0);
    const newTodos = todos.map((todo) => {
      const todoDate = new Date(todo.fullDate).getTime();
      if (todoDate < today) {
        hasChange = true;
        return {
          ...todo,
          status: ProjectStatus.Overdue,
        };
      }
      return todo;
    });

    if (hasChange) {
      setTodos(newTodos);
    }
  }, []);

  const todoAddHandler = (text: string, date: Date, priority: string) => {
    setTodos((prevTodos) => {
      return [
        ...prevTodos,
        {
          id: Math.floor(Math.random() * (100000 - 10000) + 10000).toString(),
          text: text,
          status: ProjectStatus.Active,
          priority: priority,
          date: stringifyDate(date),
          createdOn: new Date(),
          fullDate: new Date(date),
          isEditable: false,
        },
      ];
    });
  };

  //change map to find faster
  const todoUpdateHandler = (
    text: string,
    date: Date,
    priority: string,
    todoId?: string
  ) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === todoId
          ? {
              ...todo,
              text: text,
              date: stringifyDate(date),
              priority: priority,
              isEditable: !todo.isEditable,
            }
          : todo;
      });
    });
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
  };

  // FOR CHECKBOX
  const toggleTodoStatus = (todoId: string, status: ProjectStatus) => {
    const newStatus =
      status === ProjectStatus.Active
        ? ProjectStatus.Finished
        : ProjectStatus.Active;
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === todoId ? { ...todo, status: newStatus } : todo;
      });
    });
  };

  // THIS IS FOR DRAG
  const changeTodoStateHandler = (todoId: string, status: ProjectStatus) => {
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    const newTodos = [...todos];
    const newTodo: Todo = todos[todoIndex];
    status !== ProjectStatus.Active
      ? (newTodo.status = ProjectStatus.Finished)
      : (newTodo.status = ProjectStatus.Active);
    newTodos[todoIndex] = newTodo;
    setTodos(newTodos);
  };

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  //better performance with find
  const isEditableHandler = (todoId: string) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.id === todoId
          ? { ...todo, isEditable: !todo.isEditable }
          : todo;
      });
    });
  };

  const clickOutsideHandler = (_event: MouseEvent) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        return todo.isEditable === true
          ? { ...todo, isEditable: !todo.isEditable }
          : todo;
      });
    });
  };

  console.log(todos);

  return (
    <>
      <div className="App">
        <ChangeMonth
          todos={todos}
          selectedDay={selectedDay}
          onSetSelectedDay={setSelectedDay}
          submitTodo={todoAddHandler}
        />
        <TodoListLayout
          type={"active"}
          changeTodoStateDrag={changeTodoStateHandler}
        >
          <TodoList
            list={"active"}
            items={filteredTodos}
            onToggleTodoStatus={toggleTodoStatus}
            onDeleteTodo={todoDeleteHandler}
            onEditableTodo={isEditableHandler}
            onUpdateTodo={todoUpdateHandler}
            onClickOutside={clickOutsideHandler}
          />
        </TodoListLayout>
        <TodoListLayout
          type={"finished"}
          changeTodoStateDrag={changeTodoStateHandler}
        >
          <TodoList
            list={"finished"}
            items={filteredTodos}
            onToggleTodoStatus={toggleTodoStatus}
            onDeleteTodo={todoDeleteHandler}
            onEditableTodo={isEditableHandler}
            onUpdateTodo={todoUpdateHandler}
            onClickOutside={clickOutsideHandler}
          />
        </TodoListLayout>
      </div>
    </>
  );
};

export default App;
