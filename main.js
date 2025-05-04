/**
 * Archivo principal para MathLearn 2.0
 * Maneja la lógica de la aplicación y los eventos de la interfaz de usuario
 */

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si exercises existe en window, si no, intentar crearlo
    if (!window.exercises && typeof exercises !== 'undefined') {
        console.log("Añadiendo exercises al objeto window");
        window.exercises = exercises;
    }
    
    // Verificar que los componentes necesarios están disponibles
    if (!window.exercises || !window.exercises.config) {
        console.error("Error: El módulo 'exercises' no está inicializado correctamente");
        showErrorMessage("No se pudo cargar el módulo de ejercicios. Por favor, recarga la página.");
        return;
    }

    // Función para mostrar un mensaje de error simple
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translateX(-50%)';
        errorDiv.style.backgroundColor = '#ff6565';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '10px';
        errorDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `<h3>Error</h3><p>${message}</p><button id="reload-btn" style="padding:8px 16px;margin-top:10px;background:#fff;color:#ff6565;border:none;border-radius:4px;cursor:pointer;">Recargar página</button>`;
        document.body.appendChild(errorDiv);
        
        document.getElementById('reload-btn').addEventListener('click', () => {
            window.location.reload();
        });
    }

    // Continúa con el resto del código original...

    // Referencias a las pantallas
    const screens = {
        gradeSelection: document.getElementById('grade-selection-screen'),
        operationSelection: document.getElementById('operation-selection-screen'),
        exercise: document.getElementById('exercise-screen'),
        results: document.getElementById('results-screen'),
        progress: document.getElementById('progress-screen')
    };

    // Referencias a elementos importantes
    const elements = {
        gradeCards: document.querySelectorAll('.grade-card'),
        changeGradeBtn: document.getElementById('change-grade-btn'),
        changeOperationBtn: document.getElementById('change-operation-btn'),
        submitAnswerBtn: document.getElementById('submit-answer-btn'),
        answerInput: document.getElementById('answer-input'),
        numericKeyboard: document.getElementById('numeric-keyboard'),
        keyboardKeys: document.querySelectorAll('.keyboard-key'),
        tryAgainBtn: document.getElementById('try-again-btn'),
        selectOperationBtn: document.getElementById('select-operation-btn'),
        homeBtn: document.getElementById('home-btn'),
        progressHomeBtn: document.getElementById('progress-home-btn'),
        viewProgressBtn: document.getElementById('view-progress-btn'),
        resetProgressBtn: document.getElementById('reset-progress-btn'),
        operationGrid: document.querySelector('.operation-grid'),
        problemDisplay: document.getElementById('problem-display'),
        feedback: document.getElementById('feedback'),
        progressBar: document.getElementById('progress-bar'),
        currentExerciseEl: document.getElementById('current-exercise'),
        totalExercisesEl: document.getElementById('total-exercises'),
        correctCountEl: document.getElementById('correct-count'),
        incorrectCountEl: document.getElementById('incorrect-count'),
        finalCorrectEl: document.getElementById('final-correct'),
        finalIncorrectEl: document.getElementById('final-incorrect'),
        percentageEl: document.getElementById('percentage'),
        passingMessageEl: document.getElementById('passing-message'),
        progressChangeGradeBtn: document.getElementById('progress-change-grade-btn'),
        progressGrid: document.querySelector('.progress-grid'),
        progressSummary: document.getElementById('progress-summary')
    };

    // Modales
    const modals = {
        confirm: document.getElementById('confirm-modal'),
        error: document.getElementById('error-modal'),
        help: document.getElementById('help-modal'),
        confirmYes: document.getElementById('confirm-yes'),
        confirmNo: document.getElementById('confirm-no'),
        errorOk: document.getElementById('error-ok'),
        reloadPage: document.getElementById('reload-page'),
        helpOk: document.getElementById('help-ok'),
        confirmMessage: document.getElementById('confirm-message'),
        errorMessage: document.getElementById('error-message'),
        helpContent: document.getElementById('help-content')
    };

    // Variables de estado
    let state = {
        currentScreen: 'gradeSelection',
        selectedGrade: null,
        selectedOperation: null,
        exercises: [],
        currentExerciseIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        timerInterval: null,
        isSubmitting: false  // Añadir esta nueva variable aquí
    };

    // Función para mostrar una pantalla y ocultar las demás
    function showScreen(screenName) {
        // Ocultar todas las pantallas
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Mostrar la pantalla solicitada
        screens[screenName].classList.add('active');
        state.currentScreen = screenName;

        // Acciones específicas según la pantalla
        if (screenName === 'gradeSelection') {
            updateGradeCards();
        }
    }

    // Actualiza las tarjetas de grado, marcando las que están bloqueadas
    function updateGradeCards() {
        elements.gradeCards.forEach(card => {
            const grade = parseInt(card.getAttribute('data-grade'));
            
            // Verificar si el grado está desbloqueado
            if (window.storage && !window.storage.isGradeUnlocked(grade)) {
                card.classList.add('locked');
            } else {
                card.classList.remove('locked');
            }
        });
    }

    // Carga las operaciones para un grado específico
    function loadOperations(grade) {
        const gradeConfig = window.exercises.config[grade];
        if (!gradeConfig) {
            showError("Configuración de grado no disponible");
            return;
        }

        // Actualizar texto del grado seleccionado
        document.getElementById('selected-grade-text').textContent = `${grade}º Grado`;
        
        // Limpiar grid de operaciones
        elements.operationGrid.innerHTML = '';
        
        // Añadir cada operación disponible para este grado
        Object.keys(gradeConfig.operations).forEach(op => {
            const operation = gradeConfig.operations[op];
            
            // Crear tarjeta de operación
            const card = document.createElement('div');
            card.className = 'operation-card';
            card.setAttribute('data-operation', op);
            
            // Verificar si está desbloqueada/completada
            if (window.storage) {
                if (!window.storage.isOperationUnlocked(grade, op)) {
                    card.classList.add('locked');
                }
                
                if (window.storage.isOperationCompleted(grade, op)) {
                    card.classList.add('completed');
                }
            }
            
            // Determinar estrellas
            let stars = 0;
            if (window.storage) {
                stars = window.storage.getOperationStars(grade, op);
            }
            
            // Obtener precisión
            let precision = { percent: 0, text: "0/0 intentos (0%)" };
            if (window.storage) {
                precision = window.storage.getOperationPrecision(grade, op);
            }
            
            // Añadir contenido HTML a la tarjeta
            card.innerHTML = `
                <i class="fas ${operation.icon}"></i>
                <h3 class="operation-name">${operation.name}</h3>
                <div class="stars-indicator">
                    ${getStarsHTML(stars)}
                </div>
                <div class="precision-indicator">
                    ${precision.text}
                </div>
            `;
            
            // Añadir evento de clic (si no está bloqueada)
            if (!card.classList.contains('locked')) {
                card.addEventListener('click', () => {
                    selectOperation(grade, op);
                });
            }
            
            // Añadir al grid
            elements.operationGrid.appendChild(card);
        });
    }

    // Retorna HTML para las estrellas
    function getStarsHTML(count) {
        let html = '';
        for (let i = 0; i < 3; i++) {
            if (i < count) {
                html += '<i class="fas fa-star"></i>';
            } else {
                html += '<i class="far fa-star"></i>';
            }
        }
        return html;
    }

    // Selecciona una operación e inicia los ejercicios
    function selectOperation(grade, operation) {
        state.selectedGrade = grade;
        state.selectedOperation = operation;
        
        // Obtener nombre y color de la operación
        const opConfig = window.exercises.config[grade].operations[operation];
        document.getElementById('selected-operation-text').textContent = opConfig.name;
        document.getElementById('operation-icon').className = `fas ${opConfig.icon}`;
        
        // Generar ejercicios
        state.exercises = window.exercises.generateExercises(grade, operation);
        
        if (state.exercises.length === 0) {
            showError("No se pudieron generar ejercicios para esta operación");
            return;
        }
        
        // Reiniciar contadores y estado
        state.currentExerciseIndex = 0;
        state.correctCount = 0;
        state.incorrectCount = 0;
        
        // Actualizar contadores en la UI
        elements.correctCountEl.textContent = state.correctCount;
        elements.incorrectCountEl.textContent = state.incorrectCount;
        
        // Actualizar total de ejercicios
        elements.totalExercisesEl.textContent = state.exercises.length;
        
        // Cargar primer ejercicio
        loadExercise(0);
        
        // Hacer que la mascota reaccione
        if (window.mascot) {
            if (window.exercises.config[grade].mascotPhrases) {
                window.mascot.react('start', { 
                    gradeMessages: window.exercises.config[grade].mascotPhrases 
                });
            } else {
                window.mascot.react('start');
            }
        }
        
        // Mostrar pantalla de ejercicios
        showScreen('exercise');
        
        // Enfocar el campo de respuesta
        elements.answerInput.value = '';
        elements.answerInput.focus();
        
        // Reproducir sonido
        if (window.sounds) {
            window.sounds.playClick();
        }
    }

    // Referencias al temporizador
    const timer = {
        container: document.getElementById('timer'),
        display: document.getElementById('time-display')
    };

    // Inicia el temporizador para un ejercicio
    function startTimer() {
        // Primero limpiar cualquier temporizador existente
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
        
        // Verificar si el temporizador debe mostrarse
        const config = window.storage ? window.storage.getConfig() : null;
        const showTimer = config ? config.showTimer : false;
        
        if (!showTimer) {
            // Ocultar el temporizador si está desactivado
            if (timer.container) timer.container.style.display = 'none';
            return;
        }
        
        // Mostrar el temporizador
        if (timer.container) timer.container.style.display = 'flex';
        
        // Obtener duración del temporizador de la configuración
        const duration = config ? config.timerDuration : 30;
        let timeLeft = duration;
        
        // Actualizar visualización inicial
        updateTimerDisplay(timeLeft);
        
        // Iniciar intervalo para actualizar el temporizador cada segundo
        state.timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay(timeLeft);
            
            // Cuando el tiempo se acaba
            if (timeLeft <= 0) {
                clearInterval(state.timerInterval);
                state.timerInterval = null;
                
                // Si no se ha enviado una respuesta, contar como incorrecta y pasar al siguiente
                if (!state.isSubmitting) {
                    // Mostrar mensaje de tiempo agotado
                    elements.feedback.className = 'feedback incorrect';
                    elements.feedback.textContent = 'Tiempo agotado. La respuesta correcta es: ' + 
                        state.exercises[state.currentExerciseIndex].correctAnswer;
                    
                    // Incrementar contador de incorrectas
                    state.incorrectCount++;
                    elements.incorrectCountEl.textContent = state.incorrectCount;
                    
                    // Pasar al siguiente ejercicio después de un breve retraso
                    setTimeout(() => {
                        state.currentExerciseIndex++;
                        loadExercise(state.currentExerciseIndex);
                    }, 2000);
                }
            }
        }, 1000);
    }

    // Actualiza la visualización del temporizador
    function updateTimerDisplay(seconds) {
        if (!timer.display) return;
        
        // Mostrar el tiempo restante
        timer.display.textContent = seconds + 's';
        
        // Cambiar color cuando queda poco tiempo
        if (seconds <= 5) {
            timer.container.classList.add('warning');
        } else {
            timer.container.classList.remove('warning');
        }
    }

    // Detiene el temporizador actual
    function stopTimer() {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
    }

    // Carga un ejercicio específico
    function loadExercise(index) {
        if (index >= state.exercises.length) {
            showResults();
            return;
        }
        
        const exercise = state.exercises[index];
        
        // Mostrar el problema
        elements.problemDisplay.textContent = exercise.display;
        
        // Actualizar contador de ejercicios
        elements.currentExerciseEl.textContent = index + 1;
        
        // Actualizar barra de progreso
        const progress = ((index + 1) / state.exercises.length) * 100;
        elements.progressBar.style.width = `${progress}%`;
        
        // Limpiar campo de respuesta y feedback
        elements.answerInput.value = '';
        elements.feedback.className = 'feedback';
        elements.feedback.textContent = '';
        
        // Enfocar el campo de respuesta
        elements.answerInput.focus();
        // Iniciar temporizador
        startTimer();
    }

    // Verifica la respuesta del usuario
    function checkAnswer() {
    // Si ya está en proceso de envío, ignorar
    if (state.isSubmitting) return;
    
    // Detener temporizador
    stopTimer();
    
    // Activar el bloqueo
    state.isSubmitting = true;
    
    const currentExercise = state.exercises[state.currentExerciseIndex];
    const userAnswer = elements.answerInput.value.trim();
    
    if (userAnswer === '') {
        // Mostrar feedback de error por respuesta vacía
        elements.feedback.className = 'feedback incorrect';
        elements.feedback.textContent = 'Por favor, ingresa una respuesta';
        elements.answerInput.focus();
        
        // Desactivar el bloqueo después de un breve período
        setTimeout(() => {
            state.isSubmitting = false;
        }, 500);
        return;
    }
        
        const isCorrect = window.exercises.checkAnswer(currentExercise, userAnswer);
        
        if (isCorrect) {
            // Respuesta correcta
            state.correctCount++;
            elements.correctCountEl.textContent = state.correctCount;
            
            // Mostrar feedback positivo
            elements.feedback.className = 'feedback correct';
            elements.feedback.textContent = '¡Correcto!';
            
            // Hacer que la mascota reaccione
            if (window.mascot) {
                window.mascot.react('correct', { 
                    gradeMessages: window.exercises.config[state.selectedGrade].mascotPhrases 
                });
            }
            
            // Reproducir sonido
            if (window.sounds) {
                window.sounds.playCorrect();
            }
        } else {
            // Respuesta incorrecta
            state.incorrectCount++;
            elements.incorrectCountEl.textContent = state.incorrectCount;
            
            // Mostrar feedback negativo
            elements.feedback.className = 'feedback incorrect';
            elements.feedback.textContent = `Incorrecto. La respuesta correcta es: ${currentExercise.correctAnswer}`;
            
            // Hacer que la mascota reaccione
            if (window.mascot) {
                window.mascot.react('incorrect', { 
                    gradeMessages: window.exercises.config[state.selectedGrade].mascotPhrases 
                });
            }
            
            // Reproducir sonido
            if (window.sounds) {
                window.sounds.playIncorrect();
            }
        }
        
        // Pasar al siguiente ejercicio después de un breve retraso
        setTimeout(() => {
            state.currentExerciseIndex++;
            loadExercise(state.currentExerciseIndex);
            state.isSubmitting = false; // Desactivar el bloqueo
        }, 2000);
    }

    // Muestra los resultados finales
    function showResults() {
        // Calcular porcentaje de aciertos
        const totalExercises = state.exercises.length;
        const percentage = totalExercises > 0 ? 
            Math.round((state.correctCount / totalExercises) * 100) : 0;
        
        // Actualizar UI
        elements.finalCorrectEl.textContent = state.correctCount;
        elements.finalIncorrectEl.textContent = state.incorrectCount;
        elements.percentageEl.textContent = `${percentage}%`;
        
        // Calcular estrellas
        const stars = window.progress.calculateStars(state.correctCount, totalExercises);
        
        // Determinar si pasó o no
        const passed = stars > 0;
        elements.passingMessageEl.className = `passing-message ${passed ? 'pass' : 'fail'}`;
        elements.passingMessageEl.textContent = passed ? 
            '¡Felicidades! Has aprobado este nivel.' : 
            'No has alcanzado el puntaje mínimo. ¡Sigue practicando!';
        
        // Guardar progreso
        if (window.storage && window.progress) {
            const result = window.progress.updateProgress(
                state.selectedGrade, 
                state.selectedOperation,
                state.correctCount,
                totalExercises
            );
            
            // Hacer que la mascota reaccione
            if (window.mascot) {
                window.mascot.react('levelComplete', result);
            }
        }
        
        // Mostrar animaciones
        if (window.animations) {
            window.animations.animateResults(
                state.correctCount,
                state.incorrectCount,
                percentage,
                stars
            );
        }
        
        // Reproducir sonido
        if (window.sounds) {
            window.sounds.playComplete();
        }
        
        // Mostrar pantalla de resultados
        showScreen('results');
    }

    // Muestra un mensaje de error
    function showError(message) {
        modals.errorMessage.textContent = message;
        modals.error.classList.add('active');
    }

    // Carga la pantalla de progreso
    function loadProgressScreen(grade) {
        document.getElementById('progress-grade-text').textContent = `${grade}º Grado`;
        
        // Cargar datos de progreso
        const gradeOperations = window.progress.getGradeOperations(grade);
        const gradeConfig = window.exercises.config[grade];
        
        // Limpiar grid de progreso
        elements.progressGrid.innerHTML = '';
        
        // Verificar si hay datos disponibles
        if (!gradeOperations || !gradeConfig) {
            elements.progressGrid.innerHTML = '<p>No hay datos de progreso disponibles.</p>';
            return;
        }
        
        // Añadir cada operación al grid de progreso
        Object.keys(gradeConfig.operations).forEach(op => {
            const operation = gradeConfig.operations[op];
            const progress = gradeOperations[op] || { 
                unlocked: false, 
                completed: false, 
                stars: 0 
            };
            
            // Crear tarjeta de progreso
            const card = document.createElement('div');
            card.className = 'progress-operation';
            
            if (progress.completed) {
                card.classList.add('completed');
            }
            
            if (!progress.unlocked) {
                card.classList.add('locked');
            }
            
            // Obtener precisión
            let precision = { percent: 0, text: "0/0 intentos (0%)" };
            if (window.storage) {
                precision = window.storage.getOperationPrecision(grade, op);
            }
            
            // Añadir contenido HTML a la tarjeta
            card.innerHTML = `
                <div class="progress-header">
                    <div class="progress-name">
                        <i class="fas ${operation.icon}"></i>
                        ${operation.name}
                    </div>
                    <div class="progress-stars">
                        ${getStarsHTML(progress.stars)}
                    </div>
                </div>
                <div class="progress-precision-container">
                    <div class="progress-precision">
                        ${precision.text}
                    </div>
                </div>
            `;
            
            // Añadir al grid
            elements.progressGrid.appendChild(card);
        });
        
        // Mostrar resumen general
        const summary = window.progress.getSummary();
        const strengths = window.progress.analyzeStrengthsAndWeaknesses();
        
        elements.progressSummary.innerHTML = `
            <h3>Resumen General</h3>
            <p>Operaciones completadas: ${summary.completedOperations}/${summary.totalOperations} (${summary.completionPercentage}%)</p>
            <p>Estrellas obtenidas: ${summary.totalStars}/${summary.maxStars} (${summary.starPercentage}%)</p>
            
            <h4>Fortalezas:</h4>
            <ul>
                ${strengths.strengths.map(s => `<li>${s.message}</li>`).join('')}
            </ul>
            
            <h4>Áreas de mejora:</h4>
            <ul>
                ${strengths.weaknesses.map(w => `<li>${w.message}</li>`).join('')}
            </ul>
        `;
        
        // Mostrar pantalla de progreso
        showScreen('progress');
    }

    // -- Eventos de los elementos de la interfaz -- //
    
    // Eventos de grados
    elements.gradeCards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('locked')) {
                const grade = parseInt(card.getAttribute('data-grade'));
                state.selectedGrade = grade;
                loadOperations(grade);
                showScreen('operationSelection');
                if (window.sounds) window.sounds.playClick();
            }
        });
    });
    
    // Botón de cambiar grado
    if (elements.changeGradeBtn) {
        elements.changeGradeBtn.addEventListener('click', () => {
            showScreen('gradeSelection');
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de cambiar operación
    if (elements.changeOperationBtn) {
        elements.changeOperationBtn.addEventListener('click', () => {
            loadOperations(state.selectedGrade);
            showScreen('operationSelection');
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de verificar respuesta
    if (elements.submitAnswerBtn) {
        elements.submitAnswerBtn.addEventListener('click', () => {
            checkAnswer();
        });
    }
    
    // Campo de respuesta (para verificar al presionar Enter)
    if (elements.answerInput) {
        elements.answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
    
    // Teclado numérico
    elements.keyboardKeys.forEach(key => {
        key.addEventListener('click', () => {
            const keyValue = key.getAttribute('data-key');
            
            if (keyValue === 'backspace') {
                // Borrar último carácter
                elements.answerInput.value = elements.answerInput.value.slice(0, -1);
            } else {
                // Agregar dígito
                elements.answerInput.value += keyValue;
            }
            
            // Reproducir sonido
            if (window.sounds) window.sounds.playClick();
            
            // Mantener enfoque en campo de respuesta
            elements.answerInput.focus();
        });
    });
    
    // Botón de intentar de nuevo
    if (elements.tryAgainBtn) {
        elements.tryAgainBtn.addEventListener('click', () => {
            // Reiniciar ejercicios con la misma operación
            selectOperation(state.selectedGrade, state.selectedOperation);
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de seleccionar operación
    if (elements.selectOperationBtn) {
        elements.selectOperationBtn.addEventListener('click', () => {
            loadOperations(state.selectedGrade);
            showScreen('operationSelection');
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de volver al inicio
    if (elements.homeBtn) {
        elements.homeBtn.addEventListener('click', () => {
            showScreen('gradeSelection');
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de volver al inicio desde progreso
    if (elements.progressHomeBtn) {
        elements.progressHomeBtn.addEventListener('click', () => {
            showScreen('gradeSelection');
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de ver progreso
    if (elements.viewProgressBtn) {
        elements.viewProgressBtn.addEventListener('click', () => {
            // Si hay un grado seleccionado, cargar su progreso
            // Si no, cargar el del primer grado
            const grade = state.selectedGrade || 1;
            loadProgressScreen(grade);
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de cambiar grado en progreso
    if (elements.progressChangeGradeBtn) {
        elements.progressChangeGradeBtn.addEventListener('click', () => {
            showScreen('gradeSelection');
            if (window.sounds) window.sounds.playClick();
        });
    }
    
    // Botón de reiniciar progreso
    if (elements.resetProgressBtn) {
        elements.resetProgressBtn.addEventListener('click', () => {
            modals.confirmMessage.textContent = "¿Estás seguro de que deseas reiniciar todo tu progreso? Esta acción no se puede deshacer.";
            modals.confirm.classList.add('active');
            
            // Configurar botones de confirmación
            modals.confirmYes.onclick = () => {
                if (window.storage) {
                    window.storage.resetProgress();
                    modals.confirm.classList.remove('active');
                    showScreen('gradeSelection');
                    if (window.sounds) window.sounds.playClick();
                }
            };
            
            modals.confirmNo.onclick = () => {
                modals.confirm.classList.remove('active');
                if (window.sounds) window.sounds.playClick();
            };
        });
    }
    
    // Botón de pista
    document.querySelectorAll('.hint-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (state.currentScreen === 'exercise' && state.currentExerciseIndex < state.exercises.length) {
                const currentExercise = state.exercises[state.currentExerciseIndex];
                if (window.mascot) {
                    window.mascot.giveHint(currentExercise);
                }
            }
        });
    });
    
    // Botones de modales
    if (modals.errorOk) {
        modals.errorOk.addEventListener('click', () => {
            modals.error.classList.remove('active');
        });
    }
    
    if (modals.reloadPage) {
        modals.reloadPage.addEventListener('click', () => {
            window.location.reload();
        });
    }
    
    if (modals.helpOk) {
        modals.helpOk.addEventListener('click', () => {
            modals.help.classList.remove('active');
        });
    }
    
    // Inicializar la aplicación
    updateGradeCards();
    
    // Manejo global de errores
    window.addEventListener('error', (e) => {
        console.error('Error capturado:', e.error || e.message);
        showError(`Ha ocurrido un error: ${e.message}`);
    });
});