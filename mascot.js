/**
 * Módulo para la gestión de la mascota interactiva
 * Versión mejorada para asegurar la visualización correcta de todos los estados
 */

const mascot = {
    // Estado de la mascota
    state: 'happy', // happy, thinking, excited, sad
    speechVisible: false,
    
    // Referencias a elementos
    elements: {
        container: null,
        image: null,
        speech: null,
        text: null
    },
    
    // Timeout para ocultar el mensaje
    speechTimeout: null,
    
    // Mensajes predefinidos por categoría
    messages: {
        welcome: [
            "¡Hola! Soy Mati, tu ayudante matemático.",
            "¡Bienvenido a MathLearn! ¿Listo para practicar?",
            "¡Aprender matemáticas es divertido! ¿Comenzamos?"
        ],
        encouragement: [
            "¡Tú puedes lograrlo!",
            "¡No te rindas, sigue practicando!",
            "¡Con práctica te convertirás en un experto!",
            "El cerebro es como un músculo, ¡ejercítalo con matemáticas!",
            "Cada problema que resuelves te hace más inteligente."
        ],
        tips: [
            "Recuerda leer bien el problema antes de resolverlo.",
            "Si un problema es difícil, intenta dividirlo en partes más pequeñas.",
            "Cuando dudes, usa papel y lápiz para ayudarte.",
            "Puedes usar los dedos para contar en sumas y restas sencillas.",
            "¿Sabías que puedes pedir pistas? ¡Toca el botón de ayuda!"
        ],
        facts: [
            "¿Sabías que el cero fue inventado en la India?",
            "Los egipcios usaban fracciones hace más de 4000 años.",
            "El símbolo de igualdad (=) se inventó en 1557.",
            "Las matemáticas son el lenguaje universal de la ciencia.",
            "¡Hay infinitos números primos!"
        ]
    },
    
    /**
     * Inicializa la mascota
     */
    initialize: function() {
        try {
            console.log("Inicializando mascota...");
            
            // Obtener referencias a los elementos
            this.elements.container = document.getElementById('mascot');
            this.elements.image = document.getElementById('mascot-img');
            this.elements.speech = document.getElementById('mascot-speech');
            this.elements.text = document.getElementById('mascot-text');
            
            if (!this.elements.container || !this.elements.image || 
                !this.elements.speech || !this.elements.text) {
                console.warn('No se encontraron todos los elementos de la mascota');
                return;
            }
            
            // Establecer estado inicial visible
            this.setState('happy');
            
            // Configurar evento de clic
            this.elements.container.addEventListener('click', () => {
                this.speak(this.getRandomMessage());
            });
            
            // Mostrar mensaje de bienvenida después de un breve retraso
            setTimeout(() => {
                this.speak(this.getRandomMessage('welcome'));
            }, 1500);
            
            // Configurar mensajes aleatorios periódicos
            this.scheduleRandomMessage();
            
            console.log('Mascota inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar mascota:', error);
        }
    },
    
    /**
     * Programa un mensaje aleatorio en un tiempo futuro
     */
    scheduleRandomMessage: function() {
        // Tiempo aleatorio entre 30 y 60 segundos
        const delay = Math.floor(Math.random() * 30000) + 30000;
        
        setTimeout(() => {
            // Solo mostrar mensaje si no hay uno visible y el usuario está inactivo
            if (!this.speechVisible && this.isUserInactive()) {
                const categories = ['tips', 'facts', 'encouragement'];
                const category = categories[Math.floor(Math.random() * categories.length)];
                this.speak(this.getRandomMessage(category));
            }
            
            // Programar el siguiente mensaje
            this.scheduleRandomMessage();
        }, delay);
    },
    
    /**
     * Verifica si el usuario está inactivo
     * @returns {boolean} true si el usuario está inactivo
     */
    isUserInactive: function() {
        // Aquí podría implementarse un sistema más sofisticado de detección de inactividad
        // Por ahora, simplemente devolvemos true para permitir mensajes aleatorios
        return true;
    },
    
    /**
     * Obtiene un mensaje aleatorio de una categoría
     * @param {string} category - Categoría de mensaje (opcional)
     * @returns {string} Mensaje aleatorio
     */
    getRandomMessage: function(category) {
        try {
            if (!category) {
                // Seleccionar una categoría aleatoria si no se especifica
                const categories = Object.keys(this.messages);
                category = categories[Math.floor(Math.random() * categories.length)];
            }
            
            if (!this.messages[category] || this.messages[category].length === 0) {
                return "¡Hola! ¿En qué puedo ayudarte?";
            }
            
            // Obtener mensaje aleatorio de la categoría
            const messages = this.messages[category];
            return messages[Math.floor(Math.random() * messages.length)];
        } catch (error) {
            console.error('Error al obtener mensaje aleatorio:', error);
            return "¡Hola! ¿En qué puedo ayudarte?";
        }
    },
    
    /**
     * Hace que la mascota diga un mensaje
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en milisegundos (opcional, 0 para permanente)
     */
    speak: function(message, duration = 5000) {
        try {
            // Si la mascota no es visible, no mostrar burbuja
            if (this.elements.container.style.display === 'none' || 
                this.elements.container.style.visibility === 'hidden' ||
                this.elements.container.style.opacity === '0') {
                console.log('Mascota no visible, no se muestra burbuja de diálogo');
                return;
            }
            
            // Limpiar timeout anterior si existe
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
                this.speechTimeout = null;
            }
            
            // Establecer mensaje
            this.elements.text.textContent = message;
            
            // Mostrar burbuja de diálogo
            this.elements.speech.classList.remove('hidden');
            this.elements.speech.style.display = 'block';
            this.speechVisible = true;
            
            // Cambiar a estado "hablando"
            if (!this.persistState) {
                this.setState('excited');
            }
            
            // Configurar ocultamiento automático si se especifica duración
            if (duration > 0) {
                this.speechTimeout = setTimeout(() => {
                    this.hideSpeech();
                }, duration);
            }
        } catch (error) {
            console.error('Error al hacer hablar a la mascota:', error);
        }
    },
    
    /**
     * Limpia todos los elementos visuales de la mascota
     * Útil cuando se cambia de pantalla o se reinicia la aplicación
     */
    cleanup: function() {
        try {
            // Limpiar timeout
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
                this.speechTimeout = null;
            }
            
            // Ocultar burbuja de diálogo
            this.elements.speech.classList.add('hidden');
            this.speechVisible = false;
            
            // Reiniciar estado
            this.persistState = false;
            this.setState('happy');
            
            console.log('Mascota limpiada correctamente');
        } catch (error) {
            console.error('Error al limpiar mascota:', error);
        }
    },

    /**
     * Oculta la burbuja de diálogo
     * Versión mejorada para que se sincronice con la mascota
     */
    hideSpeech: function() {
        try {
            // Si no hay burbuja visible, no hacer nada
            if (!this.speechVisible) return;
            
            this.elements.speech.classList.add('hidden');
            this.speechVisible = false;
            
            console.log('Burbuja de diálogo ocultada');
            
            // Si la mascota desaparece, también debe desaparecer la burbuja
            if (this.elements.container.style.display === 'none' || 
                this.elements.container.style.visibility === 'hidden' ||
                this.elements.container.style.opacity === '0') {
                console.log('Mascota no visible, asegurando que la burbuja también esté oculta');
                this.elements.speech.style.display = 'none';
            }
        } catch (error) {
            console.error('Error al ocultar burbuja de diálogo:', error);
        }
    },
    
    /**
     * Cambia el estado de ánimo de la mascota
     * @param {string} state - Nuevo estado (happy, thinking, excited, sad)
     * @param {boolean} forcePersist - Si se debe persistir el estado incluso si hay otros cambios
     */
    setState: function(state, forcePersist = false) {
        try {
            // Si ya está en ese estado, no hacer nada
            if (this.state === state && !forcePersist) return;
            
            // Validar estado
            const validStates = ['happy', 'thinking', 'excited', 'sad'];
            if (!validStates.includes(state)) {
                console.warn(`Estado inválido: ${state}, usando 'happy' por defecto`);
                state = 'happy';
            }
            
            // Si el estado anterior era "thinking" y forcePersist estaba activado,
            // ignorar cambios a menos que explícitamente se use forcePersist de nuevo
            if (this.state === 'thinking' && this.persistState && !forcePersist) {
                console.log(`Manteniendo estado 'thinking' activo (ignorando cambio a ${state})`);
                return;
            }
            
            this.state = state;
            this.persistState = forcePersist;
            
            // Construir la ruta de la imagen
            const imgPath = `images/mascot-${state}.png`;
            console.log(`Cambiando estado a: ${state}, cargando imagen: ${imgPath}`);
            
            // SOLUCIÓN: Forzar actualización de imagen para evitar problemas de cacheo
            const timestamp = new Date().getTime();
            const forcedImgPath = `${imgPath}?t=${timestamp}`;
            
            // Guardar referencia al elemento imagen
            const imgElement = this.elements.image;
            
            // Configurar manejador de eventos para verificar la carga correcta
            imgElement.onload = () => {
                console.log(`Imagen para estado '${state}' cargada correctamente`);
                // Asegurar que la imagen es visible
                imgElement.style.display = 'block';
                imgElement.style.visibility = 'visible';
                imgElement.style.opacity = '1';
            };
            
            imgElement.onerror = () => {
                console.error(`Error al cargar imagen para estado '${state}': ${forcedImgPath}`);
                // Volver al estado happy si hay error
                if (state !== 'happy') {
                    imgElement.src = `images/mascot-happy.png?t=${timestamp}`;
                }
            };
            
            // Forzar un cambio visible usando técnica de descargar/recargar
            imgElement.style.transition = 'none';
            imgElement.style.opacity = '0.5';
            
            // Usar setTimeout para asegurar que el cambio visual ocurra
            setTimeout(() => {
                // Cambiar la imagen
                imgElement.src = forcedImgPath;
                
                // Animar la transición de vuelta a opacidad completa
                setTimeout(() => {
                    imgElement.style.transition = 'opacity 0.2s ease-in-out';
                    imgElement.style.opacity = '1';
                }, 50);
            }, 20);
            
            console.log(`Estado de la mascota cambiado a: ${state}${forcePersist ? ' (persistente)' : ''}`);
        } catch (error) {
            console.error('Error al cambiar estado de la mascota:', error);
        }
    },
    
    /**
     * Reacciona a un evento específico
     * @param {string} event - Tipo de evento (correct, incorrect, levelComplete, etc.)
     * @param {Object} data - Datos adicionales del evento (opcional)
     */
    react: function(event, data = {}) {
        try {
            let message = '';
            let state = 'happy';
            let duration = 4000;
            let keepState = false; // Nueva variable para mantener el estado
            
            console.log(`Mascota reaccionando al evento: ${event}`);
            
            // Determinar mensaje y estado según el evento
            switch (event) {
                case 'correct':
                    // Usar mensajes predefinidos del grado si están disponibles
                    if (data.gradeMessages && data.gradeMessages.correct && 
                        Array.isArray(data.gradeMessages.correct) && data.gradeMessages.correct.length > 0) {
                        const messages = data.gradeMessages.correct;
                        message = messages[Math.floor(Math.random() * messages.length)];
                    } else {
                        message = "¡Correcto! ¡Muy bien!";
                    }
                    state = 'excited';
                    break;
                    
                case 'incorrect':
                    if (data.gradeMessages && data.gradeMessages.incorrect && 
                        Array.isArray(data.gradeMessages.incorrect) && data.gradeMessages.incorrect.length > 0) {
                        const messages = data.gradeMessages.incorrect;
                        message = messages[Math.floor(Math.random() * messages.length)];
                    } else {
                        message = "¡No te preocupes! Sigue intentando.";
                    }
                    state = 'sad';
                    keepState = true; // Mantener estado triste mientras habla
                    duration = 3000; // Duración más larga para el mensaje
                    break;
                    
                case 'levelComplete':
                    if (data.gradeMessages && data.gradeMessages.complete) {
                        message = data.gradeMessages.complete;
                    } else {
                        message = "¡Felicidades! Has completado el nivel.";
                    }
                    state = 'excited';
                    duration = 6000;
                    break;
                    
                case 'hint':
                    message = data.hint || "Intenta resolver el problema paso a paso.";
                    state = 'thinking';
                    keepState = true; // Mantener estado pensativo mientras da la pista
                    duration = 8000; // Mantener la pista visible más tiempo
                    break;
                    
                case 'start':
                    if (data.gradeMessages && data.gradeMessages.start) {
                        message = data.gradeMessages.start;
                    } else {
                        message = "¡Vamos a practicar! Tú puedes hacerlo.";
                    }
                    state = 'excited';
                    break;
                    
                case 'idle':
                    message = this.getRandomMessage('encouragement');
                    state = 'happy';
                    break;
                    
                case 'thinking':
                    message = "Hmmm, estoy pensando...";
                    state = 'thinking';
                    keepState = true;
                    break;
                    
                default:
                    message = this.getRandomMessage('encouragement');
                    break;
            }
            
            console.log(`Cambiando a estado: ${state} con mensaje: "${message}"`);
            
            // Cambiar estado
            this.setState(state);
            
            // Mostrar mensaje sin cambiar el estado si keepState es true
            if (message) {
                // Modificación a la función speak para mantener el estado actual
                this.speakKeepingState(message, duration, keepState);
            }
        } catch (error) {
            console.error('Error al reaccionar a evento:', error);
        }
    },

    /**
     * Hace que la mascota diga un mensaje manteniendo su estado actual
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en milisegundos
     * @param {boolean} keepState - Si se debe mantener el estado actual
     */
    speakKeepingState: function(message, duration = 5000, keepState = false) {
        try {
            // Limpiar timeout anterior si existe
            if (this.speechTimeout) {
                clearTimeout(this.speechTimeout);
                this.speechTimeout = null;
            }
            
            // Establecer mensaje
            this.elements.text.textContent = message;
            
            // Mostrar burbuja de diálogo
            this.elements.speech.classList.remove('hidden');
            this.speechVisible = true;
            
            // Cambiar a estado "hablando" solo si no se debe mantener el estado actual
            if (!keepState) {
                this.setState('excited');
            }
            
            // Configurar ocultamiento automático si se especifica duración
            if (duration > 0) {
                this.speechTimeout = setTimeout(() => {
                    this.hideSpeech();
                }, duration);
            }
        } catch (error) {
            console.error('Error al hacer hablar a la mascota:', error);
        }
    },
    
    /**
     * Proporciona una pista sobre un ejercicio
     * @param {Object} exercise - Ejercicio actual
     */
    giveHint: function(exercise) {
        try {
            if (!exercise) return;
            
            let hint = "";
            
            // Obtener pista del ejercicio si está disponible
            if (exercise.hint) {
                hint = exercise.hint;
            } else {
                // Pistas genéricas según la operación
                switch (exercise.operator) {
                    case '+':
                        hint = "Intenta sumar primero las unidades, luego las decenas.";
                        break;
                    case '-':
                        hint = "Recuerda que al restar, puedes 'pedir prestado' de la columna de la izquierda.";
                        break;
                    case '×':
                        hint = "Multiplica dígito por dígito y suma los resultados.";
                        break;
                    case '÷':
                        hint = "Piensa en la multiplicación inversa.";
                        break;
                    default:
                        hint = "Analiza el problema paso a paso.";
                }
            }
            
            // Mostrar pista
            this.react('hint', { hint });
            
            // Actualizar área de pistas si está disponible
            const hintArea = document.getElementById('hint-area');
            const hintText = document.getElementById('hint-text');
            
            if (hintArea && hintText) {
                hintText.textContent = hint;
                hintArea.classList.remove('hidden');
                
                // Configurar botón para cerrar pista
                const closeButton = document.getElementById('close-hint');
                if (closeButton) {
                    closeButton.onclick = function() {
                        hintArea.classList.add('hidden');
                    };
                }
            }
        } catch (error) {
            console.error('Error al dar pista:', error);
        }
    },
    
    /**
     * Muestra la mascota en modo pensativo y luego da una pista
     * @param {Object} exercise - Ejercicio actual
     */
    thinkAndGiveHint: function(exercise) {
        try {
            // Primero mostrar en modo pensativo
            this.react('thinking');
            
            // Después de un breve retraso, mostrar la pista
            setTimeout(() => {
                this.giveHint(exercise);
            }, 1500);
        } catch (error) {
            console.error('Error al pensar y dar pista:', error);
        }
    },
    
    /**
     * Celebra el logro de un objetivo
     * @param {string} message - Mensaje de celebración
     */
    celebrate: function(message) {
        try {
            // Cambiar a estado emocionado y mostrar mensaje de celebración
            this.setState('excited');
            this.speak(message || "¡Felicidades! ¡Lo lograste!", 6000);
            
            // Activar confeti si está disponible
            if (window.animations && typeof window.animations.showConfetti === 'function') {
                window.animations.showConfetti();
            }
        } catch (error) {
            console.error('Error al celebrar:', error);
        }
    },
    
    /**
     * Recarga forzada de todas las imágenes de estados
     * Útil cuando hay problemas de visualización
     */
    reloadAllStateImages: function() {
        const states = ['happy', 'thinking', 'excited', 'sad'];
        console.log("Recargando todas las imágenes de estados de mascota...");
        
        // Crear un arreglo de promesas para cargar cada imagen
        const preloadPromises = states.map(state => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Precargada imagen para estado '${state}'`);
                    resolve(true);
                };
                img.onerror = () => {
                    console.error(`Error al precargar imagen para estado '${state}'`);
                    resolve(false);
                };
                img.src = `images/mascot-${state}.png?force=${new Date().getTime()}`;
            });
        });
        
        // Esperar a que todas las imágenes sean precargadas
        Promise.all(preloadPromises).then(results => {
            console.log(`Recarga de imágenes completada. ${results.filter(Boolean).length}/${states.length} imágenes cargadas correctamente.`);
            // Refrescar el estado actual
            this.setState(this.state);
        });
    }
};

// Inicializar cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, inicializando mascota...");
    mascot.initialize();
    
    // Intentar recargar todas las imágenes después de un breve retraso
    setTimeout(() => {
        mascot.reloadAllStateImages();
    }, 2000);
});

// Exportar para uso en otros módulos
window.mascot = mascot;

console.log("Módulo de mascota cargado correctamente");