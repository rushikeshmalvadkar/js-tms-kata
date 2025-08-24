// get the input from the add task input tag
const taskList = [];
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskcontainer");
addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const task = taskInput.value.trim();
    if (task === "") {
        console.log("please enter the task");
        return;
    }
    taskList.push({ name: task, status: false });
    taskInput.value = "";
    renderTasks(task);
}

// show the task in hpme page
function renderTasks(task) {    
    console.log(`current task list ${JSON.stringify(taskList)}`);
    taskContainer.replaceChildren(); // clears all children

    for (let task of taskList) {
        const checkbox = document.createElement("input");
        const taskDiv = document.createElement("div");
        checkbox.type = "checkbox";
        checkbox.checked = task.status;
        checkbox.addEventListener("click",() => handleTaskStatusChange(task));
        const p = document.createElement("p");
        p.textContent = task.name;
        taskContainer.appendChild(taskDiv);
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(p);
    }
}
function handleTaskStatusChange(task) {
    console.log("<<<<<<<<<< handleTaskStatusChange");
    
    const changedTask = taskList.find(t => t.name === task.name);
    console.log(`task to be change ${JSON.stringify(changedTask)}`);
    
    changedTask.status = !changedTask.status;
    console.log(`current task list ${JSON.stringify(taskList)}`);
    
    console.log("handleTaskStatusChange >>>>>>>>>>");
}

