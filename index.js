const currentTime = document.getElementById("current-time");
const setHours = document.getElementById("hours");
const setMinutes = document.getElementById("minutes");
const setSeconds = document.getElementById("seconds");
const setAmPm = document.getElementById("am-pm");
const setAlarmButton = document.getElementById("submit-button");
const alarmContainer = document.getElementById("alarms-container");

//Adding Hours, Minutes, and Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
    dropDownMenu(1, 12, setHours);
    dropDownMenu(0, 59, setMinutes);
    dropDownMenu(0, 59, setSeconds);

    setInterval(getCurrentTime,1000);
    fetchAlarm();
});

//Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

function dropDownMenu(start, end, element) {
    for(let i=start;i<=end;i++) {
        const dropDown = document.createElement("option");
        dropDown.value = i<10? "0" + i : i;
        dropDown.innerHTML = i<10? "0" + i : i;
        element.appendChild(dropDown);
    }
}

//Fetch current time
function getCurrentTime() {
    let time = new Date();
    time = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
    });
    currentTime.innerHTML = time;
    return time;
}

//Take input for setting alarm
function getInput(e) {
    e.preventDefault();
    const hourValue = setHours.value;
    const minuteValue = setMinutes.value;
    const secondValue = setSeconds.value;
    const amPmValue = setAmPm.value;

    const alarmTime = covertToTime(hourValue, minuteValue, secondValue, amPmValue);

    setAlarm(alarmTime);
}

function covertToTime(hour, minute, second, amPm) {
    return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching=false) {
    const alarm = setInterval(() => {
        if(time === getCurrentTime()) {
            alert("Alarm Ringing");
            console.log("running");
        }
    }, 500);
    addAlarmToDom(time,alarm);
    if(!fetching) {
        saveAlarm(time);
    }
}

//Is alarm saved in local storage?
function checkAlarms() {
    let alarms = [];
    const isPresent = localStorage.getItem("alarms");
    if(isPresent) alarms = JSON.parse(isPresent);

    return alarms;
}

//save alarm to local storage
function saveAlarm(time) {
    const alarms = checkAlarms();

    alarms.push(time);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

//Fetching alarm from local storage
function fetchAlarm() {
    const alarms = checkAlarms();

    alarms.forEach((time) => {
        setAlarm(time, true);
    });
}

//Alarms set by user Displayed in HTML
function addAlarmToDom(time, intervalId) {
    const alarm = document.createElement("div");
    alarm.classList.add("alarm", "mb", "d-flex");
    alarm.innerHTML = `<div id="time">${time}</div>
                       <button class="btn" id="delete-alarm" data-id=${intervalId} >Delete</button> 
                        `;
    // alarmContainer.prepend(alarm);
    const deleteButton = alarm.querySelector("#delete-alarm");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));
    
    alarmContainer.prepend(alarm);
}

function deleteAlarm(event, time, intervalId) {
    const self = event.target;

    clearInterval(intervalId);

    const alarm = self.parentElement;
    console.log(time);

    deleteAlarmFromLocal(time);
    alarm.remove();
}

function deleteAlarmFromLocal(time) {
    const alarms = checkAlarms();

    const index = alarms.indexOf(time);
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
}