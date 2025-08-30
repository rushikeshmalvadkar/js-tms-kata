const ENABLE_CARD_FEATURE = true;
const taskInput = document.getElementById("taskInput");
const taskContainer = document.getElementById("taskcontainer");
const blukRemoveBtn = document.getElementById("bulkRemoveBtn");
blukRemoveBtn.hidden = true;
blukRemoveBtn.className = "btn btn-sm btn-danger mb-4";

// drag & drop code 
const sortable = new Sortable(document.getElementById('taskcontainer'), {
    animation: 150,
    ghostClass: 'sortable-ghost',
    handle: '.drag-handle',  // Make only the drag handle clickable for sorting
    onEnd: function (evt) {
        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        if (oldIndex !== newIndex) {
            const tasks = get("tasks");
            const movedTask = tasks.splice(oldIndex, 1)[0];
            tasks.splice(newIndex, 0, movedTask);
            set("tasks", tasks);
            renderTasks(); // Re-render to update indexes
        }
    }
});





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
    const exitingTask = taskList.find(t => t.name === task);
    if (exitingTask) {
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
    return tasks ? JSON.parse(tasks) : [];
}

function set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


function renderTasks() {
    taskContainer.replaceChildren();
    const tasks = get("tasks");
    showClearCompleteTaskBtn()
    for (let task of tasks) {
        if (ENABLE_CARD_FEATURE) {
            handleSingleTaskInCard(task);
        } else {
            handleSingleTaskDisplay(task);
        }
    }
}

function handleSingleTaskInCard(task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "col-12 col-sm-6 col-md-4 mb-4";

    // Card container
    const card = document.createElement("div");
    card.className = `card border-0 shadow-lg rounded-4 h-100 
                      ${task.status ? 'bg-primary-subtle' : 'bg-white'}`;
    card.style.transition = "all 0.3s ease";

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column justify-content-between p-4";

    // Drag handle (added)
    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = "<p>☰</p>"; // Use an icon or text for the drag handle
    cardBody.appendChild(dragHandle); // Add handle to card

    // Task name
    const taskTitleDiv = document.createElement("div");
    const taskText = document.createElement("h6");
    taskText.className = `mb-3 fw-semibold ${task.status ? 'text-success' : 'text-dark'}`;
    taskText.textContent = task.name;
    taskText.style.wordBreak = "break-word";
    taskTitleDiv.appendChild(taskText);

    // Button group (row with spacing)
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-flex flex-column flex-sm-row gap-2 mt-auto";

    const markCompletedBtn = document.createElement("button");
    markCompletedBtn.textContent = task.status ? "Mark as Pending" : "Mark as Completed";
    markCompletedBtn.className = `btn btn-sm ${task.status ? 'btn-primary' : 'btn-success'} w-100`;
    markCompletedBtn.addEventListener("click", () => handleTaskStatusChange(task));

    const removeTaskBtn = document.createElement("button");
    removeTaskBtn.textContent = "Remove";
    removeTaskBtn.className = "btn btn-sm btn-danger w-100";
    removeTaskBtn.addEventListener("click", () => handleRemoveTask(task));

    btnGroup.appendChild(markCompletedBtn);
    btnGroup.appendChild(removeTaskBtn);

    cardBody.appendChild(taskTitleDiv);
    cardBody.appendChild(btnGroup);
    card.appendChild(cardBody);
    taskDiv.appendChild(card);

    taskContainer.appendChild(taskDiv);
}




function handleSingleTaskDisplay(task) {
    const checkbox = document.createElement("input");
    const taskDiv = document.createElement("div");
    const removeTaskBtn = document.createElement("button");
    //removeTaskBtn.textContent = "Remove";
    //checkbox.type = "checkbox";
    //checkbox.checked = task.status;
    //checkbox.addEventListener("click", () => handleTaskStatusChange(task));
    removeTaskBtn.addEventListener("click", () => handleRemoveTask(task));
    const p = document.createElement("p");
    p.textContent = task.name;
    taskContainer.appendChild(taskDiv);
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(p);
    taskDiv.appendChild(removeTaskBtn);
}

function handleTaskStatusChange(task) {
    console.log("<<<<<<<<<< handleTaskStatusChange");
    const tasks = get("tasks");
    const changedTask = tasks.find(t => t.name === task.name);
    console.log(`task to be change ${JSON.stringify(changedTask)}`);
    changedTask.status = !changedTask.status;


    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    showClearCompleteTaskBtn();

    if (changedTask.status) {
        const modalElement = document.getElementById('congratsModal');
        const congratsModal = new bootstrap.Modal(modalElement);
        congratsModal.show();
    }


    console.log("handleTaskStatusChange >>>>>>>>>>");
}

function showClearCompleteTaskBtn() {
    const tasks = get("tasks");
    const completedTask = tasks.filter(t => t.status);
    if (completedTask.length > 0) {
        blukRemoveBtn.hidden = false;
        return;
    }
    blukRemoveBtn.hidden = true;
}

const handleRemoveTask = (task) => {
    console.log("<<<<<<<<<< handleRemoveTask");

    const modalElement = document.getElementById("removeTaskModal");
    const confirmBtn = document.getElementById("confirmRemoveBtn");
    const taskNameElem = document.getElementById("taskNameToRemove");

    // Show task name in modal (optional)
    taskNameElem.textContent = task.name;

    const removeModal = new bootstrap.Modal(modalElement);
    removeModal.show();

    // Reset previous click listeners
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    const newConfirmBtn = document.getElementById("confirmRemoveBtn");

    newConfirmBtn.addEventListener("click", () => {
        // Remove task
        removTask(task);

        // Hide modal
        removeModal.hide();

        console.log("handleRemoveTask >>>>>>>>>>");

        // Re-render tasks
        renderTasks();
    });
};

const handleRemoveCompletedBulkTask = () => {
    console.log("<<<<<<<<<< handleRemoveCompletedBulkTask");

    const tasks = get("tasks");
    const completedTasks = tasks.filter(t => t.status);

    if (completedTasks.length === 0) return;

    // Populate modal with completed task names
    const taskListElement = document.getElementById("bulkTaskListToRemove");
    taskListElement.innerHTML = ""; // Clear old items
    completedTasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.name;
        li.className = "list-group-item";
        taskListElement.appendChild(li);
    });

    // Show the modal
    const modalElement = document.getElementById("bulkDeleteModal");
    const bulkDeleteModal = new bootstrap.Modal(modalElement);
    bulkDeleteModal.show();

    // Reset previous listeners
    const confirmBtn = document.getElementById("confirmBulkDeleteBtn");
    confirmBtn.replaceWith(confirmBtn.cloneNode(true));
    const newConfirmBtn = document.getElementById("confirmBulkDeleteBtn");

    newConfirmBtn.addEventListener("click", () => {
        completedTasks.forEach(task => removTask(task));
        bulkDeleteModal.hide();
        renderTasks();
        blukRemoveBtn.hidden = true;
        console.log("handleRemoveCompletedBulkTask >>>>>>>>>>");
    });
};


function removTask(taskToBeRemo) {
    const tasks = get("tasks");
    const taskIndexToBeRemove = tasks.findIndex(task => task.name === taskToBeRemo.name);;
    tasks.splice(taskIndexToBeRemove, 1);
    set("tasks", tasks);
}

