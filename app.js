// 1. Находим элементы на странице по их id
const form = document.getElementById('workout-form');
const list = document.getElementById('workout-list');

// 2. Слушаем отправку формы
form.addEventListener('submit', function (event) {
    // Отменяем перезагрузку страницы (по умолчанию формы перезагружают страницу)
    event.preventDefault();

    // 3. Читаем значения из полей
    const exercise = document.getElementById('exercise').value.trim();
    const sets = document.getElementById('sets').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;
    const day = document.getElementById('day').value;

    // 4. Формируем объект тренировки
    const workout = {
        exercise: exercise,
        sets: sets,
        reps: reps,
        weight: weight,
        day: day
    };

    // 5. Добавляем в список, очищаем форму и ставим курсор обратно
    addWorkoutToList(workout);
    form.reset();
    document.getElementById('exercise').focus();
});

// 6. Функция для создания карточки тренировки
function addWorkoutToList(workout) {
    // Убираем надпись "Пока нет тренировок", если она есть
    const empty = list.querySelector('.empty-state');
    if (empty) empty.remove();

    // Создаем новый элемент списка <li>
    const li = document.createElement('li');
    li.className = 'workout-item';

    // Формируем текст с подходами и весом
    let details = `${workout.sets} подх. × ${workout.reps} повт.`;
    if (workout.weight) {
        details += `, ${workout.weight} кг`;
    }

    // Заполняем карточку HTML-кодом
    li.innerHTML = `
        <div class="workout-item-info">
            <span class="workout-item-title">${workout.exercise}</span>
            <span class="workout-item-details">${details}</span>
        </div>
        <span class="workout-item-day">${workout.day}</span>
    `;

    // Добавляем готовую карточку в список
    list.appendChild(li);
}

// 7. Показываем надпись, если тренировок нет
function showEmptyState() {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = 'Пока нет тренировок. Добавь первую!';
    list.appendChild(li);
}

// Вызываем функцию при загрузке страницы
showEmptyState();