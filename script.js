        let reminders = [];


// ===============================
// LOGIN
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const savedEmail = localStorage.getItem("medicineUser");

    if (savedEmail) {

        showMedicinePage(savedEmail);

    }


    document
        .getElementById("loginBtn")
        .addEventListener("click", login);


    document
        .getElementById("logoutBtn")
        .addEventListener("click", logout);


    document
        .getElementById("setReminderBtn")
        .addEventListener("click", setReminder);


    displayReminders();


    // Check alarm every second
    setInterval(checkReminders, 1000);

});


// Login function
function login() {

    const email =
        document.getElementById("email").value.trim();

    const loginMessage =
        document.getElementById("loginMessage");


    // Check email
    if (email === "") {

        loginMessage.textContent =
            "⚠️ Please enter your email ID.";

        loginMessage.style.color = "red";

        return;
    }


    // Validate email format
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        loginMessage.textContent =
            "⚠️ Please enter a valid email ID.";

        loginMessage.style.color = "red";

        return;
    }


    // Save email
    localStorage.setItem(
        "medicineUser",
        email
    );


    showMedicinePage(email);

}


// Show medicine page
function showMedicinePage(email) {

    document.getElementById("loginPage").style.display =
        "none";

    document.getElementById("medicinePage").style.display =
        "block";

    document.getElementById("userEmail").textContent =
        "Logged in as: " + email;

}


// Logout
function logout() {

    localStorage.removeItem("medicineUser");

    reminders = [];

    document.getElementById("medicinePage").style.display =
        "none";

    document.getElementById("loginPage").style.display =
        "block";

    document.getElementById("email").value = "";

    document.getElementById("loginMessage").textContent = "";

    displayReminders();

}


// ===============================
// MEDICINE REMINDER
// ===============================

function setReminder() {

    const medicine =
        document.getElementById("medicine").value.trim();

    const date =
        document.getElementById("date").value;

    const time =
        document.getElementById("time").value;

    const message =
        document.getElementById("message");


    if (
        medicine === "" ||
        date === "" ||
        time === ""
    ) {

        message.textContent =
            "⚠️ Please enter medicine, date and time.";

        message.style.color = "red";

        return;
    }


    const reminderDate =
        new Date(date + "T" + time);


    if (reminderDate.getTime() <= Date.now()) {

        message.textContent =
            "⚠️ Please select a future date and time.";

        message.style.color = "red";

        return;
    }


    const reminder = {

        id: Date.now(),

        medicine: medicine,

        date: date,

        time: time,

        reminderTime:
            reminderDate.getTime(),

        completed: false

    };


    reminders.push(reminder);


    message.textContent =
        "✅ Medicine reminder set successfully!";

    message.style.color = "green";


    document.getElementById("medicine").value = "";

    document.getElementById("date").value = "";

    document.getElementById("time").value = "";


    displayReminders();

}


// Display reminders
function displayReminders() {

    const reminderList =
        document.getElementById("reminderList");


    if (!reminderList) {
        return;
    }


    reminderList.innerHTML = "";


    if (reminders.length === 0) {

        reminderList.innerHTML =
            '<p class="empty">No reminders added yet.</p>';

        return;
    }


    reminders.forEach(function (reminder) {

        const box =
            document.createElement("div");


        box.className = "reminder";

        box.id =
            "reminder-" + reminder.id;


        box.innerHTML = `

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


        reminderList.appendChild(box);

    });

}


// Check reminders
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


// Show alarm
function showAlarm(reminder) {

    const alarm =
        document.getElementById("alarmSound");


    alarm.play().catch(function () {

        console.log(
            "Browser blocked automatic sound."
        );

    });


    alert(
        "💊 MEDICINE REMINDER!\n\n" +
        "Medicine: " +
        reminder.medicine +
        "\n\nTime: " +
        reminder.time
    );


    const box =
        document.getElementById(
            "reminder-" + reminder.id
        );


    if (box) {

        box.classList.add("alarm");

    }


    // Stop sound after 10 seconds
    setTimeout(function () {

        alarm.pause();

        alarm.currentTime = 0;

    }, 10000);

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
