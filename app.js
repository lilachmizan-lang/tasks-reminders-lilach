document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    requestNotificationPermission();

    document.getElementById("addTaskBtn").addEventListener("click", addTask);
});

// בקשת הרשאת התראות
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

// יצירת משימה חדשה
function addTask() {
    const text = document.getElementById("taskText").value.trim();
    const time = document.getElementById("taskTime").value;
    const subtasksInput = document.getElementById("subTasksText").value;

    if (!text) return alert("נא לכתוב שם משימה");
    if (!time) return alert("נא לבחור זמן");

    // פיצול תתי־משימות לפי שורות
    const subtasks = subtasksInput
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => ({ text: line.trim(), done: false }));

    const task = {
        id: Date.now(),
        text,
        time,
        done: false,
        subtasks
    };

    saveTask(task);
    displayTask(task);
    scheduleReminder(task);

    // איפוס שדות
    document.getElementById("taskText").value = "";
    document.getElementById("taskTime").value = "";
    document.getElementById("subTasksText").value = "";
}

// שמירת משימה ב-localStorage
function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// טעינת כל המשימות
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.forEach(task => {
        displayTask(task);
        scheduleReminder(task);
    });
}

// הצגת משימה על המסך
function displayTask(task) {
    const list = document.getElementById("tasksList");

    const li = document.createElement("li");
    li.className = "task-item";
    if (task.done) li.classList.add("done");

    // כותרת המשימה
    const title = document.createElement("div");
    title.innerHTML = `<strong>${task.text}</strong> — ${formatDate(task.time)}`;

    // תתי־משימות
    const subtasksContainer = document.createElement("ul");
    subtasksContainer.style.marginTop = "10px";

    task.subtasks.forEach((sub, index) => {
        const subLi = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = sub.done;
        checkbox.addEventListener("change", () => toggleSubtask(task.id, index));

        subLi.appendChild(checkbox);
        subLi.appendChild(document.createTextNode(" " + sub.text));
        subtasksContainer.appendChild(subLi);
    });

    // כפתור לסימון המשימה הראשית כבוצעה
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✔️";
    doneBtn.onclick = () => toggleDone(task.id);

    li.appendChild(title);
    li.appendChild(subtasksContainer);
    li.appendChild(doneBtn);

    list.appendChild(li);
}

// סימון משימה ראשית כבוצעה
function toggleDone(id) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    const updated = tasks.map(t => {
        if (t.id === id) t.done = !t.done;
        return t;
    });

    localStorage.setItem("tasks", JSON.stringify(updated));
    location.reload();
}

// סימון תת־משימה
function toggleSubtask(taskId, subIndex) {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    const updated = tasks.map(t => {
        if (t.id === taskId) {
            t.subtasks[subIndex].done = !t.subtasks[subIndex].done;
        }
        return t;
    });

    localStorage.setItem("tasks", JSON.stringify(updated));
}

// תזמון תזכורת
function scheduleReminder(task) {
    const now = Date.now();
    const taskTime = new Date(task.time).getTime();

    const timeout = taskTime - now;
    if (timeout <= 0) return;

    setTimeout(() => showNotification(task), timeout);
}

// התראה
function showNotification(task) {
    if (Notification.permission === "granted") {
        new Notification("תזכורת 📌", {
            body: task.text,
            icon: "https://cdn-icons-png.flaticon.com/512/3214/3214464.png"
        });
    }
}

// פורמט תאריך־שעה
function formatDate(dateString) {
    return new Date(dateString).toLocaleString("he-IL");
}
