// Store all medicine reminders
let reminders = [];


// Run after HTML has loaded
document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("setReminderBtn");

    button.addEventListener("click", setReminder);

    displayReminders();

    // Check the time every second
    setInterval(checkReminders, 1000);

});


// Set a new medicine reminder
function setReminder() {

    const medicine =
        document.getElementById("medicine").value.trim();

    const date =
        document.getElementById("date").value;

    const time =
        document.getElementById("time").value;

    const message =
        document.getElementById("message");


    // Check empty fields
    if (medicine === "" || date === "" || time === "") {

        message.textContent =
            "⚠️ Please enter medicine name, date and time.";

        message.style.color = "red";

        return;
    }


    // Create date and time
    const reminderDate =
        new Date(date + "T" + time);


    // Check whether selected time is in the past
    if (reminderDate.getTime() <= Date.now()) {

        message.textContent =
            "⚠️ Please select a future date and time.";

        message.style.color = "red";

        return;
    }


    // Create reminder object
    const reminder = {

        id: Date.now(),

        medicine: medicine,

        date: date,

        time: time,

        reminderTime: reminderDate.getTime(),

        completed: false

    };


    // Add reminder
    reminders.push(reminder);


    // Success message
    message.textContent =
        "✅ Medicine reminder set successfully!";

    message.style.color = "green";


    // Clear input fields
    document.getElementById("medicine").value = "";

    document.getElementById("date").value = "";

    document.getElementById("time").value = "";


    // Display reminders
    displayReminders();

}


// Display all reminders
function displayReminders() {

    const reminderList =
        document.getElementById("reminderList");


    // Clear old list
    reminderList.innerHTML = "";


    // No reminders
    if (reminders.length === 0) {

        reminderList.innerHTML =
            '<p class="empty">No reminders added yet.</p>';

        return;
    }


    // Display every reminder
    reminders.forEach(function (reminder) {

        const reminderBox =
            document.createElement("div");


        reminderBox.className = "reminder";

        reminderBox.id =
            "reminder-" + reminder.id;


        reminderBox.innerHTML = `

            <strong>
                💊 ${reminder.medicine}
            </strong>

            <p>
                📅 Date: ${reminder.date}
            </p>

            <p>
                ⏰ Time: ${reminder.time}
            </p>

            <button
                class="delete-btn"
                onclick="deleteReminder(${reminder.id})">
                🗑️ Delete
            </button>

        `;


        reminderList.appendChild(reminderBox);

    });

}


// Check whether it is time for a medicine
function checkReminders() {

    const currentTime = Date.now();


    reminders.forEach(function (reminder) {

        if (
            !reminder.completed &&
            currentTime >= reminder.reminderTime
        ) {

            reminder.completed = true;

            showAlarm(reminder);

        }

    });

}


// Show medicine alarm
function showAlarm(reminder) {

    const alarmSound =
        document.getElementById("alarmSound");


    // Try to play alarm
    alarmSound.play().catch(function () {

        console.log(
            "Alarm sound was blocked by the browser."
        );

    });


    // Show popup
    alert(
        "💊 MEDICINE REMINDER!\n\n" +
        "Medicine: " + reminder.medicine + "\n" +
        "Time: " + reminder.time
    );


    // Highlight reminder
    const reminderBox =
        document.getElementById(
            "reminder-" + reminder.id
        );


    if (reminderBox) {

        reminderBox.classList.add("alarm");

    }


    // Browser notification
    showNotification(reminder);


    // Stop alarm after 10 seconds
    setTimeout(function () {

        alarmSound.pause();

        alarmSound.currentTime = 0;

    }, 10000);

}


// Browser notification
function showNotification(reminder) {

    if (!("Notification" in window)) {
        return;
    }


    if (Notification.permission === "granted") {

        new Notification(
            "💊 Medicine Reminder",
            {
                body:
                    "It is time to take " +
                    reminder.medicine
            }
        );

    }

}


// Delete reminder
function deleteReminder(id) {

    reminders = reminders.filter(
        function (reminder) {

            return reminder.id !== id;

        }
    );


    displayReminders();

}
