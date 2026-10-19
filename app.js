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

        // Получаем текущую дату в формате ГГГГ-ММ-ДД
    const today = new Date().toISOString().split('T')[0];
    
    const newWorkout = { exercise, sets, reps, weight, day, date: today };

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
                <span class="workout-item-day">${workout.day} ${workout.date ? '• ' + workout.date : ''}</span>
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
        updateChartSelect(); // Обновляем список упражнений для графика
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
// ==========================================
// ЛОГИКА ДЛЯ ГРАФИКА
// ==========================================

const chartSelect = document.getElementById('chart-exercise');
let myChart = null; // Здесь будем хранить сам график

// 1. Функция обновления выпадающего списка
function updateChartSelect() {
    // Берем только названия упражнений
    const exercises = workouts.map(w => w.exercise);
    
    // Убираем дубликаты (оставляем уникальные)
    const uniqueExercises = [...new Set(exercises)];

    // Очищаем старый список (оставляем только первую заглушку)
    chartSelect.innerHTML = '<option value="">-- Выберите упражнение --</option>';

    // Добавляем каждое уникальное упражнение в список
    uniqueExercises.forEach(ex => {
        const option = document.createElement('option');
        option.value = ex;
        option.textContent = ex;
        chartSelect.appendChild(option);
    });
}

// 2. Функция отрисовки графика
function drawChart(exerciseName) {
    // Находим холст
    const ctx = document.getElementById('myChart').getContext('2d');

    // Если график уже был нарисован — удаляем его
    if (myChart) {
        myChart.destroy();
    }

    // Если ничего не выбрано — выходим
    if (!exerciseName) return;

    // Фильтруем тренировки: берем только выбранное упражнение и у которых есть вес
    const filtered = workouts.filter(w => w.exercise === exerciseName && w.weight);

    if (filtered.length === 0) {
        // Если нет данных для графика, можно вывести пустую табличку
        return; 
    }

    // Готовим данные для графика: даты по X, вес по Y
    const labels = filtered.map(w => w.date || w.day); // Даты
    const data = filtered.map(w => parseFloat(w.weight)); // Вес (превращаем в число)

    // Рисуем график
    myChart = new Chart(ctx, {
        type: 'line', // Тип графика: линия
        data: {
            labels: labels,
            datasets: [{
                label: 'Рабочий вес (кг)',
                data: data,
                borderColor: '#667eea', // Цвет линии
                backgroundColor: 'rgba(102, 126, 234, 0.1)', // Заливка под линией
                borderWidth: 3,
                tension: 0.3, // Изгиб линии (0 - прямо, 1 - очень гладко)
                fill: true,
                pointBackgroundColor: '#764ba2', // Цвет точек
                pointRadius: 5
            }]
        },
        options: {
            responsive: true, // График подстраивается под экран
            maintainAspectRatio: false, // Не фиксирует пропорции квадрата
            plugins: {
                legend: { display: false } // Скрываем легенду, она тут не нужна
            },
            scales: {
                y: {
                    beginAtZero: false, // Шкала веса начинается не с нуля
                    title: { display: true, text: 'Вес (кг)' }
                }
            }
        }
    });
}

// 3. Слушаем изменения в выпадающем списке
chartSelect.addEventListener('change', function() {
    drawChart(this.value);
});

// 4. Каждый раз, когда мы добавляем/удаляем тренировку, обновляем список упражнений
// Для этого мы немного меняем функцию renderWorkouts (вызовем updateChartSelect внутри нее)