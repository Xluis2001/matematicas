/**
 * Script principal para la aplicación MathLearn
 * Optimizado para rendimiento y estabilidad
 * Actualizado para mostrar métricas de precisión
 */

// Variables globales
let currentScreen = 'grade-selection-screen';
let selectedGrade = 1;
let selectedOperation = '';
let currentExercises = [];
let currentExerciseIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

// Función que se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializar almacenamiento
        storage.initialize();
        
        // Configurar eventos para tarjetas de grado
        setupGradeCards();
        
        // Configurar botones de navegación
        setupNavigationButtons();
        
        // Configurar pantalla de ejercicios
        setupExerciseScreen();
        
        // Configurar pantalla de resultados
        setupResultsScreen();
        
        // Configurar pantalla de progreso
        setupProgressScreen();
        
        // Configurar modal de confirmación
        setupConfirmModal();
    } catch (error) {
        console.error("Error durante la inicialización:", error);
        showErrorModal("Ocurrió un error al iniciar la aplicación. Por favor, recarga la página.");
    }
});

/**
 * Configura los eventos para las tarjetas de grado
 */
function setupGradeCards() {
    const gradeCards = document.querySelectorAll('.grade-card');
    
    gradeCards.forEach(card => {
        card.addEventListener('click', () => {
            try {
                const grade = parseInt(card.dataset.grade);
                
                // Verificar si el grado está desbloqueado
                if (progress.isGradeUnlocked(grade)) {
                    selectedGrade = grade;
                    loadOperations(grade);
                    showScreen('operation-selection-screen');
                } else {
                    showErrorModal("Este grado aún no está disponible. Completa los grados anteriores primero.");
                }
            } catch (error) {
                console.error("Error al seleccionar grado:", error);
                showErrorModal("Ocurrió un error al seleccionar el grado.");
            }
        });
    });
}

/**
 * Actualiza visualmente las tarjetas de grado según su estado
 */
function updateGradeCards() {
    try {
        const gradeCards = document.querySelectorAll('.grade-card');
        
        gradeCards.forEach(card => {
            const grade = parseInt(card.dataset.grade);
            if (progress.isGradeUnlocked(grade)) {
                card.classList.remove('locked');
            } else {
                card.classList.add('locked');
            }
        });
    } catch (error) {
        console.error("Error al actualizar tarjetas de grado:", error);
    }
}

/**
 * Configura los botones de navegación
 */
function setupNavigationButtons() {
    try {
        // Botón para cambiar de grado
        document.getElementById('change-grade-btn').addEventListener('click', () => {
            showScreen('grade-selection-screen');
        });
        
        // Botón para cambiar de operación
        document.getElementById('change-operation-btn').addEventListener('click', () => {
            showScreen('operation-selection-screen');
        });
        
        // Botones de la pantalla de resultados
        document.getElementById('try-again-btn').addEventListener('click', () => {
            startExercise(selectedGrade, selectedOperation);
        });
        
        document.getElementById('select-operation-btn').addEventListener('click', () => {
            // Recargar explícitamente las operaciones para actualizar estrellas y estados
            loadOperations(selectedGrade);
            // Luego mostrar la pantalla
            showScreen('operation-selection-screen');
        });
        
        document.getElementById('home-btn').addEventListener('click', () => {
            showScreen('grade-selection-screen');
        });
        
        // Botones de footer
        document.getElementById('view-progress-btn').addEventListener('click', () => {
            loadProgressScreen(selectedGrade);
            showScreen('progress-screen');
        });
        
        document.getElementById('reset-progress-btn').addEventListener('click', () => {
            showConfirmModal('¿Estás seguro de que deseas reiniciar todo tu progreso?', resetAllProgress);
        });
        
        // Botón de cambio de grado en pantalla de progreso
        document.getElementById('progress-change-grade-btn').addEventListener('click', () => {
            showScreen('grade-selection-screen');
        });
        
        // Botón para volver al inicio desde progreso
        document.getElementById('progress-home-btn').addEventListener('click', () => {
            showScreen('grade-selection-screen');
        });
        
        // Configurar el botón para el modal de error
        document.getElementById('error-ok').addEventListener('click', () => {
            document.getElementById('error-modal').style.display = 'none';
        });
        
        document.getElementById('reload-page').addEventListener('click', () => {
            window.location.reload();
        });
    } catch (error) {
        console.error("Error al configurar botones de navegación:", error);
    }
}

/**
 * Configura la pantalla de ejercicios
 */
function setupExerciseScreen() {
    try {
        const answerInput = document.getElementById('answer-input');
        const submitButton = document.getElementById('submit-answer-btn');
        
        // Manejar el envío de respuesta con el botón
        submitButton.addEventListener('click', () => {
            if (!submitButton.disabled) {
                checkAnswer();
            }
        });
        
        // Permitir enviar con Enter, pero con protección contra pulsaciones rápidas
        let lastEnterTime = 0;
        answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                // Prevenir comportamiento por defecto para tener control total
                e.preventDefault();
                
                // Obtener el tiempo actual
                const currentTime = new Date().getTime();
                
                // Verificar si ya estamos procesando una respuesta o si han pasado menos de 300ms desde la última pulsación
                if (isProcessingAnswer || (currentTime - lastEnterTime < 300)) {
                    return;
                }
                
                // Actualizar el tiempo de la última pulsación
                lastEnterTime = currentTime;
                
                // Si el botón y el input no están deshabilitados, procesar la respuesta
                if (!submitButton.disabled && !answerInput.disabled) {
                    checkAnswer();
                }
            }
        });
    } catch (error) {
        console.error("Error al configurar pantalla de ejercicios:", error);
    }
}

/**
 * Configura la pantalla de resultados
 */
function setupResultsScreen() {
    // No se necesita configuración adicional aquí
}

/**
 * Configura la pantalla de progreso
 */
function setupProgressScreen() {
    // La carga de datos se hace en loadProgressScreen
}

/**
 * Configura el modal de confirmación
 */
function setupConfirmModal() {
    try {
        const modal = document.getElementById('confirm-modal');
        const confirmYesBtn = document.getElementById('confirm-yes');
        const confirmNoBtn = document.getElementById('confirm-no');
        
        // Cerrar modal al hacer clic en No
        confirmNoBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Cerrar modal al hacer clic fuera del contenido
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    } catch (error) {
        console.error("Error al configurar modal:", error);
    }
}

/**
 * Muestra el modal de confirmación
 * @param {string} message - Mensaje a mostrar
 * @param {Function} onConfirm - Función a ejecutar si se confirma
 */
function showConfirmModal(message, onConfirm) {
    try {
        const modal = document.getElementById('confirm-modal');
        const confirmMessage = document.getElementById('confirm-message');
        const confirmYesBtn = document.getElementById('confirm-yes');
        
        confirmMessage.textContent = message;
        
        // Configurar evento de confirmación
        confirmYesBtn.onclick = () => {
            if (onConfirm) onConfirm();
            modal.style.display = 'none';
        };
        
        // Mostrar modal
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error al mostrar modal:", error);
    }
}

/**
 * Muestra el modal de error
 * @param {string} message - Mensaje de error a mostrar
 */
function showErrorModal(message) {
    try {
        const modal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        modal.style.display = 'block';
    } catch (error) {
        console.error("Error al mostrar modal de error:", error);
        alert(message); // Fallback si no se puede mostrar el modal
    }
}

/**
 * Cambia entre pantallas
 * @param {string} screenId - ID de la pantalla a mostrar
 */
function showScreen(screenId) {
    try {
        // Ocultar pantalla actual
        document.getElementById(currentScreen).classList.remove('active');
        
        // Mostrar nueva pantalla
        document.getElementById(screenId).classList.add('active');
        
        // Actualizar variable
        currentScreen = screenId;
        
        // Acciones específicas según la pantalla
        if (screenId === 'grade-selection-screen') {
            updateGradeCards();
        } else if (screenId === 'operation-selection-screen') {
            // Actualizar texto del grado seleccionado
            updateSelectedGradeText();
        }
    } catch (error) {
        console.error("Error al cambiar de pantalla:", error);
        showErrorModal("Ocurrió un error al cambiar de pantalla. Por favor, recarga la página.");
    }
}

/**
 * Actualiza el texto del grado seleccionado
 */
function updateSelectedGradeText() {
    try {
        const suffix = getSuffix(selectedGrade);
        document.getElementById('selected-grade-text').textContent = `${selectedGrade}${suffix} Grado`;
        
        // También actualizar en la pantalla de progreso
        document.getElementById('progress-grade-text').textContent = `${selectedGrade}${suffix} Grado`;
    } catch (error) {
        console.error("Error al actualizar texto de grado:", error);
    }
}

/**
 * Obtiene el sufijo para el número de grado
 * @param {number} grade - Número de grado
 * @returns {string} Sufijo (er, do, etc.)
 */
function getSuffix(grade) {
    switch(grade) {
        case 1: return 'er';
        case 2: return 'do';
        case 3: return 'er';
        default: return 'to';
    }
}

/**
 * Carga las operaciones disponibles para un grado
 * Versión optimizada para evitar bloqueos
 * @param {number} grade - Grado escolar
 */
function loadOperations(grade) {
    try {
        const operationGrid = document.querySelector('.operation-grid');
        operationGrid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Cargando operaciones...</div>';
        
        // Usar setTimeout para dar tiempo al indicador de carga a mostrarse
        setTimeout(() => {
            try {
                // Obtener configuración del grado
                const gradeConfig = exercises.config[grade];
                if (!gradeConfig) {
                    operationGrid.innerHTML = '<div style="text-align:center;color:red;padding:20px;">No se encontró configuración para este grado.</div>';
                    return;
                }
                
                // Obtener progreso del grado
                const operationsProgress = progress.getGradeOperations(grade);
                if (!operationsProgress) {
                    operationGrid.innerHTML = '<div style="text-align:center;color:red;padding:20px;">No se pudo cargar el progreso para este grado.</div>';
                    return;
                }
                
                // Limpiar el grid
                operationGrid.innerHTML = '';
                
                // Crear tarjetas para cada operación - optimizado para rendimiento
                const fragment = document.createDocumentFragment(); // Usar fragment para mejorar rendimiento
                
                for (const opKey in gradeConfig.operations) {
                    const op = gradeConfig.operations[opKey];
                    // Si la operación no existe en el progreso, inicializarla
                    let opProgress = operationsProgress[opKey];
                    
                    if (!opProgress) {
                        console.warn(`Operación ${opKey} no encontrada en el progreso. Inicializando.`);
                        opProgress = { 
                            unlocked: opKey === 'addition', // Solo "suma" está desbloqueada por defecto
                            completed: false, 
                            stars: 0,
                            correctCount: 0,
                            totalCount: 0,
                            precision: 0
                        };
                    }
                    
                    const card = document.createElement('div');
                    card.className = 'operation-card';
                    card.dataset.operation = opKey;
                    
                    // Añadir clases según estado
                    if (opProgress.completed) {
                        card.classList.add('completed');
                    }
                    
                    if (!opProgress.unlocked) {
                        card.classList.add('locked');
                    }
                    
                    // Obtener precisión si está disponible
                    let precisionHTML = '';
                    if (opProgress.completed && opProgress.correctCount && opProgress.totalCount) {
                        const precision = progress.calculatePrecision(opProgress.correctCount, opProgress.totalCount);
                        precisionHTML = `<div class="precision-indicator">Precisión: ${precision.text}</div>`;
                    }
                    
                    // Contenido de la tarjeta
                    let statusText = '';
                    if (!opProgress.unlocked) {
                        statusText = '<div class="status-text locked">Bloqueado</div>';
                    } else if (opProgress.completed) {
                        statusText = '<div class="status-text completed">Completado</div>';
                    } else {
                        statusText = '<div class="status-text available">Disponible</div>';
                    }
                    
                    card.innerHTML = `
                        <i class="fas ${op.icon}"></i>
                        <div class="operation-name">${op.name}</div>
                        ${statusText}
                        <div class="stars-indicator">
                            ${getStarsHTML(opProgress.stars)}
                        </div>
                        ${precisionHTML}
                    `;
                    
                    // Evento de clic
                    card.addEventListener('click', () => {
                        if (opProgress.unlocked) {
                            selectedOperation = opKey;
                            startExercise(grade, opKey);
                        } else {
                            showErrorModal('Esta operación aún está bloqueada. Completa las operaciones anteriores primero.');
                        }
                    });
                    
                    fragment.appendChild(card);
                }
                
                operationGrid.appendChild(fragment);
            } catch (error) {
                console.error("Error en procesamiento de operaciones:", error);
                operationGrid.innerHTML = '<div style="text-align:center;color:red;padding:20px;">Ocurrió un error al cargar las operaciones. Por favor, intenta actualizar la página.</div>';
            }
        }, 100); // Pequeño retraso para que el indicador de carga se muestre
        
    } catch (error) {
        console.error("Error al cargar operaciones:", error);
        // Mostrar mensaje de error en la interfaz
        const operationGrid = document.querySelector('.operation-grid');
        operationGrid.innerHTML = '<div style="text-align:center;color:red;padding:20px;">Ocurrió un error al cargar las operaciones. Por favor, intenta actualizar la página.</div>';
    }
}

/**
 * Genera HTML para mostrar estrellas
 * @param {number} stars - Número de estrellas (0-3)
 * @returns {string} HTML con estrellas
 */
function getStarsHTML(stars) {
    let html = '';
    
    for (let i = 0; i < 3; i++) {
        if (i < stars) {
            html += '<i class="fas fa-star"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    
    return html;
}

/**
 * Inicia un ejercicio
 * @param {number} grade - Grado escolar
 * @param {string} operation - Operación a practicar
 */
function startExercise(grade, operation) {
    try {
        // Generar ejercicios
        currentExercises = exercises.generateExercises(grade, operation);
        
        if (!currentExercises || currentExercises.length === 0) {
            showErrorModal('No se pudieron generar ejercicios. Intenta con otra operación.');
            return;
        }
        
        // Inicializar contadores y variables de control
        currentExerciseIndex = 0;
        correctCount = 0;
        incorrectCount = 0;
        isProcessingAnswer = false; // Reiniciar el flag de procesamiento
        
        // Asegurar que los controles estén habilitados
        document.getElementById('submit-answer-btn').disabled = false;
        document.getElementById('answer-input').disabled = false;
        
        // Actualizar textos
        const opConfig = exercises.config[grade].operations[operation];
        document.getElementById('selected-operation-text').textContent = opConfig.name;
        document.getElementById('current-exercise').textContent = '1';
        document.getElementById('total-exercises').textContent = currentExercises.length;
        document.getElementById('correct-count').textContent = '0';
        document.getElementById('incorrect-count').textContent = '0';
        
        // Limpiar feedback anterior si lo hubiera
        document.getElementById('feedback').className = 'feedback';
        
        // Actualizar barra de progreso
        updateProgressBar();
        
        // Mostrar primer ejercicio
        displayCurrentExercise();
        
        // Cambiar a pantalla de ejercicios
        showScreen('exercise-screen');
    } catch (error) {
        console.error("Error al iniciar ejercicio:", error);
        showErrorModal("Ocurrió un error al iniciar el ejercicio. Por favor, intenta con otra operación.");
    }
}

/**
 * Muestra el ejercicio actual
 */
function displayCurrentExercise() {
    try {
        if (!currentExercises || currentExercises.length === 0 || !currentExercises[currentExerciseIndex]) {
            console.error("Error: No hay ejercicios disponibles para mostrar");
            return;
        }
        
        const exercise = currentExercises[currentExerciseIndex];
        
        // Mostrar el problema
        document.getElementById('problem-display').textContent = exercise.display;
        
        // Limpiar input y feedback
        const answerInput = document.getElementById('answer-input');
        answerInput.value = '';
        answerInput.disabled = false; // Asegurar que el input esté habilitado
        document.getElementById('feedback').className = 'feedback';
        
        // Asegurar que el botón de enviar esté habilitado
        document.getElementById('submit-answer-btn').disabled = false;
        
        // Restablecer el estado de procesamiento
        isProcessingAnswer = false;
        
        // Enfocar en el input
        answerInput.focus();
    } catch (error) {
        console.error("Error al mostrar ejercicio:", error);
    }
}

/**
 * Verifica la respuesta del usuario
 */
let isProcessingAnswer = false; // Variable para controlar si se está procesando una respuesta

function checkAnswer() {
    try {
        // Si ya se está procesando una respuesta, ignorar
        if (isProcessingAnswer) {
            return;
        }
        
        if (!currentExercises || !currentExercises[currentExerciseIndex]) {
            console.error("Error: No hay ejercicio actual para verificar");
            return;
        }
        
        // Marcar que estamos procesando una respuesta
        isProcessingAnswer = true;
        
        // Deshabilitar el botón de enviar y el campo de entrada
        const submitButton = document.getElementById('submit-answer-btn');
        const answerInput = document.getElementById('answer-input');
        submitButton.disabled = true;
        answerInput.disabled = true;
        
        const exercise = currentExercises[currentExerciseIndex];
        const userAnswer = answerInput.value.trim();
        const feedback = document.getElementById('feedback');
        
        if (userAnswer === '') {
            showErrorModal('Por favor, ingresa una respuesta.');
            // Volver a habilitar controles
            submitButton.disabled = false;
            answerInput.disabled = false;
            isProcessingAnswer = false;
            return;
        }
        
        const isCorrect = exercises.checkAnswer(exercise, userAnswer);
        
        // Actualizar contadores
        if (isCorrect) {
            correctCount++;
            document.getElementById('correct-count').textContent = correctCount;
            
            feedback.className = 'feedback correct';
            feedback.innerHTML = '¡Correcto! <i class="fas fa-check-circle"></i>';
        } else {
            incorrectCount++;
            document.getElementById('incorrect-count').textContent = incorrectCount;
            
            feedback.className = 'feedback incorrect';
            feedback.innerHTML = `Incorrecto. La respuesta correcta es: <strong>${exercise.correctAnswer}</strong> <i class="fas fa-times-circle"></i>`;
        }
        
        // Avanzar al siguiente ejercicio después de un breve retraso
        setTimeout(() => {
            currentExerciseIndex++;
            
            // Actualizar número de ejercicio y barra de progreso
            if (currentExerciseIndex < currentExercises.length) {
                document.getElementById('current-exercise').textContent = currentExerciseIndex + 1;
                updateProgressBar();
                displayCurrentExercise();
            } else {
                // Estamos en el último ejercicio, finalizar
                updateProgressBar();
                finishExercise();
            }
            
            // Restaurar el estado para permitir nuevas respuestas
            submitButton.disabled = false;
            answerInput.disabled = false;
            isProcessingAnswer = false;
        }, 1500);
    } catch (error) {
        console.error("Error al verificar respuesta:", error);
        showErrorModal("Ocurrió un error al verificar tu respuesta.");
        
        // Restaurar el estado en caso de error
        document.getElementById('submit-answer-btn').disabled = false;
        document.getElementById('answer-input').disabled = false;
        isProcessingAnswer = false;
    }
}

/**
 * Actualiza la barra de progreso
 */
function updateProgressBar() {
    try {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const totalExercises = currentExercises ? currentExercises.length : 1;
        const percentage = (currentExerciseIndex / totalExercises) * 100;
        progressBar.style.width = `${percentage}%`;
    } catch (error) {
        console.error("Error al actualizar barra de progreso:", error);
    }
}

/**
 * Finaliza el ejercicio y muestra resultados
 */
function finishExercise() {
    try {
        const totalExercises = currentExercises.length;
        
        // Actualizar textos de resultados
        document.getElementById('final-correct').textContent = correctCount;
        document.getElementById('final-incorrect').textContent = incorrectCount;
        
        // Calcular porcentaje
        const percentage = Math.round((correctCount / totalExercises) * 100);
        document.getElementById('percentage').textContent = `${percentage}%`;
        
        // Calcular estrellas y actualizar progreso
        const result = progress.updateProgress(selectedGrade, selectedOperation, correctCount, totalExercises);
        
        // Mostrar estrellas
        updateResultStars(result.stars);
        
        // Mostrar mensaje de aprobación
        const passingMessage = document.getElementById('passing-message');
        
        if (result.passed) {
            passingMessage.textContent = '¡Has aprobado este nivel! Puedes continuar con otra operación.';
            passingMessage.className = 'passing-message pass';
        } else {
            passingMessage.textContent = 'No has aprobado este nivel. Necesitas al menos 80% de aciertos para aprobar.';
            passingMessage.className = 'passing-message fail';
        }
        
        // Añadir información de precisión
        /* if (result.precision) {
            // Crear elemento para mostrar precisión si no existe
            let precisionElement = document.getElementById('precision-display');
            if (!precisionElement) {
                precisionElement = document.createElement('div');
                precisionElement.id = 'precision-display';
                precisionElement.className = 'precision-display';
                // Insertar después del porcentaje
                const parentElement = document.querySelector('.result-item:nth-child(3)');
                if (parentElement) {
                    parentElement.parentNode.insertBefore(precisionElement, parentElement.nextSibling);
                }
            }
            
            // Actualizar contenido
            precisionElement.innerHTML = `
                <h3>Precisión</h3>
                <div class="result-value precision-stat">
                    <i class="fas fa-bullseye"></i> <span>${result.precision.text}</span>
                </div>
            `;
        } */
        
        // Cambiar a pantalla de resultados
        showScreen('results-screen');
    } catch (error) {
        console.error("Error al finalizar ejercicio:", error);
        showErrorModal("Ocurrió un error al finalizar el ejercicio. Tus resultados podrían no haberse guardado correctamente.");
        showScreen('operation-selection-screen');
    }
}

/**
 * Actualiza las estrellas en la pantalla de resultados
 * @param {number} stars - Número de estrellas obtenidas
 */
function updateResultStars(stars) {
    try {
        for (let i = 1; i <= 3; i++) {
            const starElement = document.getElementById(`star-${i}`);
            if (!starElement) continue;
            
            if (i <= stars) {
                starElement.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                starElement.innerHTML = '<i class="far fa-star"></i>';
            }
        }
    } catch (error) {
        console.error("Error al actualizar estrellas:", error);
    }
}


/**
 * Carga la pantalla de progreso
 * Versión mejorada para mostrar precisión cuando se accede desde el botón "Ver Progreso"
 * @param {number} grade - Grado escolar
 */
function loadProgressScreen(grade) {
    try {
        // Actualizar texto del grado
        const suffix = getSuffix(grade);
        document.getElementById('progress-grade-text').textContent = `${grade}${suffix} Grado`;
        
        // Obtener progreso del grado
        const operationsProgress = progress.getGradeOperations(grade);
        const gradeConfig = exercises.config[grade];
        
        if (!operationsProgress || !gradeConfig) {
            console.error("Datos de progreso o configuración no disponibles");
            return;
        }
        
        // Obtener contenedor
        const progressGrid = document.querySelector('.progress-grid');
        progressGrid.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Cargando progreso...</div>';
        
        // Usar setTimeout para dar tiempo al indicador de carga a mostrarse
        setTimeout(() => {
            try {
                // Limpiar el grid
                progressGrid.innerHTML = '';
                
                // Usar DocumentFragment para mejor rendimiento
                const fragment = document.createDocumentFragment();
                
                // Crear elementos para cada operación
                for (const opKey in gradeConfig.operations) {
                    const opConfig = gradeConfig.operations[opKey];
                    // Si la operación no existe en el progreso, mostrar como no desbloqueada
                    const opProgress = operationsProgress[opKey] || {
                        unlocked: false,
                        completed: false,
                        stars: 0,
                        correctCount: 0,
                        totalCount: 0,
                        precision: 0
                    };
                    
                    // Crear elemento
                    const progressOp = document.createElement('div');
                    progressOp.className = 'progress-operation';
                    
                    // Aplicar clase según estado
                    if (!opProgress.unlocked) {
                        progressOp.classList.add('locked');
                    } else if (opProgress.completed) {
                        progressOp.classList.add('completed');
                    }
                    
                    // Información de precisión mejorada (formato similar al proyecto anterior)
                    let precisionHTML = '';
                    if (opProgress.completed && opProgress.correctCount && opProgress.totalCount) {
                        const precision = progress.calculatePrecision(opProgress.correctCount, opProgress.totalCount);
                        precisionHTML = `
                            <div class="progress-precision-container">
                                <div class="progress-precision">
                                    <span class="precision-value">Precisión: ${precision.text}</span>
                                </div>
                            </div>
                        `;
                    }
                    
                    // Estado con estrellas
                    const starsHTML = getStarsHTML(opProgress.stars);
                    
                    // Obtener el nombre amigable de la operación
                    const operationName = opConfig.name;
                    
                    // Icono para la operación
                    const operationIcon = opConfig.icon || 'fa-calculator';
                    
                    // Contenido con formato mejorado
                    progressOp.innerHTML = `
                        <div class="progress-header">
                            <div class="progress-name">
                                <i class="fas ${operationIcon}"></i>
                                ${operationName}
                            </div>
                            <div class="progress-stars">
                                ${starsHTML}
                            </div>
                        </div>
                        ${precisionHTML}
                    `;
                    
                    fragment.appendChild(progressOp);
                }
                
                progressGrid.appendChild(fragment);
            } catch (error) {
                console.error("Error en procesamiento de progreso:", error);
                progressGrid.innerHTML = '<div style="text-align:center;color:red;padding:20px;">Ocurrió un error al cargar el progreso. Por favor, intenta actualizar la página.</div>';
            }
        }, 100);
    } catch (error) {
        console.error("Error al cargar pantalla de progreso:", error);
        
        // Mostrar mensaje de error en la interfaz
        const progressGrid = document.querySelector('.progress-grid');
        if (progressGrid) {
            progressGrid.innerHTML = '<div style="text-align:center;color:red;padding:20px;">Ocurrió un error al cargar el progreso. Por favor, intenta actualizar la página.</div>';
        }
    }
}

/**
 * Reinicia todo el progreso
 */
function resetAllProgress() {
    try {
        storage.resetProgress();
        updateGradeCards();
        showErrorModal('Tu progreso ha sido reiniciado correctamente.');
        showScreen('grade-selection-screen');
    } catch (error) {
        console.error("Error al reiniciar progreso:", error);
        showErrorModal("Ocurrió un error al reiniciar el progreso. Por favor, intenta actualizar la página.");
    }
}