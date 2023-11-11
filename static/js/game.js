document.addEventListener('DOMContentLoaded', function() {
    let currentQuestionId = 0;
    let answeredQuestionsCount = 0;
    loadQuestion(currentQuestionId);

    // Добавление обработчиков событий для новых кнопок
    //document.getElementById('restart-game-button').addEventListener('click', restartGame);
    document.getElementById('go-home-button').addEventListener('click', function() {
        window.location.href = '/'; // Перенаправление на главную страницу
    });

    // Функция для загрузки вопроса
    function loadQuestion(id) {
        fetch(`/get_question/${id}`)
            .then(response => response.json())
            .then(question => {
                if (question.end) {
                    displayEndGame("questionsEnded");
                } else if (question.text) {
                    displayQuestion(question);
                }
            })          
            .catch(error => console.error('Ошибка:', error));
    }

    // Функция для отображения вопроса и его вариантов ответа
    function displayQuestion(question) {
        document.getElementById('question-text').textContent = question.text;
        document.getElementById('question-image').src = question.image; // Обновление картинки
        document.getElementById('option1').textContent = question.options[0].text;
        document.getElementById('option2').textContent = question.options[1].text;

        document.getElementById('option1').onclick = () => handleChoice(question.options[0]);
        document.getElementById('option2').onclick = () => handleChoice(question.options[1]);
    }

    // Обработка выбора пользователя и обновление шкал
    function handleChoice(option) {
        updateScales(option.effects);
        answeredQuestionsCount++; // Увеличиваем счетчик
        currentQuestionId++;
        loadQuestion(currentQuestionId);
    }
    

    function displayEndGame(reason) {
        document.getElementById('question-text').style.display = 'none';
        document.getElementById('question-image').style.display = 'none';
        document.getElementById('option1').style.display = 'none';
        document.getElementById('option2').style.display = 'none';
        let message = "Игра завершена! ";
        message += reason === "resourcesDepleted" ? "Один из ваших ресурсов исчерпан." : "Вы ответили на все вопросы.";
        message += ` Вы ответили на ${answeredQuestionsCount} вопросов.`;
    
        let endGameContainer = document.getElementById('end-game-container');
        endGameContainer.innerHTML = `<p>${message}</p><button id="restart-button">Сыграть ещё раз</button>`;
        endGameContainer.style.display = 'block';
        document.getElementById('restart-button').addEventListener('click', restartGame);
        
        let finalImageSrc = "/static/images/final.jpg"; // Замените на ваш путь к картинке
        document.getElementById('final-image').src = finalImageSrc;
        document.getElementById('final-image').style.display = 'block';

        

        // Добавляем обработчик событий на кнопку перезапуска
        document.getElementById('restart-button').addEventListener('click', restartGame);
    }

    
    
    function restartGame() {
        window.location.reload();
    }
    
    function showProgressChange(elementId, change) {
        let container = document.getElementById(elementId);
        
        // Устанавливаем атрибут 'data-change'
        container.setAttribute('data-change', (change >= 0 ? "+" : "") + change);
    
        // Динамически добавляем стиль для цвета текста в зависимости от знака изменения
        let changeStyle = change >= 0 ? 'green' : 'red';
        container.style.setProperty('--change-color', changeStyle);
    
        // Добавляем класс для начала анимации
        container.classList.add('show-change');
        
        // Удаляем класс после окончания анимации
        setTimeout(() => {
            container.classList.remove('show-change');
            container.style.removeProperty('--change-color'); // Удаляем индивидуальный стиль
        }, 2500); // Сколько времени длится анимация
    }
    


    // Функция для обновления шкал состояния
    function updateScales(effects) {
        let reputationBar = document.getElementById('reputation');
        reputationBar.style.color = 'red'; // Цвет шкалы
        let resourcesBar = document.getElementById('resources');
        let satisfactionBar = document.getElementById('satisfaction');
        
        // Обновляем значения шкал
        reputationBar.value = Math.max(0, Math.min(100, reputationBar.value + effects.reputation));
        resourcesBar.value = Math.max(0, Math.min(100, resourcesBar.value + effects.resources));
        satisfactionBar.value = Math.max(0, Math.min(100, satisfactionBar.value + effects.satisfaction));
    
        // Отложенное отображение изменений
        setTimeout(() => {
            showProgressChange('reputation-container', effects.reputation);
            showProgressChange('resources-container', effects.resources);
            showProgressChange('satisfaction-container', effects.satisfaction);
        }, 500); // Задержка для показа изменений после обновления шкал
    
        // Проверка на исчерпание ресурсов
        if (reputationBar.value <= 0 || resourcesBar.value <= 0 || satisfactionBar.value <= 0) {
            console.log("Исчерпание ресурсов. Вызов displayEndGame.");
            displayEndGame("resourcesDepleted");
        }
    }

   

});
