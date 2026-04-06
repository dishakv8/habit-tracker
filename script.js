let habits = JSON.parse(localStorage.getItem("habits")) || [];

function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

function addHabit() {
  const input = document.getElementById("habitInput");
  const name = input.value.trim();

  if (!name) return;

  habits.push({
    name,
    completedDates: [],
    streak: 0
  });

  input.value = "";
  saveData();
  renderHabits();
}

function toggleHabit(index) {
  const today = new Date().toISOString().split("T")[0];
  const habit = habits[index];

  let oldStreak = habit.streak;

  if (!habit.completedDates.includes(today)) {
    habit.completedDates.push(today);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yDate = yesterday.toISOString().split("T")[0];

    if (habit.completedDates.includes(yDate)) {
      habit.streak++;
    } else {
      habit.streak = 1;
    }

    // 🎉 CONFETTI TRIGGER
    if (habit.streak > oldStreak) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  saveData();
  renderHabits();
}

function deleteHabit(index) {
  habits.splice(index, 1);
  saveData();
  renderHabits();
}

function renderHabits() {
  const list = document.getElementById("habitList");
  list.innerHTML = "";

  habits.forEach((habit, index) => {
    const li = document.createElement("li");
    const today = new Date().toISOString().split("T")[0];
const doneToday = habit.completedDates.includes(today);

    li.innerHTML = `
      <strong>${habit.name}</strong><br>
      🔥 Streak: ${habit.streak} <br>
      <button onclick="toggleHabit(${index})">
  ${doneToday ? "✅ Done" : "Mark Done"}
</button>
      <button onclick="deleteHabit(${index})">Delete</button>
    `;

    list.appendChild(li);
  });
  renderHeatmap();
}
renderHabits();

function renderHeatmap() {
  const heatmap = document.getElementById("heatmap");
  heatmap.innerHTML = "";

  const today = new Date();

  // get last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const dateStr = date.toISOString().split("T")[0];

    const div = document.createElement("div");
    div.classList.add("day");

    // check if ANY habit was completed that day
    const active = habits.some(habit =>
      habit.completedDates.includes(dateStr)
    );

    if (active) {
      div.classList.add("active");
    }

    heatmap.appendChild(div);
  }
}