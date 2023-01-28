const state = {
    taskList: [],
};

// SELECTING ELEMENTS FROM HTML
const taskModal = document.querySelector(".task__modal__body");
const taskContents = document.querySelector(".task__contents");

// TODO LIST CARD
const htmlTaskContent = ({ id, title, description, type, url }) => `
          
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
        <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
            <button type='button' class='btn btn-outline-secondary mr-2' name=${id} onclick="editTask.apply(this, arguments)">
                <i class='fas fa-pencil-alt' name=${id}></i>
            </button>
            <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
                <i class='fas fa-trash-alt' name=${id}></i>
            </button>
        </div>
        <div class='card-body'>
            ${
                url
                    ? `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src=${url} alt='card image cap' class='card-image-top md-3 rounded-lg' />`
                    : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            }
            <h4 class='task__card__title'>
                ${title}
            </h4>
            <p class='description trim-3-lines text-muted' data-gram_editor='false'>
                ${description}
            </p>
            <div class='tags text-white d-flex flex-wrap'>
                <span class='badge bg-dark m-1'>
                    ${type}
                </span>
            </div>
        </div>
        <div class='card-footer'>
            <button 
                type='button' 
                class='btn btn-outline-dark float-right' 
                data-bs-toggle='modal'
                data-bs-target='#showTask'
                id=${id}
                onclick='openTask.apply(this, arguments)'
            >
                Open Task
            </button>
        </div>
        </div>
    </div>
`;

// TASK DETAILS
// FILLING DATA
const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
        <div id = ${id}>
            ${
                url
                    ? `<img width='100%' src=${url} alt='card image here  class='img-fluid place__holder__image mb-3'/>`
                    : `<img width='100%' height='150px' style="object-fit: cover; object-position: center"  src="https://tse3.mm.bing.net/th?id=OIP.LZsJaVHEsECjt_hv1KrtbAHaHa&pid=Api&P=0" alt='card image cap' class='card-image-top md-3 rounded-lg' />`
            }
            <strong class="text-sm text-muted">
                Created on ${date.toDateString()}
            </strong>
            <h2 class="my-3">
                ${title}
            </h2>
            <p class='lead'>
                ${description}
            </p>
        </div>`;
};

// UPDATE LOCAL STORAGE
const updateLocalStorage = () => {
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks: state.taskList,
        })
    );
};

// LOAD DATA : CALLED FROM "BODY" TAG
const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.task);

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
    });
};

// HANDLING CLICK
// BUTTON : "Save changes" ON "Add New Task" POPUP WINNDOw
const handleSubmit = function (event) {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imageUrl").value,
        title: document.getElementById("taskTitle").value,
        type: document.getElementById("tags").value,
        description: document.getElementById("taskDescription").value,
    };

    // VALIDATION
    if (input.title === "" || input.type === "" || input.description === "") {
        return alert("Please Fill All The Fields");
    }
    taskContents.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({
            ...input,
            id,
        })
    );

    // UPDATE TASKLIST
    state.taskList.push({ ...input, id });

    // UPDATE TASKLIST ON LOCAL STORAGE
    updateLocalStorage();
};

// HANDLING CLICK
// BUTTON : "Open Task" ON "Card" / "Task Content"
const openTask = function (e) {
    if (!e) e = window.event;

    // FIND THE CURRECT CARD TO OPEN
    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
};

// HANDLING CLICK
// // BUTTON : "Delete" ON "Card" / "Task Content"
const deleteTask = function (e) {
    if (!e) e = window.event;

    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const taskListAfterRemoval = state.taskList.filter(({ id }) => id !== targetID);

    state.taskList = taskListAfterRemoval;
    updateLocalStorage();

    if (type === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

// HANDLING CLICK
// // BUTTON : "edit" ON "Card" / "Task Content"
const editTask = function (e) {
    if (!e) e = window.event;

    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskList;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    } else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];
    // console.log(taskTitle);

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    // needs to be implemented
    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};

// HANDLING CLICK
// // BUTTON : "Save Changes" ON "Card" / "Task Content"
const saveEdit = function (e) {
    if (!e) e = window.event;

    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const updatedData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    let stateCopy = state.taskList;
    stateCopy = stateCopy.map((task) =>
        task.id === targetID
            ? {
                  id: task.id,
                  title: updatedData.taskTitle,
                  description: updatedData.taskDescription,
                  type: updatedData.taskType,
                  url: task.url,
              }
            : task
    );

    state.taskList = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";
};

// SEARCH
const searchTask = function (e) {
    if (!e) e = window.event;

    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }

    const resultData = state.taskList.filter(function ( {title} ) {
        return title.toLowerCase().includes(e.target.value.toLowerCase());
    });

    resultData.map((cardData) =>
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
    );
};
