// 1. Находим элементы на странице
const form = document.getElementById('workout-form');
const list = document.getElementById('workout-list');

// 2. Загружаем сохраненные тренировки из памяти браузера
// Если там ничего нет, создаем пустой массив []
let workouts = JSON.parse(localStorage.getItem('my-workouts')) || [];

// 3. Слушаем отправку формы
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Читаем значения
    const exercise = document.getElementById('exercise').value.trim();
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;
    const day = document.getElementById('day').value;

    // Формируем объект тренировки
    const newWorkout = {
        exercise: exercise,
        sets: sets,
        reps: reps,
        weight: weight,
        day: day
    };

    // ДОБАВЛЯЕМ тренировку в наш массив (в конец списка)
    workouts.push(newWorkout);

    // СОХРАНЯЕМ обновленный массив в localStorage
    saveToLocalStorage();

    // Отрисовываем список заново
    renderWorkouts();

    // Очищаем форму
    form.reset();
    document.getElementById('exercise').focus();
});

// 4. Функция сохранения в память
function saveToLocalStorage() {
    // Превращаем массив в текст (JSON) и сохраняем под именем 'my-workouts'
    localStorage.setItem('my-workouts', JSON.stringify(workouts));
}

// 5. Функция отрисовки всего списка
function renderWorkouts() {
    // Очищаем список полностью перед отрисовкой
    list.innerHTML = '';

    // Если тренировок нет, показываем надпись
    if (workouts.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = 'Пока нет тренировок. Добавь первую!';
        list.appendChild(li);
        return; // Выходим из функции, чтобы не рисовать пустоту
    }

    // Если тренировки есть, проходимся по каждой (цикл for)
    for (let i = 0; i < workouts.length; i++) {
        const workout = workouts[i]; // Берем одну тренировку

        // Создаем элемент списка <li>
        const li = document.createElement('li');
        li.className = 'workout-item';

        // Формируем детали
        let details = `${workout.sets} подх. × ${workout.reps} повт.`;
        if (workout.weight) {
            details += `, ${workout.weight} кг`;
        }

        // Заполняем HTML
        li.innerHTML = `
            <div class="workout-item-info">
                <span class="workout-item-title">${workout.exercise}</span>
                <span class="workout-item-details">${details}</span>
            </div>
            <span class="workout-item-day">${workout.day}</span>
        `;

        // Добавляем на страницу
        list.appendChild(li);
    }
}

// 6. При загрузке страницы сразу показываем сохраненные тренировки
renderWorkouts();