/**
 * ModuleManager - Sistema para gestionar dependencias entre módulos
 * Asegura que los módulos se inicialicen en el orden correcto y
 * proporciona un mecanismo para acceder a ellos de forma segura
 */
const ModuleManager = (function() {
    // Almacena referencias a los módulos
    const modules = {};
    
    // Almacena los callbacks para cuando un módulo esté listo
    const callbacks = {};
    
    // Almacena las dependencias de los módulos
    const dependencies = {};

    // Variable para seguir si todos los módulos están inicializados
    let allInitialized = false;
    
    return {
        /**
         * Registra un módulo y sus dependencias
         * @param {string} name - Nombre del módulo
         * @param {Object} module - Referencia al módulo
         * @param {Array} deps - Lista de nombres de módulos de los que depende
         */
        register: function(name, module, deps = []) {
            console.log(`Registrando módulo '${name}'...`);
            modules[name] = module;
            dependencies[name] = deps;
            
            // Verificar si hay callbacks esperando por este módulo
            if (callbacks[name] && Array.isArray(callbacks[name])) {
                callbacks[name].forEach(callback => {
                    this.whenReady([name], callback);
                });
            }
            
            // Inicializar el módulo inmediatamente si no tiene dependencias
            if (deps.length === 0 && typeof module.initialize === 'function') {
                try {
                    module.initialize();
                    console.log(`Módulo '${name}' inicializado automáticamente`);
                } catch (error) {
                    console.error(`Error al inicializar módulo '${name}':`, error);
                }
            }
            
            console.log(`Módulo '${name}' registrado correctamente`);
            return this;
        },
        
        /**
         * Obtiene una referencia a un módulo registrado
         * @param {string} name - Nombre del módulo
         * @returns {Object|null} Módulo o null si no existe
         */
        get: function(name) {
            return modules[name] || null;
        },
        
        /**
         * Ejecuta una función cuando todos los módulos especificados estén listos
         * @param {Array} moduleNames - Lista de nombres de módulos requeridos
         * @param {Function} callback - Función a ejecutar cuando estén listos
         */
        whenReady: function(moduleNames, callback) {
            // Verificar si todos los módulos ya están disponibles
            const allAvailable = moduleNames.every(name => modules[name]);
            
            if (allAvailable) {
                // Todos los módulos están listos, ejecutar callback
                const moduleInstances = moduleNames.map(name => modules[name]);
                callback(...moduleInstances);
                return;
            }
            
            // Almacenar callback para cada módulo pendiente
            moduleNames.forEach(name => {
                if (!modules[name]) {
                    if (!callbacks[name]) {
                        callbacks[name] = [];
                    }
                    callbacks[name].push(callback);
                }
            });
        },
        
        /**
         * Inicializa todos los módulos registrados en el orden correcto
         * según sus dependencias
         */
        initializeAll: function() {
            console.log("Iniciando inicialización de todos los módulos...");
            const initialized = new Set();
            const pending = Object.keys(modules);
            
            const initModule = (name) => {
                if (initialized.has(name)) return true;
                
                // Verificar dependencias
                const deps = dependencies[name] || [];
                const depsMet = deps.every(dep => {
                    if (!modules[dep]) {
                        console.error(`Error: Módulo '${name}' depende de '${dep}' pero no está registrado`);
                        return false;
                    }
                    return initModule(dep);
                });
                
                if (!depsMet) {
                    console.error(`Error: No se pueden satisfacer las dependencias para '${name}'`);
                    return false;
                }
                
                // Inicializar módulo si tiene método initialize
                try {
                    if (typeof modules[name].initialize === 'function') {
                        modules[name].initialize();
                    }
                    initialized.add(name);
                    console.log(`Módulo '${name}' inicializado correctamente`);
                    return true;
                } catch (error) {
                    console.error(`Error al inicializar módulo '${name}':`, error);
                    return false;
                }
            };
            
            // Intentar inicializar todos los módulos
            pending.forEach(name => {
                if (!initialized.has(name)) {
                    initModule(name);
                }
            });
            
            allInitialized = initialized.size === pending.length;
            console.log(`Inicialización de módulos completada: ${initialized.size}/${pending.length} módulos inicializados`);
            
            return allInitialized;
        },
        
        /**
         * Verificar si todos los módulos están inicializados
         */
        areAllInitialized: function() {
            return allInitialized;
        }
    };
})();

// Exportar para uso global
window.ModuleManager = ModuleManager;

// Registrar evento cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM totalmente cargado, iniciando ModuleManager...");
    
    // Esperar 300ms para dar tiempo a que todos los módulos se registren
    setTimeout(() => {
        ModuleManager.initializeAll();
    }, 300);
});

console.log("ModuleManager cargado correctamente");