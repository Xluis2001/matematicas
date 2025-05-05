/**
 * Módulo para la gestión de efectos de sonido
 * Versión simplificada con mejor manejo de errores y compatibilidad
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
            console.log('Inicializando sistema de sonido...');
            
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
                
                // Actualizar estado visual del botón
                this.updateSoundButtonState();
            }
            
            // Establecer volumen inicial para todos los sonidos
            ['correct', 'incorrect', 'complete', 'click', 'star'].forEach(sound => {
                const element = document.getElementById(`sound-${sound}`);
                if (element) {
                    element.volume = this.volume;
                } else {
                    console.warn(`Elemento de audio 'sound-${sound}' no encontrado`);
                }
            });
            
            console.log('Sistema de sonido inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error al inicializar sistema de sonido:', error);
            return false;
        }
    },
    
    /**
     * Actualiza el estado visual del botón de sonido
     */
    updateSoundButtonState: function() {
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
            this.updateSoundButtonState();
            
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
    },
    
    /**
     * Establece el volumen para todos los sonidos
     * @param {number} level - Nivel de volumen (0.0 a 1.0)
     */
    setVolume: function(level) {
        if (typeof level !== 'number' || level < 0 || level > 1) {
            console.error('Nivel de volumen inválido. Debe ser un número entre 0.0 y 1.0');
            return;
        }
        
        this.volume = level;
        
        // Actualizar volumen en todos los elementos de audio
        ['correct', 'incorrect', 'complete', 'click', 'star'].forEach(sound => {
            const element = document.getElementById(`sound-${sound}`);
            if (element) {
                element.volume = this.volume;
            }
        });
        
        console.log(`Volumen establecido a ${level}`);
    }
};

// Inicializar cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("DOM cargado, inicializando módulo de sonidos...");
        sounds.initialize();
    } catch (error) {
        console.error("Error al inicializar sounds desde event listener:", error);
    }
});

// Asegurar la disponibilidad global
window.sounds = sounds;

console.log("Módulo de sonidos cargado correctamente");