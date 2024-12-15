// Motivational Quotes
const quotes = [
    "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
    "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
    "It does not matter how slowly you go as long as you do not stop. – Confucius",
    "The secret of getting ahead is getting started. – Mark Twain",
    "Small daily improvements are the key to staggering long-term results. – Unknown",
    "Just one small positive thought in the morning can change your whole day. - Dalai Lama",
    "You must be the change you wish to see in the world. - Mahatma Gandhi",
    "In the joy of others, lies our own. - Pramukh Swami Maharaj"
];

// Random Quote Generation
function generateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quote").innerText = quotes[randomIndex];
}

const BASE_URL = 'https://helabits-production.up.railway.app';

let habits = [];

// Fetch Habits
async function fetchHabits() {
    try {
        const response = await fetch(`${BASE_URL}/habits`);
        const data = await response.json();
        habits = data;
        displayHabits();
    } catch (error) {
        console.error("Error fetching habits:", error);
        alert("Failed to load habits from the server.");
    }
}

// Add New Habit
async function addHabit() {
    const name = document.getElementById('habit-name').value;
    const goal = parseInt(document.getElementById('habit-goal').value);
    const category = document.getElementById('habit-category').value;

    if (name && goal && category) {
        const newHabit = { name, goal, category };

        try {
            const response = await fetch(`${BASE_URL}/habits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHabit),
            });

            if (response.ok) {
                const addedHabit = await response.json();
                habits.push(addedHabit);
                displayHabits();
                clearInputs();
            } else {
                alert("Failed to add the habit.");
            }
        } catch (error) {
            console.error("Error adding habit:", error);
            alert("Failed to connect to the server.");
        }
    } else {
        alert('Please fill in all fields.');
    }
}

// Update Habit Progress
async function updateProgress(id, increment = true) {
    const day = new Date().toLocaleString('en-US', { weekday: 'long' });

    try {
        const response = await fetch(`${BASE_URL}/habits/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ day, increment }),
        });

        if (response.ok) {
            const updatedHabit = await response.json();
            habits = habits.map(habit => (habit.id === updatedHabit.id ? updatedHabit : habit));
            displayHabits();
        } else {
            alert("Failed to update the habit.");
        }
    } catch (error) {
        console.error("Error updating progress:", error);
        alert("Failed to connect to the server.");
    }
}

// Delete Habit
async function deleteHabit(id) {
    try {
        const response = await fetch(`${BASE_URL}/habits/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            habits = habits.filter(habit => habit.id !== id);
            displayHabits();
        } else {
            alert("Failed to delete the habit.");
        }
    } catch (error) {
        console.error("Error deleting habit:", error);
        alert("Failed to connect to the server.");
    }
}

// Display Habits
function displayHabits() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    habits.forEach(habit => {
        const weekProgress = Object.entries(habit.weekData || {})
            .map(([day, count]) => `${day}: ${count}`)
            .join(', ');

        const habitItem = document.createElement('li');
        habitItem.innerHTML = `
            <span><strong>${habit.name}</strong> (${habit.category}) - ${habit.progress}/${habit.goal}</span>
            <p>${weekProgress}</p>
            <div>
                <button onclick="updateProgress(${habit.id}, true)">+</button>
                <button onclick="updateProgress(${habit.id}, false)">-</button>
                <button onclick="deleteHabit(${habit.id})" style="background-color: red; color: white;">Delete</button>
            </div>
        `;
        habitList.appendChild(habitItem);
    });
}

function clearInputs() {
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-goal').value = '';
    document.getElementById('habit-category').value = '';
}

generateQuote();
fetchHabits();
