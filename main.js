/**
 * Archivo principal para MathLearn 2.0
 * Maneja la lógica de la aplicación y los eventos de la interfaz de usuario
 */

// Variables globales para elementos de la UI
let screens = {};
let elements = {};
let modals = {};
let state = {};
let timer = {};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado en main.js, inicializando aplicación...");
    
    // Inicializar referencias a elementos de la UI
    initUIReferences();
    
    // Inicializar estado de la aplicación
    initializeState();
    
    // Configurar teclado numérico
    setupKeyboard();
    
    // Registrar eventos de la UI
    registerEvents();
    
    // Inicializar la pantalla de selección de grado
    updateGradeCards();
    
    // Configurar manejo de errores
    setupErrorHandling();
    
    console.log("Aplicación inicializada correctamente");
});

/**
 * Inicializa las referencias a elementos de la UI
 */
function initUIReferences() {
    try {
        // Referencias a las pantallas
        screens = {
            gradeSelection: document.getElementById('grade-selection-screen'),
            operationSelection: document.getElementById('operation-selection-screen'),
            exercise: document.getElementById('exercise-screen'),
            results: document.getElementById('results-screen'),
            progress: document.getElementById('progress-screen')
        };
    
        // Referencias a elementos importantes
        elements = {
            gradeCards: document.querySelectorAll('.grade-card'),
            changeGradeBtn: document.getElementById('change-grade-btn'),
            changeOperationBtn: document.getElementById('change-operation-btn'),
            submitAnswerBtn: document.getElementById('submit-answer-btn'),
            answerInput: document.getElementById('answer-input'),
            numericKeyboard: document.getElementById('numeric-keyboard'),
            keyboardKeys: document.querySelectorAll('.keyboard-key'),
            toggleKeyboardBtn: document.getElementById('toggle-keyboard'),
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
        modals = {
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
        
        // Referencias al temporizador
        timer = {
            container: document.getElementById('timer'),
            display: document.getElementById('time-display')
        };
        
        console.log("Referencias a elementos de la UI inicializadas correctamente");
    } catch (error) {
        console.error("Error al inicializar referencias a elementos de la UI:", error);
        showErrorMessage("Error al cargar la interfaz. Por favor, recargue la página.");
    }
}

/**
 * Inicializa el estado de la aplicación
 */
function initializeState() {
    state = {
        currentScreen: 'gradeSelection',
        selectedGrade: null,
        selectedOperation: null,
        exercises: [],
        currentExerciseIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        timerInterval: null,
        isSubmitting: false
    };
}

/**
 * Función para detectar si es un dispositivo móvil
 */
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
}

/**
 * Configurar teclado numérico según el tipo de dispositivo
 */
function setupKeyboard() {
    try {
        // Verificar que los elementos existen antes de manipularlos
        if (elements.toggleKeyboardBtn && elements.numericKeyboard) {
            // En móviles: mostrar botón y colapsar teclado inicialmente
            if (isMobileDevice()) {
                elements.toggleKeyboardBtn.style.display = 'block';
                elements.numericKeyboard.classList.add('collapsed');
            } else {
                // En PC: ocultar botón y mostrar teclado siempre
                elements.toggleKeyboardBtn.style.display = 'none';
                elements.numericKeyboard.classList.remove('collapsed');
            }
        }
        
        // Reconfigura el teclado cuando cambie el tamaño de la ventana
        window.addEventListener('resize', setupKeyboard);
        
        console.log("Teclado numérico configurado correctamente");
    } catch (error) {
        console.error("Error al configurar teclado numérico:", error);
    }
}

/**
 * Registra todos los eventos de la UI
 */
function registerEvents() {
    try {
        // Verificar que los módulos necesarios están disponibles
        if (!window.exercises) {
            console.warn("Módulo 'exercises' no disponible. Se usará cuando esté listo.");
        }
        
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
        
        // Botón para mostrar/ocultar teclado
        if (elements.toggleKeyboardBtn) {
            elements.toggleKeyboardBtn.addEventListener('click', () => {
                elements.numericKeyboard.classList.toggle('collapsed');
                
                // Actualizar texto del botón
                const isCollapsed = elements.numericKeyboard.classList.contains('collapsed');
                elements.toggleKeyboardBtn.innerHTML = isCollapsed ? 
                    '<i class="fas fa-keyboard"></i> Mostrar teclado' : 
                    '<i class="fas fa-keyboard"></i> Ocultar teclado';
                
                // Reproducir sonido
                if (window.sounds) window.sounds.playClick();
            });
        }
        
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
                        updateGradeCards();
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
        
        console.log("Eventos de la UI registrados correctamente");
    } catch (error) {
        console.error("Error al registrar eventos:", error);
    }
}

/**
 * Configura el manejo global de errores
 */
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Error capturado:', e.error || e.message);
        showErrorMessage(`Ha ocurrido un error: ${e.message}`);
    });
}

/**
 * Función para mostrar un mensaje de error simple
 */
function showErrorMessage(message) {
    try {
        if (modals.error && modals.errorMessage) {
            modals.errorMessage.textContent = message;
            modals.error.classList.add('active');
        } else {
            // Fallback si el modal no está disponible
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
    } catch (error) {
        console.error('Error al mostrar mensaje de error:', error);
        alert(`Error: ${message}`);
    }
}

/**
 * Muestra una pantalla y oculta las demás
 * Versión mejorada que gestiona correctamente los estados de la mascota
 */
function showScreen(screenName) {
    try {
        console.log(`Cambiando a pantalla: ${screenName} desde ${state.currentScreen}`);
        
        // Acciones específicas para cuando se abandona cada pantalla
        if (state.currentScreen === 'exercise') {
            // Si estamos saliendo de la pantalla de ejercicios, detener el temporizador
            stopTimer();
            
            // Limpiar completamente la mascota
            if (window.mascot && typeof window.mascot.cleanup === 'function') {
                window.mascot.cleanup();
            }
            
            // Limpiar cualquier estado relacionado con el ejercicio actual
            if (state.currentExerciseIndex < state.exercises.length) {
                console.log(`Abandonando ejercicio ${state.currentExerciseIndex + 1}/${state.exercises.length}`);
            }
            
            // Limpiar feedback
            if (elements.feedback) {
                elements.feedback.className = 'feedback';
                elements.feedback.textContent = '';
            }
        }
        
        // Ocultar todas las pantallas
        Object.values(screens).forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
    
        // Mostrar la pantalla solicitada
        if (screens[screenName]) {
            screens[screenName].classList.add('active');
            state.currentScreen = screenName;
        
            // Acciones específicas según la pantalla que se muestra
            if (screenName === 'gradeSelection') {
                updateGradeCards();
            } else if (screenName === 'exercise') {
                // Si volvemos a la pantalla de ejercicios, reiniciar el temporizador
                startTimer();
            }
            
            console.log(`Pantalla '${screenName}' mostrada correctamente`);
        } else {
            console.error(`Pantalla '${screenName}' no encontrada`);
        }
    } catch (error) {
        console.error(`Error al mostrar pantalla '${screenName}':`, error);
    }
}

/**
 * Actualiza las tarjetas de grado, marcando las que están bloqueadas
 */
function updateGradeCards() {
    try {
        // Verificar que los módulos necesarios están disponibles
        if (!window.storage) {
            console.warn("Módulo 'storage' no disponible. Se usará cuando esté listo.");
            setTimeout(updateGradeCards, 500);
            return;
        }
        
        if (!elements.gradeCards || !elements.gradeCards.length) {
            console.warn("No se encontraron elementos de tarjetas de grado");
            return;
        }
        
        elements.gradeCards.forEach(card => {
            const grade = parseInt(card.getAttribute('data-grade'));
            
            // Verificar si el grado está desbloqueado
            if (window.storage && !window.storage.isGradeUnlocked(grade)) {
                card.classList.add('locked');
            } else {
                card.classList.remove('locked');
            }
        });
        
        console.log("Tarjetas de grado actualizadas correctamente");
    } catch (error) {
        console.error("Error al actualizar tarjetas de grado:", error);
    }
}

/**
 * Carga las operaciones para un grado específico
 */
function loadOperations(grade) {
    try {
        // Verificar que los módulos necesarios están disponibles
        if (!window.exercises) {
            console.warn("Módulo 'exercises' no disponible. Intentando de nuevo en 500ms...");
            setTimeout(() => loadOperations(grade), 500);
            return;
        }
        
        if (!window.storage) {
            console.warn("Módulo 'storage' no disponible. Intentando de nuevo en 500ms...");
            setTimeout(() => loadOperations(grade), 500);
            return;
        }
        
        console.log(`Cargando operaciones para grado ${grade}...`);
        
        const gradeConfig = window.exercises.config[grade];
        if (!gradeConfig) {
            showErrorMessage("Configuración de grado no disponible");
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
        
        console.log(`Operaciones para grado ${grade} cargadas correctamente`);
    } catch (error) {
        console.error(`Error al cargar operaciones para grado ${grade}:`, error);
        showErrorMessage("Error al cargar operaciones. Por favor, recargue la página.");
    }
}

/**
 * Retorna HTML para las estrellas
 */
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

/**
 * Selecciona una operación e inicia los ejercicios
 */
function selectOperation(grade, operation) {
    try {
        // Limpiar cualquier temporizador existente
        stopTimer();
        
        // Verificar que los módulos necesarios están disponibles
        if (!window.exercises) {
            console.warn("Módulo 'exercises' no disponible. Intentando de nuevo en 500ms...");
            setTimeout(() => selectOperation(grade, operation), 500);
            return;
        }
        
        console.log(`Seleccionando operación '${operation}' para grado ${grade}...`);
        
        state.selectedGrade = grade;
        state.selectedOperation = operation;
        
        // Obtener nombre y color de la operación
        const opConfig = window.exercises.config[grade].operations[operation];
        document.getElementById('selected-operation-text').textContent = opConfig.name;
        document.getElementById('operation-icon').className = `fas ${opConfig.icon}`;
        
        // Generar ejercicios
        state.exercises = window.exercises.generateExercises(grade, operation);
        
        if (!state.exercises || state.exercises.length === 0) {
            showErrorMessage("No se pudieron generar ejercicios para esta operación");
            return;
        }
        
        // Reiniciar contadores y estado completamente
        state.currentExerciseIndex = 0;
        state.correctCount = 0;
        state.incorrectCount = 0;
        state.isSubmitting = false;
        
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
        
        console.log(`Operación '${operation}' para grado ${grade} seleccionada correctamente`);
    } catch (error) {
        console.error(`Error al seleccionar operación '${operation}' para grado ${grade}:`, error);
        showErrorMessage("Error al cargar ejercicios. Por favor, inténtelo de nuevo.");
    }
}

/**
 * Inicia el temporizador para un ejercicio
 */
function startTimer() {
    try {
        // Primero limpiar cualquier temporizador existente
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
        
        // Verificar que los módulos necesarios están disponibles
        if (!window.storage) {
            console.warn("Módulo 'storage' no disponible. Temporizador desactivado.");
            return;
        }
        
        // Verificar si el temporizador debe mostrarse
        const config = window.storage.getConfig();
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
                    
                    // Pasar al siguiente ejercicio después de un breve retraso
                    setTimeout(() => {
                        state.currentExerciseIndex++;
                        loadExercise(state.currentExerciseIndex);
                    }, 2000);
                }
            }
        }, 1000);
    } catch (error) {
        console.error("Error al iniciar temporizador:", error);
    }
}

/**
 * Actualiza la visualización del temporizador
 */
function updateTimerDisplay(seconds) {
    try {
        if (!timer.display) return;
        
        // Mostrar el tiempo restante
        timer.display.textContent = seconds + 's';
        
        // Cambiar color cuando queda poco tiempo
        if (seconds <= 5) {
            timer.container.classList.add('warning');
        } else {
            timer.container.classList.remove('warning');
        }
    } catch (error) {
        console.error("Error al actualizar temporizador:", error);
    }
}

/**
 * Detiene el temporizador actual
 */
function stopTimer() {
    try {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
            state.timerInterval = null;
        }
    } catch (error) {
        console.error("Error al detener temporizador:", error);
    }
}

/**
 * Carga un ejercicio específico
 */
function loadExercise(index) {
    try {
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
        
        // Poner a la mascota en modo pensativo PERSISTENTE mientras espera respuesta
        if (window.mascot) {
            window.mascot.setState('thinking', true); // forcePersist = true
        }
        
        // Enfocar el campo de respuesta
        elements.answerInput.focus();
        
        // Iniciar temporizador
        startTimer();
        
        console.log(`Ejercicio ${index + 1}/${state.exercises.length} cargado correctamente`);
    } catch (error) {
        console.error(`Error al cargar ejercicio ${index}:`, error);
    }
}

/**
 * Verifica la respuesta del usuario
 */
function checkAnswer() {
    try {
        // Verificar que los módulos necesarios están disponibles
        if (!window.exercises) {
            console.warn("Módulo 'exercises' no disponible. Intentando de nuevo en 500ms...");
            setTimeout(checkAnswer, 500);
            return;
        }
        
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
                startTimer(); // Reiniciar el temporizador
                
                // Mantener a la mascota en modo pensativo
                if (window.mascot) {
                    window.mascot.setState('thinking');
                }
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
            
            // Hacer que la mascota reaccione - añadir forcePersist para sobreescribir estado persistente
            if (window.mascot) {
                // Primero desactivar estado persistente
                window.mascot.persistState = false;
                window.mascot.react('correct', { 
                    gradeMessages: window.exercises.config[state.selectedGrade].mascotPhrases 
                });
            }
            
            // Animar elemento con pulse si está disponible animations
            if (window.animations && typeof window.animations.pulseElement === 'function') {
                window.animations.pulseElement('problem-display');
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
            
            // Hacer que la mascota reaccione - añadir forcePersist para sobreescribir estado persistente 
            if (window.mascot) {
                // Primero desactivar estado persistente
                window.mascot.persistState = false;
                window.mascot.react('incorrect', { 
                    gradeMessages: window.exercises.config[state.selectedGrade].mascotPhrases 
                });
            }
            
            // Animar elemento con shake si está disponible animations
            if (window.animations && typeof window.animations.shakeElement === 'function') {
                window.animations.shakeElement('problem-display');
            }
            
            // Reproducir sonido
            if (window.sounds) {
                window.sounds.playIncorrect();
            }
        }
        
        // Ocultar la burbuja de diálogo después de un breve tiempo
        setTimeout(() => {
            // Forzar el ocultamiento de la burbuja antes de pasar al siguiente ejercicio
            if (window.mascot) {
                window.mascot.hideSpeech();
            }
            
            // Pequeña pausa adicional antes de cargar el siguiente
            setTimeout(() => {
                state.currentExerciseIndex++;
                loadExercise(state.currentExerciseIndex);
                state.isSubmitting = false; // Desactivar el bloqueo
            }, 300);
        }, 1700); // Reducido de 2000 a 1700 ms para la primera parte
    } catch (error) {
        console.error("Error al verificar respuesta:", error);
        state.isSubmitting = false; // Desactivar el bloqueo en caso de error
    }
}

/**
 * Muestra los resultados finales
 */
function showResults() {
    try {
        // Verificar que los módulos necesarios están disponibles
        if (!window.progress) {
            console.warn("Módulo 'progress' no disponible. Intentando de nuevo en 500ms...");
            setTimeout(showResults, 500);
            return;
        }
        
        console.log("Mostrando resultados finales...");
        
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
        if (window.progress) {
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
        
        console.log("Resultados mostrados correctamente");
    } catch (error) {
        console.error("Error al mostrar resultados:", error);
        showErrorMessage("Error al mostrar resultados. Los datos se han guardado correctamente.");
    }
}

/**
 * Carga la pantalla de progreso
 */
function loadProgressScreen(grade) {
    try {
        // Verificar que los módulos necesarios están disponibles
        if (!window.progress || !window.storage) {
            console.warn("Módulos necesarios no disponibles. Intentando de nuevo en 500ms...");
            setTimeout(() => loadProgressScreen(grade), 500);
            return;
        }
        
        console.log(`Cargando pantalla de progreso para grado ${grade}...`);
        
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
            const progressData = gradeOperations[op] || { 
                unlocked: false, 
                completed: false, 
                stars: 0 
            };
            
            // Crear tarjeta de progreso
            const card = document.createElement('div');
            card.className = 'progress-operation';
            
            if (progressData.completed) {
                card.classList.add('completed');
            }
            
            if (!progressData.unlocked) {
                card.classList.add('locked');
            }
            
            // Obtener precisión
            let precision = { percent: 0, text: "0/0 intentos (0%)" };
            precision = window.storage.getOperationPrecision(grade, op);
            
            // Añadir contenido HTML a la tarjeta
            card.innerHTML = `
                <div class="progress-header">
                    <div class="progress-name">
                        <i class="fas ${operation.icon}"></i>
                        ${operation.name}
                    </div>
                    <div class="progress-stars">
                        ${getStarsHTML(progressData.stars)}
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
        
        console.log(`Pantalla de progreso para grado ${grade} cargada correctamente`);
    } catch (error) {
        console.error(`Error al cargar pantalla de progreso para grado ${grade}:`, error);
        showErrorMessage("Error al cargar progreso. Por favor, inténtelo de nuevo.");
    }
}