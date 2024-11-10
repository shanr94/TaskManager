let digiClock = document.getElementById("digiClock");
let form = document.querySelector("form");
let dateElm = document.getElementById("cDate");
let timeElm = document.getElementById("cTime");
let dayElm = document.getElementById("cDay");
const dayArry = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let isDueDateValid = false;

//adding event listner on form submit
form.addEventListener("submit", (e) => {
  //prevent default behaviour of reloading after submission of form
  e.preventDefault();
  let duplicateTask = false;
  let subject = e.target.subject.value;
  let priority = e.target.priority.value;
  let dueDate = e.target.dueDate.value;
  let details = e.target.details.value;
  let txtColor = "";
  let finalDueDate = "";

  dueDateValidityHandler(dueDate);

  if (isDueDateValid) {
    finalDueDate = dueDate.replace("T", " ");
    //setting text color based on priority
    if (priority == "high") {
      txtColor = 'style="color: red"';
    } else if (priority == "medium") {
      txtColor = 'style="color: yellow"';
    } else if (priority == "low") {
      txtColor = `style="color: #b9ff14"`;
    }
    //getting data from local storage as JSON and converting it in Array
    let allTasks = JSON.parse(localStorage.getItem("taskList")) ?? [];
    //checking for duplicate entery
    for (let task of allTasks) {
      if (
        task.subject == subject &&
        task.dueDate == finalDueDate &&
        task.priority == priority
      ) {
        duplicateTask = true;
        break;
      }
    }
    //if duplicate found alert user else create task
    if (duplicateTask) {
      alert("Task alraedy exist!");
      document
        .querySelectorAll("form input, form select, form textarea")
        .forEach((elm) => {
          elm.style.borderBottom = "2px solid red";
        });
    } else {
      allTasks.push({
        subject: subject,
        priority: priority,
        dueDate: finalDueDate,
        details: details,
        txtColor: txtColor,
      });
      //pushing data in Local Storage
      localStorage.setItem("taskList", JSON.stringify(allTasks));
      //caling displayHandler function to show all tasks to user on browser screen
      displayHandler();
    }
  } else {
    alert(`Due Date and Time can't be prior to current date & time!`);
  }
});

//checking if due date is not prior to current date
function dueDateValidityHandler(dueDate) {
  let dt1 = new Date(dueDate);
  let currentDate = new Date();
  if (dt1.getTime() < currentDate.getTime()) {
    isDueDateValid = false;
  } else {
    isDueDateValid = true;
  }
}

function displayHandler() {
  //getting data from local storage as JSON and converting it in Array
  let allTasks = JSON.parse(localStorage.getItem("taskList")) ?? [];
  let finalList = [];
  //dynamically adding new task to existing taskList and storing in new array
  allTasks.forEach((elm, i) => {
    finalList.push(
      `
            <div class="task">
                <span class="deleteIcon" onclick=deleteHandler(${i})> &times;</span>
                <h3>Subject: <span>${elm.subject}</span></h3>
                <h3 ${
                  elm.txtColor
                }>Priority: <span >${elm.priority.toUpperCase()}</span></h3>
                <h3>Due Date: <span>${elm.dueDate}</span></h3>
                <h3>Task Details:
                <span class="taskDetails">${elm.details}</span> </h3>
            </div>
            `
    );
  });

  //updating DOM to show all tasks to user
  document.getElementById("pendingTasks").innerHTML = finalList;
  //form reset
  document
    .querySelectorAll("form input, form select, form textarea")
    .forEach((elm) => {
      elm.style.borderBottom = "none";
    });
  form.reset();
}

function deleteHandler(index) {
  //getting data from local storage as JSON and converting it in Array
  let allTasks = JSON.parse(localStorage.getItem("taskList")) ?? [];
  //removing the clicked task from task list and pushing the reamining list to local storage
  allTasks.splice(index, 1);
  localStorage.setItem("taskList", JSON.stringify(allTasks));

  displayHandler();
}
setInterval(() => {
  let currentDate = new Date();

  let dt =
    currentDate.getDate() +
    "-" +
    months[currentDate.getMonth()] +
    "-" +
    currentDate.getFullYear();

  let hr = currentDate.getHours();
  if (hr > 12) {
    amPm = "PM";
    finalHR = hr - 12;
  } else {
    amPm = "AM";
    finalHR = hr;
  }
  let t =
    finalHR +
    ":" +
    currentDate.getMinutes() +
    ":" +
    currentDate.getSeconds() +
    "  " +
    amPm;

  dateElm.innerHTML = dt;
  dayElm.innerHTML = dayArry[currentDate.getDay()];
  timeElm.innerHTML = t;
}, 1000);
window.addEventListener("resize", () => {
  let width = window.innerWidth;
  if (width > 1200) {
    digiClock.style.position = "absolute";
    digiClock.style.top = "10vh";
    digiClock.style.right = "3vw";
  } else {
    digiClock.style.position = "relative";
    digiClock.style.top = "unset";
    digiClock.style.right = "unset";
  }
});
displayHandler();
