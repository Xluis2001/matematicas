/**
 * Módulo para el manejo del almacenamiento local
 * Permite guardar y recuperar el progreso del estudiante
 * Con optimizaciones para rendimiento y soporte para precisión
 */

const storage = {
    /**
     * Clave utilizada para el almacenamiento en localStorage
     */
    STORAGE_KEY: 'mathlearn_progress',
    
    /**
     * Estructura inicial de datos para un estudiante nuevo
     * Ahora incluye campos para precisión
     */
    initialData: {
        grades: {
            1: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 }
                }
            },
            2: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 }
                }
            },
            3: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 }
                }
            },
            4: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 }
                }
            },
            5: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    fractions: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    decimals: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 }
                }
            },
            6: {
                unlocked: true,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    fractions: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    decimals: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    powers: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 },
                    percentages: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0 }
                }
            }
        }
    },
    
    // Cache para evitar leer constantemente de localStorage
    dataCache: null,
    
    /**
     * Inicializa el almacenamiento si no existe
     * Actualiza datos antiguos con la nueva estructura si es necesario
     */
    initialize() {
        try {
            let existingData = localStorage.getItem(this.STORAGE_KEY);
            
            if (!existingData) {
                // No hay datos existentes, crear nuevos
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
                this.dataCache = JSON.parse(JSON.stringify(this.initialData));
            } else {
                // Cargar datos existentes en caché
                this.dataCache = JSON.parse(existingData);
                
                // Verificar si los datos existentes tienen la nueva estructura
                // y actualizar si es necesario
                let needsUpdate = false;
                
                for (let grade = 1; grade <= 6; grade++) {
                    if (!this.dataCache.grades[grade]) continue;
                    
                    const gradeOperations = this.dataCache.grades[grade].operations;
                    for (const op in gradeOperations) {
                        // Si no tiene los campos de precisión, agregarlos
                        if (gradeOperations[op].precision === undefined) {
                            gradeOperations[op].correctCount = 0;
                            gradeOperations[op].totalCount = 0;
                            gradeOperations[op].precision = 0;
                            needsUpdate = true;
                        }
                    }
                }
                
                // Si se actualizó algo, guardar los cambios
                if (needsUpdate) {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.dataCache));
                }
            }
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
     * @param {number} correctCount - Respuestas correctas
     * @param {number} totalCount - Total de ejercicios
     */
    updateOperation(grade, operation, completed, stars, correctCount, totalCount) {
        const data = this.getData();
        const op = data.grades[grade].operations[operation];
        
        // Sólo actualizar si es mejor que el resultado anterior
        if (stars > op.stars) {
            op.stars = stars;
        }
        
        if (completed) {
            op.completed = true;
        }
        
        // Actualizar datos de precisión
        if (correctCount !== undefined && totalCount !== undefined) {
            op.correctCount = correctCount;
            op.totalCount = totalCount;
            op.precision = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
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