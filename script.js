
const taskList = [];
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskContainer = document.getElementById("taskcontainer");
addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const task = taskInput.value.trim();
    taskList.push({ name: task, status: false });
    taskInput.value = "";
    renderTasks();
}


function renderTasks() {
    console.log(`current task list ${JSON.stringify(taskList)}`);
    taskContainer.replaceChildren();

    for (let task of taskList) {
        const checkbox = document.createElement("input");
        const taskDiv = document.createElement("div");
        const removeTaskBtn = document.createElement("button");
        removeTaskBtn.textContent = "Remove";
        checkbox.type = "checkbox";
        checkbox.checked = task.status;
        checkbox.addEventListener("click", () => handleTaskStatusChange(task));
        removeTaskBtn.addEventListener("click", () => handleRemoveTask(task));
        const p = document.createElement("p");
        p.textContent = task.name;
        taskContainer.appendChild(taskDiv);
        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(p);
        taskDiv.appendChild(removeTaskBtn);
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

const handleRemoveTask = (task) => {
    console.log("<<<<<<<<<< handleRemoveTask");
    const taskIndexToBeRemove = taskList.indexOf(task);
    taskList.splice(taskIndexToBeRemove, 1);
    console.log("handleRemoveTask >>>>>>>>>>");
    renderTasks();
};

