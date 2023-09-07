// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDateTime = document.getElementById('taskDateTime');
    const taskText = taskInput.value.trim();
    const taskDateTimeValue = taskDateTime.value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (taskText !== '' && isValidDateTime(taskDateTimeValue)) {
        errorMessage.textContent = ''; // Clear any previous error message

        const taskList = document.getElementById('taskList');

        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'animated', 'fadeInUp');

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = taskText;

        if (taskDateTimeValue !== '') {
            taskTextSpan.innerHTML += `<small class="text-muted ml-2">${formatDateTime(taskDateTimeValue)}</small>`;
        }

        const taskActionsDiv = document.createElement('div');

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-primary', 'mr-2');
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editButton.onclick = function() {
            editTask(listItem, taskTextSpan);
        };

        const completeButton = document.createElement('button');
        completeButton.classList.add('btn', 'btn-success', 'mr-2');
        completeButton.innerHTML = '<i class="fas fa-check"></i> Complete';
        completeButton.onclick = function() {
            toggleComplete(listItem, taskTextSpan);
        };

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
        deleteButton.onclick = function() {
            deleteTask(listItem);
        };

        taskActionsDiv.appendChild(editButton);
        taskActionsDiv.appendChild(completeButton);
        taskActionsDiv.appendChild(deleteButton);

        listItem.appendChild(taskTextSpan);
        listItem.appendChild(taskActionsDiv);

        taskList.appendChild(listItem);
        taskInput.value = '';
        taskDateTime.value = '';

        // Save tasks to local storage
        saveTasksToLocalStorage();
    } else {
        errorMessage.textContent = 'Please enter a valid task and date/time.';
    }
}

// Function to edit a task
function editTask(listItem, taskTextSpan) {
    const newText = prompt('Edit task:', taskTextSpan.textContent);
    if (newText !== null && newText.trim() !== '') {
        taskTextSpan.textContent = newText;

        // Save tasks to local storage after editing
        saveTasksToLocalStorage();
    }
}

// Function to toggle line-through effect for completed tasks
function toggleComplete(listItem, taskTextSpan) {
    taskTextSpan.classList.toggle('completed');
    
    // Add a blue tick icon if task is completed
    if (taskTextSpan.classList.contains('completed')) {
        const blueTick = document.createElement('i');
        blueTick.classList.add('fas', 'fa-check', 'text-primary', 'mr-2');
        listItem.insertBefore(blueTick, taskTextSpan);
    } else {
        // Remove the blue tick icon if task is marked incomplete
        const blueTick = listItem.querySelector('.fa-check');
        if (blueTick) {
            blueTick.remove();
        }
    }

    // Save tasks to local storage after marking as complete
    saveTasksToLocalStorage();
}

// Function to delete a task
function deleteTask(listItem) {
    listItem.classList.remove('fadeInUp');
    listItem.classList.add('fadeOutDown');
    
    // Remove the task after the animation completes
    setTimeout(function() {
        listItem.remove();
    }, 500);

    // Save tasks to local storage after deleting
    saveTasksToLocalStorage();
}

// Function to validate the task date and time
function isValidDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    return !isNaN(dateTime.getTime());
}

// Function to format the date and time
function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dateTime.toLocaleDateString('en-US', options);
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    const tasks = [];
    const taskList = document.getElementById('taskList').children;

    for (let i = 0; i < taskList.length; i++) {
        const taskText = taskList[i].querySelector('span').textContent;
        const isCompleted = taskList[i].querySelector('span').classList.contains('completed');
        tasks.push({ text: taskText, completed: isCompleted });
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage when the page loads
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));

    if (tasks) {
        const taskList = document.getElementById('taskList');

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'animated', 'fadeInUp');

            const taskTextSpan = document.createElement('span');
            taskTextSpan.textContent = task.text;

            if (task.completed) {
                taskTextSpan.classList.add('completed');

                // Add a blue tick icon for completed tasks
                const blueTick = document.createElement('i');
                blueTick.classList.add('fas', 'fa-check', 'text-primary', 'mr-2');
                listItem.insertBefore(blueTick, taskTextSpan);
            }

            const taskActionsDiv = document.createElement('div');

            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-primary', 'mr-2');
            editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
            editButton.onclick = function() {
                editTask(listItem, taskTextSpan);
            };

            const completeButton = document.createElement('button');
            completeButton.classList.add('btn', 'btn-success', 'mr-2');
            completeButton.innerHTML = '<i class="fas fa-check"></i> Complete';
            completeButton.onclick = function() {
                toggleComplete(listItem, taskTextSpan);
            };

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';
            deleteButton.onclick = function() {
                deleteTask(listItem);
            };

            taskActionsDiv.appendChild(editButton);
            taskActionsDiv.appendChild(completeButton);
            taskActionsDiv.appendChild(deleteButton);

            listItem.appendChild(taskTextSpan);
            listItem.appendChild(taskActionsDiv);

            taskList.appendChild(listItem);
        });
    }
}

// Load tasks from local storage when the page loads
window.addEventListener('load', loadTasksFromLocalStorage);