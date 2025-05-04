/**
 * Módulo para la gestión de animaciones y efectos visuales
 * Versión 2.0 con soporte para confeti, estrellas y transiciones
 */

const animations = {
    // Referencias a elementos y configuraciones
    counters: [],
    
    /**
     * Inicializa el sistema de animaciones
     */
    initialize: function() {
        try {
            // No es necesario inicializar el confeti ya que mini-confetti-clasico.js
            // se auto-inicializa al cargar
            
            console.log('Sistema de animaciones inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar sistema de animaciones:', error);
        }
    },
    
    /**
     * Muestra una animación de confeti
     * @param {number} duration - Duración en milisegundos (por defecto 5000ms)
     */
    showConfetti: function(duration = 5000) {
        try {
            // Mostrar contenedor de confeti si existe
            const container = document.getElementById('confetti-container');
            if (container) {
                container.style.display = 'block';
            }
            
            // Usar la nueva biblioteca con configuración predeterminada
            Confetti.launch(2);
            
            // Ocultar el contenedor después de la duración especificada
            setTimeout(() => {
                if (container) {
                    container.style.display = 'none';
                }
            }, duration);
            
            // Reproducir sonido si está disponible
            if (window.sounds && typeof window.sounds.playComplete === 'function') {
                window.sounds.playComplete();
            }
        } catch (error) {
            console.error('Error al mostrar confeti:', error);
        }
    },
    
    /**
     * Anima una estrella
     * @param {number} index - Índice de la estrella (1-3)
     * @param {boolean} filled - Si la estrella debe mostrarse llena
     */
    animateStar: function(index, filled) {
        try {
            const starElement = document.getElementById(`star-${index}`);
            if (!starElement) return;
            
            // Cambiar clase de estrella (llena o vacía)
            starElement.innerHTML = filled ? 
                '<i class="fas fa-star"></i>' : 
                '<i class="far fa-star"></i>';
            
            // Agregar clase de animación
            starElement.classList.add('animate');
            
            // Reproducir sonido si la estrella está llena
            if (filled && window.sounds && typeof window.sounds.playStar === 'function') {
                window.sounds.playStar();
            }
            
            // Quitar clase de animación después de completarse
            setTimeout(() => {
                starElement.classList.remove('animate');
            }, 1000);
        } catch (error) {
            console.error(`Error al animar estrella ${index}:`, error);
        }
    },
    
    /**
     * Anima todas las estrellas secuencialmente
     * @param {number} count - Cantidad de estrellas a llenar (0-3)
     * @param {number} delay - Retraso entre estrellas en milisegundos
     */
    animateStars: function(count, delay = 500) {
        try {
            for (let i = 1; i <= 3; i++) {
                setTimeout(() => {
                    this.animateStar(i, i <= count);
                }, (i - 1) * delay);
            }
            
            // Mostrar confeti si se completaron las 3 estrellas
            if (count === 3) {
                setTimeout(() => {
                    this.showConfetti();
                }, 3 * delay);
            }
        } catch (error) {
            console.error('Error al animar estrellas:', error);
        }
    },
    
    /**
     * Muestra un trofeo según el rendimiento
     * @param {number} percentage - Porcentaje de aciertos (0-100)
     */
    showTrophy: function(percentage) {
        try {
            const container = document.getElementById('trophy-container');
            if (!container) return;
            
            // Limpiar contenedor
            container.innerHTML = '';
            
            // Determinar tipo de trofeo según porcentaje
            let trophyClass = '';
            let trophyIcon = '';
            
            if (percentage >= 95) {
                trophyClass = 'gold';
                trophyIcon = 'fa-trophy';
            } else if (percentage >= 80) {
                trophyClass = 'silver';
                trophyIcon = 'fa-medal';
            } else if (percentage >= 60) {
                trophyClass = 'bronze';
                trophyIcon = 'fa-award';
            } else {
                // No mostrar trofeo si el porcentaje es muy bajo
                return;
            }
            
            // Crear elemento de trofeo
            const trophy = document.createElement('div');
            trophy.className = `trophy ${trophyClass}`;
            trophy.innerHTML = `<i class="fas ${trophyIcon}"></i>`;
            
            // Agregar al contenedor
            container.appendChild(trophy);
        } catch (error) {
            console.error('Error al mostrar trofeo:', error);
        }
    },
    
    /**
     * Anima un contador numérico
     * @param {string} elementId - ID del elemento que contiene el número
     * @param {number} targetValue - Valor final del contador
     * @param {number} duration - Duración de la animación en milisegundos
     * @param {string} suffix - Sufijo a agregar al valor (opcional, ej: '%')
     */
    animateCounter: function(elementId, targetValue, duration = 1000, suffix = '') {
        try {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            // Obtener valor inicial
            const startValue = parseInt(element.textContent) || 0;
            const range = targetValue - startValue;
            
            // Cancelar animación anterior si existe
            if (this.counters[elementId]) {
                clearInterval(this.counters[elementId]);
            }
            
            // Calcular incremento por paso
            const steps = duration / 16; // ~60fps
            const increment = range / steps;
            let currentValue = startValue;
            let step = 0;
            
            // Iniciar animación
            this.counters[elementId] = setInterval(() => {
                step++;
                
                // Usar una función de easing para un efecto más natural
                const progress = this.easeOutQuad(step / steps);
                currentValue = startValue + range * progress;
                
                // Actualizar elemento con el valor actual
                element.textContent = `${Math.round(currentValue)}${suffix}`;
                
                // Detener cuando se alcance el valor objetivo
                if (step >= steps) {
                    clearInterval(this.counters[elementId]);
                    element.textContent = `${targetValue}${suffix}`;
                    delete this.counters[elementId];
                }
            }, 16);
        } catch (error) {
            console.error(`Error al animar contador ${elementId}:`, error);
        }
    },
    
    /**
     * Función de easing para animaciones más naturales
     * @param {number} t - Progreso de la animación (0-1)
     * @returns {number} Valor con easing aplicado
     */
    easeOutQuad: function(t) {
        return t * (2 - t);
    },
    
    /**
     * Anima los resultados finales
     * @param {number} correctCount - Cantidad de respuestas correctas
     * @param {number} incorrectCount - Cantidad de respuestas incorrectas
     * @param {number} percentage - Porcentaje de aciertos
     * @param {number} stars - Cantidad de estrellas obtenidas (0-3)
     */
    animateResults: function(correctCount, incorrectCount, percentage, stars) {
        try {
            // Retraso inicial para permitir que la pantalla se muestre
            setTimeout(() => {
                // Animar contadores con retrasos escalonados
                this.animateCounter('final-correct', correctCount, 800);
                
                setTimeout(() => {
                    this.animateCounter('final-incorrect', incorrectCount, 800);
                }, 200);
                
                setTimeout(() => {
                    this.animateCounter('percentage', percentage, 1000, '%');
                }, 400);
                
                // Mostrar trofeo después de los contadores
                setTimeout(() => {
                    this.showTrophy(percentage);
                }, 1500);
                
                // Animar estrellas después del trofeo
                setTimeout(() => {
                    this.animateStars(stars);
                }, 2000);
            }, 300);
        } catch (error) {
            console.error('Error al animar resultados:', error);
        }
    },
    
    /**
     * Efecto de shake para respuestas incorrectas
     * @param {string} elementId - ID del elemento a animar
     */
    shakeElement: function(elementId) {
        try {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            // Agregar clase de animación
            element.classList.add('shake');
            
            // Quitar clase después de completarse
            setTimeout(() => {
                element.classList.remove('shake');
            }, 500);
        } catch (error) {
            console.error(`Error al aplicar efecto shake a ${elementId}:`, error);
        }
    },
    
    /**
     * Efecto de pulso para respuestas correctas
     * @param {string} elementId - ID del elemento a animar
     */
    pulseElement: function(elementId) {
        try {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            // Agregar clase de animación
            element.classList.add('pulse');
            
            // Quitar clase después de completarse
            setTimeout(() => {
                element.classList.remove('pulse');
            }, 500);
        } catch (error) {
            console.error(`Error al aplicar efecto pulse a ${elementId}:`, error);
        }
    }
};

// Inicializar cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    animations.initialize();
});

// Exportar para uso en otros módulos
window.animations = animations;