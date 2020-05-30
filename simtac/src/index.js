import React from "react";
import ReactDOM from "react-dom";

/* import Calendar from "./components/calendar/calendar"; */

/*
function CalendarFun() {
  return (
    <Calendar />
  );
}

const calElemnt = document.getElementById("calendar");
ReactDOM.render(<CalendarFun />, calElemnt);
*/
const btnClicked = document.getElementById("buy").onclick = changeBtn;
function changeBtn() {
  document.body.className = "btnpress";
}