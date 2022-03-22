import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

import NewTodo from "../NewTodo";
import { ProjectStatus, Todo } from "../../model/todo.model";
import months from "../../data/months";
import daysOfWeek from "../../data/daysOfWeek";
import {
  addLeadingZero,
  sliceDayName,
  stringifyDate,
  sameDate,
  lesserDate,
} from "../../util/util-functions";

import "./ChangeMonth.css";

type ChangeMonthProps = {
  todos: Todo[];
  selectedDay: string;
  onSetSelectedDay: (day: string) => void;
  submitTodo: (text: string, date: Date, priority: string) => void;
};

type Day = {
  dayClass: string;
  number: number | null;
};

const ChangeMonth: React.FC<ChangeMonthProps> = ({
  todos,
  selectedDay,
  onSetSelectedDay,
  submitTodo,
}) => {
  let monthInitOn1st = new Date();
  monthInitOn1st.setDate(1);
  const [actualDate, setActualDate] = useState(monthInitOn1st);

  const [disablePreviousMonth, setDisablePreviousMonth] = useState(true);

  const [showAddBtn, setShowAddBtn] = useState(true);
  const [showAddTodo, setshowAddTodo] = useState(false);

  const onToggleShowAddTodo = () => {
    setshowAddTodo((prevState) => !prevState);
  };

  useEffect(() => {
    if (
      actualDate.getFullYear() === monthInitOn1st.getFullYear() &&
      actualDate.getMonth() === monthInitOn1st.getMonth()
    ) {
      setDisablePreviousMonth(true);
    } else {
      setDisablePreviousMonth(false);
    }
  }, [actualDate, monthInitOn1st]);

  //kalendar je niz dana kao objekti sa klasama i brojem koji je broj dana
  const calendar: Day[] = [];

  const onPreviousMonth = () => {
    if (actualDate.getMonth() === 0) {
      setActualDate((prevDate) => {
        const newDate = new Date(prevDate.getTime());
        newDate.setMonth(11);
        newDate.setFullYear(prevDate.getFullYear() - 1);
        return newDate;
      });
    } else {
      setActualDate((prevDate) => {
        const newDate = new Date(prevDate.getTime());
        newDate.setMonth(prevDate.getMonth() - 1);
        return newDate;
      });
    }
  };

  const onNextMonth = () => {
    if (actualDate.getMonth() === 11) {
      setActualDate((prevDate) => {
        const newDate = new Date(prevDate.getTime());
        newDate.setMonth(0);
        newDate.setFullYear(prevDate.getFullYear() + 1);
        return newDate;
      });
    } else {
      setActualDate((prevDate) => {
        const newDate = new Date(prevDate.getTime());
        newDate.setMonth(prevDate.getMonth() + 1);
        return newDate;
      });
    }
  };

  //trenutno prikazani mesec
  let thisMonth = new Date(actualDate.getTime());
  thisMonth.setDate(1);

  let firstDayOfMonth = actualDate.getDay() === 0 ? 7 : actualDate.getDay();

  //zbog stampanja stavimo prvo dane koji ne pocinju od pocetka nedelje
  for (let i = 1; i < firstDayOfMonth; i++) {
    if (firstDayOfMonth !== 7) {
      calendar.push({ dayClass: "no-day", number: null });
    }
  }

  while (thisMonth.getMonth() === actualDate.getMonth()) {
    //napravimo dayClass kao niz u koji stavljamo klase
    let dayClass = ["day"];

    //ako je datum manji od danasnjeg onda stavimo disabled
    //ako je actualDate == today stavimo today
    if (lesserDate(thisMonth, new Date())) {
      dayClass.push("day-disabled");
    } else if (sameDate(thisMonth, new Date())) {
      dayClass.push("today");
    }

    if (thisMonth.getDate() === +selectedDay.split("/")[0]) {
      dayClass.push("day-selected");
    }

    //zatim filter todos za taj datum koji prolazimo thismonth koj pocinje od prvog
    //vraca prvi element koji ispunjava uslov ako postoji za taj dan
    if (
      todos.find(
        (todo) =>
          todo.status === ProjectStatus.Active &&
          todo.date === stringifyDate(thisMonth)
      )
    ) {
      dayClass.push("day-todo");
    }

    //zatim niz klasa stavimo u string i dodamo u kalendar niz objekat sa stringom i broejm
    calendar.push({
      dayClass: dayClass.join(" "),
      number: thisMonth.getDate(),
    });

    //uvecamo dan za jedan ali mesec mora biti isti
    //kada zbir predje broj dana u mesecu datum automatski prelazi na prvi dan sledeceg meseca
    //kada se to desi while petlja se prekida
    thisMonth.setDate(thisMonth.getDate() + 1);
  }

  const onDaySelectHandler = (event: React.MouseEvent) => {
    const selectedDay = (event.target as Element).getAttribute(
      "day-value"
    ) as string;
    onSetSelectedDay(selectedDay);
  };

  return (
    <section className="default-layout">
      <div className="month">
        <button
          className="month__btn"
          onClick={onPreviousMonth}
          disabled={disablePreviousMonth}
        >
          {" "}
          &lt;{" "}
        </button>
        <p className="month__name">{`${
          months[actualDate.getMonth()]
        } ${actualDate.getFullYear()}`}</p>
        <button className="month__btn" onClick={onNextMonth}>
          {" "}
          &gt;{" "}
        </button>
      </div>
      <div className="grid-col7 days-week">
        {daysOfWeek.map((day) => (
          <div key={day}>{sliceDayName(day)}</div>
        ))}
      </div>
      <div className="grid-col7">
        {calendar.map((day, index) => {
          let dateOfDay = `${addLeadingZero(day.number)}/${addLeadingZero(
            actualDate.getMonth() + 1
          )}/${actualDate.getFullYear()}`;
          return day.number !== null ? (
            <div
              className={day.dayClass}
              key={index}
              day-value={dateOfDay}
              onClick={(event) => onDaySelectHandler(event)}
            >
              {day.number}
            </div>
          ) : (
            <div className={day.dayClass} key={index} />
          );
        })}
      </div>
      {/* {showAddTodo ? (
        <NewTodo
          type="new"
          submitTodo={submitTodo}
          selectedDay={selectedDay}
          onToggleShowAddTodo={onToggleShowAddTodo}
        />
      ) : (
        <div className="show-add-todo">
          <button onClick={onToggleShowAddTodo} data-tooltip="Add todo">
            +
          </button>
        </div>
      )} */}

      {showAddBtn && (
        <div className="show-add-todo">
          <button
            onClick={() => {
              setshowAddTodo(true);
            }}
            data-tooltip="Add todo"
          >
            +
          </button>
        </div>
      )}
      <CSSTransition
        in={showAddTodo}
        timeout={300}
        classNames="new-todo"
        unmountOnExit
        onEnter={() => setShowAddBtn(false)}
        onExited={() => {
          setShowAddBtn(true);
        }}
      >
        <NewTodo
          type="new"
          submitTodo={submitTodo}
          selectedDay={selectedDay}
          onToggleShowAddTodo={onToggleShowAddTodo}
        />
      </CSSTransition>
    </section>
  );
};

export default ChangeMonth;
