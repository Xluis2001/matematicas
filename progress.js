/**
 * Módulo para gestionar el progreso del estudiante
 * Versión 2.0 con soporte para logros, análisis de rendimiento y recomendaciones
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
     * Calcula la precisión en base a aciertos y total de intentos
     * @param {number} correctCount - Número de respuestas correctas 
     * @param {number} totalCount - Número total de ejercicios
     * @returns {Object} Objeto con detalles de la precisión
     */
    calculatePrecision: function(correctCount, totalCount) {
        if (!totalCount || totalCount <= 0) return { percent: 0, text: "0/0 intentos (0%)" };
        
        const percent = Math.round((correctCount / totalCount) * 100);
        return {
            percent,
            text: `${correctCount}/${totalCount} intentos (${percent}%)`,
            // Añadir calificación cualitativa
            rating: this.getPrecisionRating(percent)
        };
    },
    
    /**
     * Obtiene una calificación cualitativa basada en el porcentaje
     * @param {number} percent - Porcentaje de precisión
     * @returns {string} Calificación cualitativa
     */
    getPrecisionRating: function(percent) {
        if (percent >= 95) return "Excelente";
        if (percent >= 85) return "Muy Bien";
        if (percent >= 75) return "Bien";
        if (percent >= 60) return "Regular";
        return "Necesita Práctica";
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
            const precision = this.calculatePrecision(correctCount, totalCount);
            const passed = stars > 0; // Se considera aprobado si tiene al menos 1 estrella
            
            // Actualizar en el almacenamiento
            if (window.storage) {
                // Actualizar esta operación como completada si se aprobó
                if (passed) {
                    window.storage.updateOperation(grade, operation, true, stars, correctCount, totalCount);
                } else {
                    // Incluso si no se aprobó, actualizamos las estadísticas
                    window.storage.updateOperation(grade, operation, false, stars, correctCount, totalCount);
                }
            } else {
                console.error("Módulo de almacenamiento no disponible");
            }
            
            // Preparar datos de resultado
            const result = { 
                stars, 
                passed, 
                precision,
                recommendations: this.generateRecommendations(grade, operation, stars, precision.percent)
            };
            
            // Agregar información para la mascota si está disponible
            if (window.exercises && window.exercises.config[grade]) {
                result.gradeMessages = window.exercises.config[grade].mascotPhrases;
            }
            
            return result;
        } catch (error) {
            console.error("Error al actualizar progreso:", error);
            return { 
                stars: 0, 
                passed: false, 
                precision: { percent: 0, text: "0/0 intentos (0%)" },
                recommendations: ["Intenta practicar más ejercicios."]
            };
        }
    },
    
    /**
     * Genera recomendaciones personalizadas basadas en el rendimiento
     * @param {number} grade - Grado actual
     * @param {string} operation - Operación actual
     * @param {number} stars - Estrellas obtenidas
     * @param {number} precisionPercent - Porcentaje de precisión
     * @returns {Array} Lista de recomendaciones
     */
    generateRecommendations: function(grade, operation, stars, precisionPercent) {
        const recommendations = [];
        
        // Recomendaciones basadas en estrellas
        if (stars === 0) {
            recommendations.push("Intenta practicar más ejercicios de este tipo.");
            recommendations.push("Revisa los conceptos básicos de esta operación.");
        } else if (stars === 3) {
            recommendations.push("¡Excelente trabajo! Estás listo para avanzar.");
            
            // Recomendar siguiente operación si existe
            const nextOp = this.getNextOperation(grade, operation);
            if (nextOp) {
                recommendations.push(`Prueba a practicar ${nextOp.name} a continuación.`);
            }
            
            // Si todas las operaciones del grado actual están completadas con 3 estrellas,
            // recomendar avanzar al siguiente grado
            if (this.areAllOperationsCompleted(grade) && grade < 6) {
                recommendations.push(`¡Felicidades! Considera avanzar al grado ${grade + 1}.`);
            }
        }
        
        // Recomendaciones específicas por operación
        switch (operation) {
            case 'addition':
                if (precisionPercent < 80) {
                    recommendations.push("Practica el conteo progresivo y la descomposición de números.");
                }
                break;
                
            case 'subtraction':
                if (precisionPercent < 80) {
                    recommendations.push("Practica el conteo regresivo y la relación entre suma y resta.");
                }
                break;
                
            case 'multiplication':
                if (precisionPercent < 80) {
                    recommendations.push("Memoriza las tablas de multiplicar y practica sumas repetidas.");
                }
                break;
                
            case 'division':
                if (precisionPercent < 80) {
                    recommendations.push("Recuerda que la división es la operación inversa de la multiplicación.");
                }
                break;
                
            case 'fractions':
                if (precisionPercent < 80) {
                    recommendations.push("Visualiza las fracciones como partes de un todo o como división.");
                }
                break;
        }
        
        // Limitar a 3 recomendaciones como máximo
        return recommendations.slice(0, 3);
    },
    
    /**
     * Obtiene la siguiente operación recomendada
     * @param {number} grade - Grado actual
     * @param {string} currentOperation - Operación actual
     * @returns {Object|null} Información de la siguiente operación o null si no hay
     */
    getNextOperation: function(grade, currentOperation) {
        try {
            if (!window.exercises || !window.exercises.config[grade]) {
                return null;
            }
            
            const operations = window.exercises.config[grade].operations;
            const operationOrder = Object.keys(operations);
            
            // Encontrar índice de la operación actual
            const currentIndex = operationOrder.indexOf(currentOperation);
            
            // Si es la última operación o no se encuentra, devolver null
            if (currentIndex === -1 || currentIndex === operationOrder.length - 1) {
                return null;
            }
            
            // Devolver la siguiente operación
            const nextOperation = operationOrder[currentIndex + 1];
            return {
                id: nextOperation,
                name: operations[nextOperation].name
            };
        } catch (error) {
            console.error("Error al obtener siguiente operación:", error);
            return null;
        }
    },
    
    /**
     * Verifica si todas las operaciones de un grado están completadas con 3 estrellas
     * @param {number} grade - Grado a verificar
     * @returns {boolean} true si todas están completadas con 3 estrellas
     */
    areAllOperationsCompleted: function(grade) {
        try {
            if (!window.storage) return false;
            
            const gradeData = window.storage.getGrade(grade);
            if (!gradeData || !gradeData.operations) return false;
            
            // Verificar cada operación
            return Object.values(gradeData.operations).every(op => op.completed && op.stars === 3);
        } catch (error) {
            console.error("Error al verificar operaciones completadas:", error);
            return false;
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
            if (!window.storage) return false;
            
            const op = window.storage.getOperation(grade, operation);
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
            if (!window.storage) return false;
            
            const op = window.storage.getOperation(grade, operation);
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
            if (!window.storage) return 0;
            
            const op = window.storage.getOperation(grade, operation);
            return op ? op.stars : 0;
        } catch (error) {
            console.error("Error al obtener estrellas:", error);
            return 0;
        }
    },
    
    /**
     * Obtiene la precisión para una operación
     * @param {number} grade - Grado escolar
     * @param {string} operation - Nombre de la operación
     * @returns {Object} Objeto con la información de precisión
     */
    getOperationPrecision: function(grade, operation) {
        try {
            if (!window.storage) return { percent: 0, text: "0/0 intentos (0%)" };
            
            const op = window.storage.getOperation(grade, operation);
            if (!op || !op.correctCount || !op.totalCount) {
                return { percent: 0, text: "0/0 intentos (0%)" };
            }
            return this.calculatePrecision(op.correctCount, op.totalCount);
        } catch (error) {
            console.error("Error al obtener precisión:", error);
            return { percent: 0, text: "0/0 intentos (0%)" };
        }
    },
    
    /**
     * Obtiene información de todas las operaciones para un grado
     * @param {number} grade - Grado escolar
     * @returns {Object} Información de operaciones
     */
    getGradeOperations: function(grade) {
        try {
            if (!window.storage) return {};
            
            const gradeData = window.storage.getGrade(grade);
            return gradeData ? gradeData.operations : {};
        } catch (error) {
            console.error("Error al obtener operaciones de grado:", error);
            return {};
        }
    },
    
    /**
     * Verifica si un grado está desbloqueado
     * @param {number} grade - Grado escolar
     * @returns {boolean} true si está desbloqueado
     */
    isGradeUnlocked: function(grade) {
        try {
            if (!window.storage) return grade === 1;
            
            return window.storage.isGradeUnlocked(grade);
        } catch (error) {
            console.error("Error al verificar desbloqueo de grado:", error);
            return grade === 1; // Por defecto, solo el primer grado está desbloqueado
        }
    },
    
    /**
     * Obtiene el progreso general del estudiante
     * @returns {Object} Resumen del progreso
     */
    getSummary: function() {
        try {
            if (!window.storage) return {
                totalOperations: 0,
                completedOperations: 0,
                completionPercentage: 0,
                totalStars: 0,
                maxStars: 0,
                starPercentage: 0,
                achievements: []
            };
            
            const data = window.storage.getData();
            if (!data || !data.grades) {
                return {
                    totalOperations: 0,
                    completedOperations: 0,
                    completionPercentage: 0,
                    totalStars: 0,
                    maxStars: 0,
                    starPercentage: 0,
                    achievements: []
                };
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
                starPercentage: maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0,
                achievements: data.achievements || [],
                totalExercises: data.totalExercises || 0,
                totalCorrect: data.totalCorrect || 0,
                precision: data.precision || 0
            };
        } catch (error) {
            console.error("Error al obtener resumen de progreso:", error);
            return {
                totalOperations: 0,
                completedOperations: 0,
                completionPercentage: 0,
                totalStars: 0,
                maxStars: 0,
                starPercentage: 0,
                achievements: []
            };
        }
    },
    
    /**
     * Obtiene el rendimiento por operación matemática
     * @returns {Object} Rendimiento por operación
     */
    getOperationPerformance: function() {
        try {
            const performance = {
                addition: { correctCount: 0, totalCount: 0, precision: 0 },
                subtraction: { correctCount: 0, totalCount: 0, precision: 0 },
                multiplication: { correctCount: 0, totalCount: 0, precision: 0 },
                division: { correctCount: 0, totalCount: 0, precision: 0 },
                fractions: { correctCount: 0, totalCount: 0, precision: 0 },
                decimals: { correctCount: 0, totalCount: 0, precision: 0 },
                powers: { correctCount: 0, totalCount: 0, precision: 0 },
                percentages: { correctCount: 0, totalCount: 0, precision: 0 }
            };
            
            if (!window.storage) return performance;
            
            const data = window.storage.getData();
            if (!data || !data.grades) return performance;
            
            // Acumular datos de todas las operaciones en todos los grados
            for (let grade = 1; grade <= 6; grade++) {
                const gradeData = data.grades[grade];
                if (!gradeData || !gradeData.operations) continue;
                
                const operations = gradeData.operations;
                
                for (const op in operations) {
                    if (performance[op]) {
                        performance[op].correctCount += operations[op].correctCount || 0;
                        performance[op].totalCount += operations[op].totalCount || 0;
                    }
                }
            }
            
            // Calcular precisión para cada operación
            for (const op in performance) {
                if (performance[op].totalCount > 0) {
                    performance[op].precision = Math.round((performance[op].correctCount / performance[op].totalCount) * 100);
                }
            }
            
            return performance;
        } catch (error) {
            console.error("Error al obtener rendimiento por operación:", error);
            return {};
        }
    },
    
    /**
     * Analiza las fortalezas y debilidades del estudiante
     * @returns {Object} Análisis de fortalezas y debilidades
     */
    analyzeStrengthsAndWeaknesses: function() {
        try {
            const performance = this.getOperationPerformance();
            const strengths = [];
            const weaknesses = [];
            
            // Ordenar operaciones por precisión
            const sortedOps = Object.entries(performance)
                .filter(([op, data]) => data.totalCount > 0) // Solo considerar operaciones con datos
                .sort((a, b) => b[1].precision - a[1].precision); // Ordenar por precisión descendente
            
            // Identificar fortalezas (top 2 o las que tengan más de 85%)
            for (let i = 0; i < Math.min(2, sortedOps.length); i++) {
                const [op, data] = sortedOps[i];
                if (data.precision >= 85) {
                    strengths.push({
                        operation: op,
                        precision: data.precision,
                        message: `Buen dominio en ${this.getOperationName(op)} (${data.precision}%)`
                    });
                }
            }
            
            // Identificar debilidades (bottom 2 o las que tengan menos de 70%)
            const reversed = [...sortedOps].reverse();
            for (let i = 0; i < Math.min(2, reversed.length); i++) {
                const [op, data] = reversed[i];
                if (data.precision < 70) {
                    weaknesses.push({
                        operation: op,
                        precision: data.precision,
                        message: `Necesita mejorar en ${this.getOperationName(op)} (${data.precision}%)`
                    });
                }
            }
            
            return {
                strengths,
                weaknesses
            };
        } catch (error) {
            console.error("Error al analizar fortalezas y debilidades:", error);
            return { strengths: [], weaknesses: [] };
        }
    },
    
    /**
     * Obtiene el nombre amigable de una operación
     * @param {string} operationId - ID de la operación
     * @returns {string} Nombre amigable
     */
    getOperationName: function(operationId) {
        const names = {
            'addition': 'Suma',
            'subtraction': 'Resta',
            'multiplication': 'Multiplicación',
            'division': 'División',
            'fractions': 'Fracciones',
            'decimals': 'Decimales',
            'powers': 'Potencias',
            'percentages': 'Porcentajes'
        };
        
        return names[operationId] || operationId;
    }
};

// Exportar para uso en otros módulos
window.progress = progress;