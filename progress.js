/**
 * Módulo para gestionar el progreso del estudiante
 * Optimizado para rendimiento y estabilidad
 */

const progress = {
    /**
     * Calcula el número de estrellas obtenidas según el porcentaje de aciertos
     * @param {number} correctCount - Número de respuestas correctas
     * @param {number} totalCount - Número total de ejercicios
     * @returns {number} Número de estrellas (0-3)
     */
    calculateStars: function(correctCount, totalCount) {
        if (!totalCount || totalCount <= 0) return 0;
        
        const percentage = (correctCount / totalCount) * 100;
        
        if (percentage < 80) {
            return 0; // No pasó
        } else if (percentage < 90) {
            return 1; // 1 estrella (80-89%)
        } else if (percentage < 100) {
            return 2; // 2 estrellas (90-99%)
        } else {
            return 3; // 3 estrellas (100%)
        }
    },
    
    /**
     * Actualiza el progreso de una operación
     * @param {number} grade - Número de grado (1-6)
     * @param {string} operation - Nombre de la operación
     * @param {number} correctCount - Número de respuestas correctas
     * @param {number} totalCount - Número total de ejercicios
     * @returns {Object} Información sobre estrellas y aprobación
     */
    updateProgress: function(grade, operation, correctCount, totalCount) {
        try {
            const stars = this.calculateStars(correctCount, totalCount);
            const passed = stars > 0; // Se considera aprobado si tiene al menos 1 estrella
            
            // Actualizar en el almacenamiento
            if (passed) {
                // Actualiza esta operación como completada
                const data = storage.getData();
                if (!data || !data.grades || !data.grades[grade] || !data.grades[grade].operations || !data.grades[grade].operations[operation]) {
                    throw new Error("Datos inválidos para actualizar progreso");
                }
                
                const op = data.grades[grade].operations[operation];
                
                if (stars > op.stars) {
                    op.stars = stars;
                }
                op.completed = true;
                
                // Determinar la siguiente operación a desbloquear
                let nextOperation = null;
                
                switch(operation) {
                    case 'addition':
                        nextOperation = 'subtraction';
                        break;
                    case 'subtraction':
                        nextOperation = 'multiplication';
                        break;
                    case 'multiplication':
                        nextOperation = 'division';
                        break;
                    case 'division':
                        // Si hay fracciones en este grado, desbloquearlas
                        if (data.grades[grade].operations.fractions) {
                            nextOperation = 'fractions';
                        }
                        break;
                    case 'fractions':
                        // Si hay decimales en este grado, desbloquearlos
                        if (data.grades[grade].operations.decimals) {
                            nextOperation = 'decimals';
                        }
                        break;
                    case 'decimals':
                        // Si hay potencias en este grado, desbloquearlas
                        if (data.grades[grade].operations.powers) {
                            nextOperation = 'powers';
                        }
                        break;
                    case 'powers':
                        // Si hay porcentajes en este grado, desbloquearlos
                        if (data.grades[grade].operations.percentages) {
                            nextOperation = 'percentages';
                        }
                        break;
                }
                
                // Desbloquear la siguiente operación si existe
                if (nextOperation && data.grades[grade].operations[nextOperation]) {
                    data.grades[grade].operations[nextOperation].unlocked = true;
                }
                
                // Guardar los cambios
                storage.saveData(data);
            }
            
            return { stars, passed };
        } catch (error) {
            console.error("Error al actualizar progreso:", error);
            return { stars: 0, passed: false };
        }
    },
    
    /**
     * Verifica si una operación está desbloqueada
     * @param {number} grade - Grado escolar
     * @param {string} operation - Nombre de la operación
     * @returns {boolean} true si está desbloqueada
     */
    isOperationUnlocked: function(grade, operation) {
        try {
            const op = storage.getOperation(grade, operation);
            return op && op.unlocked;
        } catch (error) {
            console.error("Error al verificar desbloqueo de operación:", error);
            return false;
        }
    },
    
    /**
     * Verifica si una operación está completada
     * @param {number} grade - Grado escolar
     * @param {string} operation - Nombre de la operación
     * @returns {boolean} true si está completada
     */
    isOperationCompleted: function(grade, operation) {
        try {
            const op = storage.getOperation(grade, operation);
            return op && op.completed;
        } catch (error) {
            console.error("Error al verificar completado de operación:", error);
            return false;
        }
    },
    
    /**
     * Obtiene el número de estrellas para una operación
     * @param {number} grade - Grado escolar
     * @param {string} operation - Nombre de la operación
     * @returns {number} Número de estrellas (0-3)
     */
    getOperationStars: function(grade, operation) {
        try {
            const op = storage.getOperation(grade, operation);
            return op ? op.stars : 0;
        } catch (error) {
            console.error("Error al obtener estrellas:", error);
            return 0;
        }
    },
    
    /**
     * Obtiene información de todas las operaciones para un grado
     * @param {number} grade - Grado escolar
     * @returns {Object} Información de operaciones
     */
    getGradeOperations: function(grade) {
        try {
            const gradeData = storage.getGrade(grade);
            return gradeData ? gradeData.operations : {};
        } catch (error) {
            console.error("Error al obtener operaciones de grado:", error);
            return {};
        }
    },
    
    /**
     * Verifica si todos los grados anteriores están completados
     * @param {number} currentGrade - Grado actual
     * @returns {boolean} true si todos los grados anteriores están completados
     */
    arePreviousGradesCompleted: function(currentGrade) {
        try {
            // El primer grado siempre está desbloqueado
            if (currentGrade === 1) return true;
            
            // Verificar cada grado anterior
            for (let g = 1; g < currentGrade; g++) {
                if (!storage.isGradeCompleted(g)) {
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error("Error al verificar grados anteriores:", error);
            return false;
        }
    },
    
    /**
     * Verifica si un grado está desbloqueado
     * @param {number} grade - Grado escolar
     * @returns {boolean} true si está desbloqueado
     */
    isGradeUnlocked: function(grade) {
        try {
            return storage.isGradeUnlocked(grade);
        } catch (error) {
            console.error("Error al verificar desbloqueo de grado:", error);
            return false;
        }
    },
    
    /**
     * Desbloquea todas las operaciones del siguiente grado
     * @param {number} currentGrade - Grado actual
     */
    unlockNextGrade: function(currentGrade) {
        try {
            if (currentGrade >= 6) return; // No hay grado siguiente después del 6to
            
            const nextGrade = currentGrade + 1;
            storage.unlockGrade(nextGrade);
        } catch (error) {
            console.error("Error al desbloquear siguiente grado:", error);
        }
    },
    
    /**
     * Obtiene el progreso general del estudiante
     * @returns {Object} Resumen del progreso
     */
    getSummary: function() {
        try {
            const data = storage.getData();
            if (!data || !data.grades) {
                throw new Error("Datos inválidos para obtener resumen");
            }
            
            let totalOperations = 0;
            let completedOperations = 0;
            let totalStars = 0;
            let maxStars = 0;
            
            // Contar operaciones y estrellas
            for (let grade = 1; grade <= 6; grade++) {
                const gradeData = data.grades[grade];
                if (!gradeData || !gradeData.operations) continue;
                
                const operations = gradeData.operations;
                
                for (const op in operations) {
                    totalOperations++;
                    maxStars += 3; // Máximo 3 estrellas por operación
                    
                    if (operations[op].completed) {
                        completedOperations++;
                        totalStars += operations[op].stars;
                    }
                }
            }
            
            return {
                totalOperations,
                completedOperations,
                completionPercentage: totalOperations > 0 ? Math.round((completedOperations / totalOperations) * 100) : 0,
                totalStars,
                maxStars,
                starPercentage: maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0
            };
        } catch (error) {
            console.error("Error al obtener resumen de progreso:", error);
            return {
                totalOperations: 0,
                completedOperations: 0,
                completionPercentage: 0,
                totalStars: 0,
                maxStars: 0,
                starPercentage: 0
            };
        }
    }
};