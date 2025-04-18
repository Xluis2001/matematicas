/**
 * Módulo para el manejo del almacenamiento local
 * Permite guardar y recuperar el progreso del estudiante
 * Con optimizaciones para rendimiento
 */

const storage = {
    /**
     * Clave utilizada para el almacenamiento en localStorage
     */
    STORAGE_KEY: 'mathlearn_progress',
    
    /**
     * Estructura inicial de datos para un estudiante nuevo
     */
    initialData: {
        grades: {
            1: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0 },
                    division: { unlocked: false, completed: false, stars: 0 }
                }
            },
            2: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0 },
                    division: { unlocked: false, completed: false, stars: 0 }
                }
            },
            3: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0 },
                    division: { unlocked: false, completed: false, stars: 0 }
                }
            },
            4: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0 },
                    division: { unlocked: false, completed: false, stars: 0 }
                }
            },
            5: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0 },
                    division: { unlocked: false, completed: false, stars: 0 },
                    fractions: { unlocked: false, completed: false, stars: 0 },
                    decimals: { unlocked: false, completed: false, stars: 0 }
                }
            },
            6: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0 },
                    division: { unlocked: false, completed: false, stars: 0 },
                    fractions: { unlocked: false, completed: false, stars: 0 },
                    decimals: { unlocked: false, completed: false, stars: 0 },
                    powers: { unlocked: false, completed: false, stars: 0 },
                    percentages: { unlocked: false, completed: false, stars: 0 }
                }
            }
        }
    },
    
    // Cache para evitar leer constantemente de localStorage
    dataCache: null,
    
    /**
     * Inicializa el almacenamiento si no existe
     */
    initialize() {
        try {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
            }
            // Cargar datos en caché
            this.dataCache = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
        } catch (error) {
            console.error("Error al inicializar almacenamiento:", error);
            // Reiniciar si hay datos corruptos
            this.resetProgress();
        }
    },
    
    /**
     * Obtiene todos los datos de progreso
     * @returns {Object} Datos de progreso
     */
    getData() {
        if (!this.dataCache) {
            this.initialize();
        }
        return this.dataCache;
    },
    
    /**
     * Guarda los datos de progreso
     * @param {Object} data - Datos a guardar
     */
    saveData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.dataCache = data; // Actualizar caché
        } catch (error) {
            console.error("Error al guardar datos:", error);
        }
    },
    
    /**
     * Obtiene información sobre un grado específico
     * @param {number} grade - Número de grado (1-6)
     * @returns {Object} Información del grado
     */
    getGrade(grade) {
        const data = this.getData();
        return data.grades[grade];
    },
    
    /**
     * Verifica si un grado está desbloqueado
     * @param {number} grade - Número de grado (1-6)
     * @returns {boolean} true si está desbloqueado
     */
    isGradeUnlocked(grade) {
        return this.getGrade(grade).unlocked;
    },
    
    /**
     * Desbloquea un grado
     * @param {number} grade - Número de grado a desbloquear
     */
    unlockGrade(grade) {
        const data = this.getData();
        data.grades[grade].unlocked = true;
        this.saveData(data);
    },
    
    /**
     * Obtiene información sobre una operación específica
     * @param {number} grade - Número de grado (1-6)
     * @param {string} operation - Nombre de la operación
     * @returns {Object} Información de la operación
     */
    getOperation(grade, operation) {
        const gradeData = this.getGrade(grade);
        return gradeData?.operations[operation];
    },
    
    /**
     * Actualiza el progreso de una operación
     * @param {number} grade - Número de grado (1-6)
     * @param {string} operation - Nombre de la operación
     * @param {boolean} completed - Si se completó la operación
     * @param {number} stars - Número de estrellas obtenidas (0-3)
     */
    updateOperation(grade, operation, completed, stars) {
        const data = this.getData();
        const op = data.grades[grade].operations[operation];
        
        // Sólo actualizar si es mejor que el resultado anterior
        if (stars > op.stars) {
            op.stars = stars;
        }
        
        if (completed) {
            op.completed = true;
        }
        
        this.saveData(data);
        this.checkGradeUnlock(grade);
    },
    
    /**
     * Verifica si se debe desbloquear el siguiente grado
     * @param {number} currentGrade - Grado actual
     */
    checkGradeUnlock(currentGrade) {
        if (currentGrade >= 6) return; // No hay grado siguiente después del 6to
        
        const nextGrade = currentGrade + 1;
        const data = this.getData();
        
        // Verificar si todas las operaciones del grado actual están completas
        const currentGradeData = data.grades[currentGrade];
        const allCompleted = Object.values(currentGradeData.operations)
            .every(op => op.completed);
        
        if (allCompleted) {
            data.grades[nextGrade].unlocked = true;
            this.saveData(data);
        }
    },
    
    /**
     * Reinicia todo el progreso
     */
    resetProgress() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
            this.dataCache = JSON.parse(JSON.stringify(this.initialData));
        } catch (error) {
            console.error("Error al reiniciar progreso:", error);
        }
    },
    
    /**
     * Verifica si todas las operaciones de un grado están completas
     * @param {number} grade - Número de grado
     * @returns {boolean} true si todas están completas
     */
    isGradeCompleted(grade) {
        const gradeData = this.getGrade(grade);
        return Object.values(gradeData.operations).every(op => op.completed);
    }
};