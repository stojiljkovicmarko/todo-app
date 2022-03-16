import { Todo, ProjectStatus } from "../model/todo.model";

export const addLeadingZero = (number: number | null) => {
  if (number) return `0${number}`.slice(-2);
};

export const stringifyDate = (date: Date) => {
  const dateString = `${addLeadingZero(date.getDate())}/${addLeadingZero(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
  return dateString;
};

export const groupTodosByDate = (todos: Todo[]): {} => {
  return todos.reduce((group: any, todo: Todo) => {
    const { date } = todo;
    group[date] = group[date] ?? [];
    group[date].push(todo);

    //returns an object with dates as properties
    return group;
  }, {});
};

export const filterTodos = (todos: Todo[], todoStatus: ProjectStatus) => {
  return todos.filter((todo) => todo.status === todoStatus);
};

export const sliceDayName = (dayName: string) => {
  return dayName.slice(0, 3);
};

export const sameDate = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const lesserDate = (date1: Date, date2: Date) =>
  date1 < date2 && date1.getDate() < date2.getDate();

export const dayMonthToMonthDay = (date: string | undefined) => {
  if (date) {
    let helper = date.split("/");
    helper = [helper[2], helper[1], helper[0]];
    return helper.join("-");
  }
  return new Date();
};
