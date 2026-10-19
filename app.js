// 1. Находим элементы на странице
const form = document.getElementById('workout-form');
const list = document.getElementById('workout-list');

// 2. Загружаем сохраненные тренировки
let workouts = JSON.parse(localStorage.getItem('my-workouts')) || [];

// 3. Слушаем отправку формы
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

// 4. Функция сохранения
function saveToLocalStorage() {
    localStorage.setItem('my-workouts', JSON.stringify(workouts));
}

// 5. Функция отрисовки списка (С ИЗМЕНЕНИЯМИ)
function renderWorkouts() {
    list.innerHTML = '';

    if (workouts.length === 0) {
        const li = document.createElement('li');
        li.className = 'empty-state';
        li.textContent = 'Пока нет тренировок. Добавь первую!';
        list.appendChild(li);
        return;
    }

    // Проходимся по каждой тренировке
    for (let i = 0; i < workouts.length; i++) {
        const workout = workouts[i];

        const li = document.createElement('li');
        li.className = 'workout-item';

        let details = `${workout.sets} подх. × ${workout.reps} повт.`;
        if (workout.weight) {
            details += `, ${workout.weight} кг`;
        }

        // ОБНОВЛЕННЫЙ HTML: добавили кнопку удаления с data-index
        li.innerHTML = `
            <div class="workout-item-info">
                <span class="workout-item-title">${workout.exercise}</span>
                <span class="workout-item-details">${details}</span>
            </div>
            <div class="workout-item-actions">
                <span class="workout-item-day">${workout.day}</span>
                <button class="btn-delete" data-index="${i}" title="Удалить">✖</button>
            </div>
        `;

        list.appendChild(li);
    }

    // 6. НОВОЕ: Находим все кнопки удаления и вешаем на них событие
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Получаем индекс тренировки из атрибута data-index
            const index = this.getAttribute('data-index');
            deleteWorkout(index);
        });
    });
}

// 7. Функция удаления
function deleteWorkout(index) {
    // Удаляем 1 элемент из массива, начиная с позиции index
    workouts.splice(index, 1);
    
    // Сохраняем обновленный массив
    saveToLocalStorage();
    
    // Перерисовываем список
    renderWorkouts();
}

// При загрузке страницы
renderWorkouts();