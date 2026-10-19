const form = document.getElementById('workout-form');
const list = document.getElementById('workout-list');
const filterButtons = document.getElementById('filter-buttons');

let workouts = JSON.parse(localStorage.getItem('my-workouts')) || [];
let currentFilter = 'all'; // По умолчанию показываем все

// --- ДОБАВЛЕНИЕ ТРЕНИРОВКИ ---
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const exercise = document.getElementById('exercise').value.trim();
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;
    const day = document.getElementById('day').value;

    const newWorkout = {
        exercise: exercise,
        sets: sets,
        reps: reps,
        weight: weight,
        day: day
    };

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

// --- ОТРИСОВКА СПИСКА ---
function renderWorkouts() {
    list.innerHTML = '';

    // 1. Фильтруем массив: оставляем только те тренировки, которые подходят под фильтр
    let filteredWorkouts = workouts;
    if (currentFilter !== 'all') {
        filteredWorkouts = workouts.filter(w => w.day === currentFilter);
    }

    // 2. Если после фильтрации пусто
    if (filteredWorkouts.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = currentFilter === 'all' ? 'Пока нет тренировок. Добавь первую!' : 'В этот день тренировок нет.';
        list.appendChild(li);
        return;
    }

    // 3. Рисуем карточки
    for (let i = 0; i < filteredWorkouts.length; i++) {
        const workout = filteredWorkouts[i];
        
        // Находим реальный индекс в общем массиве (чтобы удаление работало правильно)
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

    // 4. Вешаем события на кнопки удаления
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

// --- ФИЛЬТРАЦИЯ (НОВОЕ) ---
filterButtons.addEventListener('click', function(event) {
    // Проверяем, что кликнули именно по кнопке с классом filter-btn
    if (!event.target.classList.contains('filter-btn')) return;

    // 1. Меняем активный фильтр
    currentFilter = event.target.getAttribute('data-day');

    // 2. Убираем класс 'active' у всех кнопок
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

    // 3. Добавляем класс 'active' той кнопке, на которую нажали
    event.target.classList.add('active');

    // 4. Перерисовываем список
    renderWorkouts();
});

// --- ЗАПУСК ---
renderWorkouts();