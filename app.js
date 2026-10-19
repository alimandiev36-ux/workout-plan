const form = document.getElementById('workout-form');
const list = document.getElementById('workout-list');
const filterButtons = document.getElementById('filter-buttons');

let workouts = JSON.parse(localStorage.getItem('my-workouts')) || [];
let currentFilter = 'all'; 

// --- ДОБАВЛЕНИЕ ---
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const exercise = document.getElementById('exercise').value.trim();
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;
    const day = document.getElementById('day').value;

    const newWorkout = { exercise, sets, reps, weight, day };

    workouts.push(newWorkout);
    saveToLocalStorage();
    renderWorkouts();

    form.reset();
    document.getElementById('exercise').focus();
});

// --- СОХРАНЕНИЕ ---
function saveToLocalStorage() {
    localStorage.setItem('my-workouts', JSON.stringify(workouts));
}

// --- ОТРИСОВКА ---
function renderWorkouts() {
    list.innerHTML = '';

    let filteredWorkouts = workouts;
    if (currentFilter !== 'all') {
        filteredWorkouts = workouts.filter(w => w.day === currentFilter);
    }

    if (filteredWorkouts.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = currentFilter === 'all' ? 'Пока нет тренировок. Добавь первую!' : 'В этот день тренировок нет.';
        list.appendChild(li);
        return;
    }

    for (let i = 0; i < filteredWorkouts.length; i++) {
        const workout = filteredWorkouts[i];
        const originalIndex = workouts.indexOf(workout);

        const li = document.createElement('li');
        li.className = 'workout-item';

        let details = `${workout.sets} подх. × ${workout.reps} повт.`;
        if (workout.weight) {
            details += `, ${workout.weight} кг`;
        }

        li.innerHTML = `
            <div class="workout-item-info">
                <span class="workout-item-title">${workout.exercise}</span>
                <span class="workout-item-details">${details}</span>
            </div>
            <div class="workout-item-actions">
                <span class="workout-item-day">${workout.day}</span>
                <button class="btn-delete" data-index="${originalIndex}" title="Удалить">✖</button>
            </div>
        `;

        list.appendChild(li);
    }

    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            deleteWorkout(index);
        });
    });
}

// --- УДАЛЕНИЕ ---
function deleteWorkout(index) {
    workouts.splice(index, 1);
    saveToLocalStorage();
    renderWorkouts();
}

// --- ФИЛЬТРАЦИЯ ---
filterButtons.addEventListener('click', function(event) {
    if (!event.target.classList.contains('filter-btn')) return;

    currentFilter = event.target.getAttribute('data-day');

    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    renderWorkouts();
});

// --- ЗАПУСК ---
renderWorkouts();