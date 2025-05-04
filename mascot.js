/**
 * Módulo para la gestión de la mascota interactiva
 * Permite mostrar mensajes, cambiar estados de ánimo y proporcionar pistas
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
            
            // Cambiar a estado "hablando"
            this.setState('excited');
            
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
     * Oculta la burbuja de diálogo
     */
    hideSpeech: function() {
        try {
            this.elements.speech.classList.add('hidden');
            this.speechVisible = false;
            
            // Volver al estado normal
            this.setState('happy');
        } catch (error) {
            console.error('Error al ocultar burbuja de diálogo:', error);
        }
    },
    
    /**
     * Cambia el estado de ánimo de la mascota
     * @param {string} state - Nuevo estado (happy, thinking, excited, sad)
     */
    setState: function(state) {
        try {
            if (this.state === state) return;
            
            this.state = state;
            
            // Actualizar imagen según el estado
            const imgPath = `images/mascot-${state}.png`;
            this.elements.image.src = imgPath;
            
            console.log(`Estado de la mascota cambiado a: ${state}`);
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
                    
                default:
                    message = this.getRandomMessage('encouragement');
                    break;
            }
            
            // Cambiar estado y mostrar mensaje
            this.setState(state);
            this.speak(message, duration);
        } catch (error) {
            console.error('Error al reaccionar a evento:', error);
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
    }
};

// Inicializar cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    mascot.initialize();
});

// Exportar para uso en otros módulos
window.mascot = mascot;