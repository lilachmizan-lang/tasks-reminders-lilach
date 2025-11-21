// טעינה ראשונית של משימות מה-localStorage
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    requestNotificationPermission();
});

// בקשת אישור להתראות
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

// הוספת משימה
function addTask() {
    const text = document.getElementById("taskText").value.trim();
    const time = document.getElementById("taskTime").value;

    if (!text) return alert("נא לכתוב שם משימה");
    if (!time) return
