let form = document.querySelector("form");
//adding event listner on form submit
form.addEventListener("submit", (e) => {
  let duplicateTask = false;
  //prevent default behaviour of reloading after submission of form
  e.preventDefault();
  let subject = e.target.subject.value;
  let priority = e.target.priority.value;
  let dueDate = e.target.dueDate.value.replace("T", " ");
  let details = e.target.details.value;
  let txtColor = "";

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
    if (task.subject == subject && task.dueDate == dueDate) {
      duplicateTask = true;
      break;
    }
  }

  //if duplicate found alert user else create task
  if (duplicateTask) {
    alert("Task alraedy exist!");
  } else {
    allTasks.push({
      subject: subject,
      priority: priority,
      dueDate: dueDate,
      details: details,
      txtColor: txtColor,
    });

    //pushing data in Local Storage
    localStorage.setItem("taskList", JSON.stringify(allTasks));
    //caling displayHandler function to show all tasks to user on browser screen
    displayHandler();
  }
});

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

displayHandler();
