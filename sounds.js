/**
 * Módulo para la gestión de efectos de sonido
 * Versión simplificada
 */

const sounds = {
    // Estado global de sonido
    enabled: true,
    volume: 0.7, // 0.0 a 1.0
    
    /**
     * Inicializa el sistema de sonido
     */
    initialize: function() {
        try {
            // Cargar preferencia del usuario si existe
            const savedState = localStorage.getItem('mathlearn_sound_enabled');
            if (savedState !== null) {
                this.enabled = savedState === 'true';
            }
            
            // Configurar botón de toggle de sonido
            const toggleButton = document.getElementById('toggle-sound-btn');
            if (toggleButton) {
                toggleButton.addEventListener('click', () => {
                    this.toggle();
                });
            }
            
            // Establecer volumen inicial para todos los sonidos
            ['correct', 'incorrect', 'complete', 'click', 'star'].forEach(sound => {
                const element = document.getElementById(`sound-${sound}`);
                if (element) {
                    element.volume = this.volume;
                }
            });
            
            console.log('Sistema de sonido inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar sistema de sonido:', error);
        }
    },
    
    /**
     * Reproduce un efecto de sonido
     * @param {string} sound - Nombre del sonido a reproducir
     */
    play: function(sound) {
        try {
            if (!this.enabled) return;
            
            const element = document.getElementById(`sound-${sound}`);
            if (!element) {
                console.warn(`Sonido '${sound}' no encontrado`);
                return;
            }
            
            // Detener y reiniciar el sonido para poder reproducirlo nuevamente
            element.pause();
            element.currentTime = 0;
            
            // Reproducir sonido
            const playPromise = element.play();
            
            // Manejar errores de reproducción
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Error al reproducir sonido '${sound}':`, error);
                });
            }
        } catch (error) {
            console.error(`Error al reproducir sonido '${sound}':`, error);
        }
    },
    
    /**
     * Activa o desactiva el sonido
     */
    toggle: function() {
        try {
            this.enabled = !this.enabled;
            localStorage.setItem('mathlearn_sound_enabled', this.enabled);
            
            // Actualizar icono y texto del botón
            const icon = document.getElementById('sound-icon');
            const text = document.getElementById('sound-text');
            
            if (icon && text) {
                if (this.enabled) {
                    icon.className = 'fas fa-volume-up';
                    text.textContent = 'Sonidos: ON';
                } else {
                    icon.className = 'fas fa-volume-mute';
                    text.textContent = 'Sonidos: OFF';
                }
            }
            
            // Reproducir sonido de click para confirmar que el sonido está activado
            if (this.enabled) {
                this.play('click');
            }
            
            console.log(`Sonido ${this.enabled ? 'activado' : 'desactivado'}`);
        } catch (error) {
            console.error('Error al cambiar estado de sonido:', error);
        }
    },
    
    /**
     * Reproduce un sonido de respuesta correcta
     */
    playCorrect: function() {
        this.play('correct');
    },
    
    /**
     * Reproduce un sonido de respuesta incorrecta
     */
    playIncorrect: function() {
        this.play('incorrect');
    },
    
    /**
     * Reproduce un sonido de ejercicio completado
     */
    playComplete: function() {
        this.play('complete');
    },
    
    /**
     * Reproduce un sonido de click
     */
    playClick: function() {
        this.play('click');
    },
    
    /**
     * Reproduce un sonido de estrella
     */
    playStar: function() {
        this.play('star');
    }
};

// Inicializar cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    sounds.initialize();
    // Asegurar que el objeto se asigna correctamente a window
    window.sounds = sounds;
});