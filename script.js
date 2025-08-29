
const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskcontainer");
const blukRemoveBtn = document.getElementById("bulkRemoveBtn");
blukRemoveBtn.hidden = true;
renderTasks();
taskInput.addEventListener("keydown", (event) => {
    if (event.key == 'Enter') {
        addTask();
    }
});

function addTask() {
    const task = taskInput.value.trim();
    if (task.length == 0) {
        taskInput.reportValidity();
        return;
    }
    const taskList = get("tasks");
    const exitingTask = taskList.find(t => t.name===task);
    if(exitingTask){
        alert("Task already Exist")
        return;
    }
    taskList.push({ name: task, status: false });
    set('tasks', taskList);
    taskInput.value = "";
    renderTasks();
}

function get(key) {
    const tasks = localStorage.getItem(key);
    return tasks ?  JSON.parse(tasks) : [];
}

function set(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}


function renderTasks() {
    taskContainer.replaceChildren();
    const tasks = get("tasks");
    showClearCompleteTaskBtn()
    for (let task of tasks ) {
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
    const tasks =  get("tasks");
    const changedTask = tasks.find(t => t.name === task.name);
    console.log(`task to be change ${JSON.stringify(changedTask)}`);
    changedTask.status = !changedTask.status;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showClearCompleteTaskBtn();
    console.log("handleTaskStatusChange >>>>>>>>>>");
}

function showClearCompleteTaskBtn(){
    const tasks =  get("tasks");
     const completedTask = tasks.filter(t => t.status);
    if (completedTask.length > 0) {
        blukRemoveBtn.hidden = false;
        return;
    }
    blukRemoveBtn.hidden = true;
}

const handleRemoveTask = (task) => {
    console.log("<<<<<<<<<< handleRemoveTask");
    removTask(task);
    console.log("handleRemoveTask >>>>>>>>>>");
    renderTasks();
};

const handleRemoveCompletedBulkTask = () => {
    console.log("<<<<<<<<<< handleRemoveCompletedBulkTask");
    taskList.filter(t => t.status).forEach(task => {
        removTask(task);
    });
    blukRemoveBtn.hidden = true;
    console.log("handleRemoveCompletedBulkTask >>>>>>>>>>");
    renderTasks();
}

function removTask(task) {
    const taskIndexToBeRemove = afterParsTasks.indexOf(task);
    afterParsTasks.splice(taskIndexToBeRemove, 1);
    localStorage.setItem('tasks', JSON.stringify(afterParsTasks));
}

