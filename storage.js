/**
 * Módulo para el manejo del almacenamiento local
 * Permite guardar y recuperar el progreso del estudiante
 * Versión 2.0 con soporte para más estadísticas y opciones de configuración
 */

const storage = {
    /**
     * Clave utilizada para el almacenamiento en localStorage
     */
    STORAGE_KEY: 'mathlearn_progress_v2',
    
    /**
     * Claves adicionales para preferencias y configuración
     */
    CONFIG_KEY: 'mathlearn_config',
    
    /**
     * Estructura inicial de datos para un estudiante nuevo
     */
    initialData: {
        version: '2.0',
        lastActivity: null,
        totalExercises: 0,
        totalCorrect: 0,
        globalPrecision: 0,
        currentSession: {
            date: null,
            exercises: 0,
            correct: 0
        },
        achievements: [],
        grades: {
            1: {
                unlocked: true,
                completed: false,
                stars: 0,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] }
                }
            },
            2: {
                unlocked: true,
                completed: false,
                stars: 0,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] }
                }
            },
            3: {
                unlocked: true,
                completed: false,
                stars: 0,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] }
                }
            },
            4: {
                unlocked: true,
                completed: false,
                stars: 0,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] }
                }
            },
            5: {
                unlocked: true,
                completed: false,
                stars: 0,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    fractions: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    decimals: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] }
                }
            },
            6: {
                unlocked: true,
                completed: false,
                stars: 0,
                operations: {
                    addition: { unlocked: true, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    subtraction: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    multiplication: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    division: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    fractions: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    decimals: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    powers: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] },
                    percentages: { unlocked: false, completed: false, stars: 0, correctCount: 0, totalCount: 0, precision: 0, lastPlayed: null, history: [] }
                }
            }
        }
    },
    
    /**
     * Configuración predeterminada
     */
    defaultConfig: {
        soundEnabled: true,
        soundVolume: 0.7,
        showHints: true,
        showTimer: true,
        timerDuration: 25,
        theme: 'default',
        difficultyLevel: 'normal', // easy, normal, hard
        languageCode: 'es'
    },
    
    // Cache para evitar leer constantemente de localStorage
    dataCache: null,
    configCache: null,
    
    /**
     * Inicializa el almacenamiento si no existe
     * Actualiza datos antiguos con la nueva estructura si es necesario
     */
    initialize() {
        try {
            // Inicializar progreso
            let existingData = localStorage.getItem(this.STORAGE_KEY);
            
            if (!existingData) {
                // Verificar si hay datos de la versión anterior
                const oldData = localStorage.getItem('mathlearn_progress');
                
                if (oldData) {
                    console.log('Migrando datos desde versión anterior');
                    // Migrar datos antiguos a nueva estructura
                    try {
                        const oldParsed = JSON.parse(oldData);
                        const newData = JSON.parse(JSON.stringify(this.initialData));
                        
                        // Copiar datos antiguos a nueva estructura
                        if (oldParsed && oldParsed.grades) {
                            Object.keys(oldParsed.grades).forEach(grade => {
                                if (newData.grades[grade]) {
                                    // Copiar estado desbloqueado
                                    newData.grades[grade].unlocked = oldParsed.grades[grade].unlocked || false;
                                    
                                    // Copiar operaciones si existen
                                    if (oldParsed.grades[grade].operations) {
                                        Object.keys(oldParsed.grades[grade].operations).forEach(op => {
                                            if (newData.grades[grade].operations[op]) {
                                                const oldOp = oldParsed.grades[grade].operations[op];
                                                const newOp = newData.grades[grade].operations[op];
                                                
                                                newOp.unlocked = oldOp.unlocked || false;
                                                newOp.completed = oldOp.completed || false;
                                                newOp.stars = oldOp.stars || 0;
                                                newOp.correctCount = oldOp.correctCount || 0;
                                                newOp.totalCount = oldOp.totalCount || 0;
                                                newOp.precision = oldOp.precision || 0;
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        
                        // Guardar nuevos datos migrados
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newData));
                        this.dataCache = newData;
                        
                        console.log('Migración completada');
                    } catch (migrationError) {
                        console.error('Error durante migración de datos:', migrationError);
                        // Si falla la migración, usar datos iniciales
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
                        this.dataCache = JSON.parse(JSON.stringify(this.initialData));
                    }
                } else {
                    // No hay datos existentes, crear nuevos
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
                    this.dataCache = JSON.parse(JSON.stringify(this.initialData));
                }
            } else {
                // Cargar datos existentes en caché
                try {
                    this.dataCache = JSON.parse(existingData);
                    
                    // Verificar y actualizar estructura si es necesario
                    const updated = this.ensureDataStructure(this.dataCache);
                    if (updated) {
                        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.dataCache));
                    }
                } catch (parseError) {
                    console.error('Error al parsear datos existentes:', parseError);
                    // Si hay error de parseo, reiniciar datos
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
                    this.dataCache = JSON.parse(JSON.stringify(this.initialData));
                }
            }
            
            // Inicializar configuración
            this.initializeConfig();
            
            console.log('Sistema de almacenamiento inicializado correctamente');
        } catch (error) {
            console.error('Error al inicializar almacenamiento:', error);
            // Reiniciar si hay datos corruptos
            this.resetProgress();
        }
    },
    
    /**
     * Inicializa la configuración si no existe
     */
    initializeConfig() {
        try {
            const existingConfig = localStorage.getItem(this.CONFIG_KEY);
            
            if (!existingConfig) {
                // No hay configuración existente, crear nueva
                localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.defaultConfig));
                this.configCache = JSON.parse(JSON.stringify(this.defaultConfig));
            } else {
                // Cargar configuración existente y asegurar que tenga todos los campos
                try {
                    const parsedConfig = JSON.parse(existingConfig);
                    this.configCache = { ...this.defaultConfig, ...parsedConfig };
                    
                    // Guardar configuración actualizada
                    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.configCache));
                } catch (parseError) {
                    console.error('Error al parsear configuración existente:', parseError);
                    // Si hay error de parseo, reiniciar configuración
                    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.defaultConfig));
                    this.configCache = JSON.parse(JSON.stringify(this.defaultConfig));
                }
            }
        } catch (error) {
            console.error('Error al inicializar configuración:', error);
            // Reiniciar si hay datos corruptos
            this.resetConfig();
        }
    },
    
    /**
     * Asegura que la estructura de datos tenga todos los campos necesarios
     * @param {Object} data - Datos a verificar
     * @returns {boolean} true si se actualizó la estructura
     */
    ensureDataStructure(data) {
        try {
            let updated = false;
            
            // Verificar versión
            if (!data.version) {
                data.version = '2.0';
                updated = true;
            }
            
            // Verificar campos principales
            if (typeof data.totalExercises === 'undefined') data.totalExercises = 0;
            if (typeof data.totalCorrect === 'undefined') data.totalCorrect = 0;
            if (typeof data.globalPrecision === 'undefined') data.globalPrecision = 0;
            if (!data.currentSession) {
                data.currentSession = {
                    date: null,
                    exercises: 0,
                    correct: 0
                };
                updated = true;
            }
            if (!Array.isArray(data.achievements)) data.achievements = [];
            
            // Verificar estructura de grados
            for (let grade = 1; grade <= 6; grade++) {
                if (!data.grades[grade]) {
                    data.grades[grade] = JSON.parse(JSON.stringify(this.initialData.grades[grade]));
                    updated = true;
                    continue;
                }
                
                // Verificar campos de grado
                if (typeof data.grades[grade].unlocked === 'undefined') {
                    data.grades[grade].unlocked = grade === 1; // Solo el primer grado está desbloqueado por defecto
                    updated = true;
                }
                
                if (typeof data.grades[grade].completed === 'undefined') {
                    data.grades[grade].completed = false;
                    updated = true;
                }
                
                if (typeof data.grades[grade].stars === 'undefined') {
                    data.grades[grade].stars = 0;
                    updated = true;
                }
                
                // Verificar operaciones según el grado
                if (!data.grades[grade].operations) {
                    data.grades[grade].operations = JSON.parse(JSON.stringify(this.initialData.grades[grade].operations));
                    updated = true;
                    continue;
                }
                
                // Verificar todas las operaciones que deberían existir para este grado
                const expectedOps = Object.keys(this.initialData.grades[grade].operations);
                
                expectedOps.forEach(op => {
                    if (!data.grades[grade].operations[op]) {
                        data.grades[grade].operations[op] = JSON.parse(JSON.stringify(this.initialData.grades[grade].operations[op]));
                        updated = true;
                    } else {
                        // Verificar campos de la operación
                        const opData = data.grades[grade].operations[op];
                        
                        if (typeof opData.unlocked === 'undefined') {
                            opData.unlocked = op === 'addition'; // Solo suma está desbloqueada por defecto
                            updated = true;
                        }
                        
                        if (typeof opData.completed === 'undefined') {
                            opData.completed = false;
                            updated = true;
                        }
                        
                        if (typeof opData.stars === 'undefined') {
                            opData.stars = 0;
                            updated = true;
                        }
                        
                        if (typeof opData.correctCount === 'undefined') {
                            opData.correctCount = 0;
                            updated = true;
                        }
                        
                        if (typeof opData.totalCount === 'undefined') {
                            opData.totalCount = 0;
                            updated = true;
                        }
                        
                        if (typeof opData.precision === 'undefined') {
                            opData.precision = 0;
                            updated = true;
                        }
                        
                        if (typeof opData.lastPlayed === 'undefined') {
                            opData.lastPlayed = null;
                            updated = true;
                        }
                        
                        if (!Array.isArray(opData.history)) {
                            opData.history = [];
                            updated = true;
                        }
                    }
                });
            }
            
            return updated;
        } catch (error) {
            console.error('Error al verificar estructura de datos:', error);
            return false;
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
     * Obtiene la configuración
     * @returns {Object} Configuración
     */
    getConfig() {
        if (!this.configCache) {
            this.initializeConfig();
        }
        return this.configCache;
    },
    
    /**
     * Actualiza un valor de configuración
     * @param {string} key - Clave de configuración
     * @param {any} value - Nuevo valor
     */
    updateConfig(key, value) {
        try {
            const config = this.getConfig();
            
            // Verificar que la clave existe en la configuración
            if (typeof config[key] === 'undefined') {
                console.warn(`Clave de configuración desconocida: ${key}`);
                return;
            }
            
            // Actualizar valor
            config[key] = value;
            
            // Guardar configuración
            localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
            this.configCache = config;
            
            console.log(`Configuración actualizada: ${key} = ${value}`);
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
        }
    },
    
    /**
     * Guarda los datos de progreso
     * @param {Object} data - Datos a guardar
     */
    saveData(data) {
        try {
            // Actualizar fecha de última actividad
            data.lastActivity = new Date().toISOString();
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            this.dataCache = data; // Actualizar caché
        } catch (error) {
            console.error('Error al guardar datos:', error);
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
        
        // Registrar logro de desbloqueo
        this.addAchievement(`unlock_grade_${grade}`, `¡Desbloqueaste el grado ${grade}!`);
        
        console.log(`Grado ${grade} desbloqueado`);
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
            
            // Registrar logro de estrellas
            if (stars === 3) {
                this.addAchievement(`perfect_${grade}_${operation}`, `¡Perfección en ${operation} de ${grade}º grado!`);
            }
        }
        
        if (completed && !op.completed) {
            op.completed = true;
            
            // Registrar logro de completado
            this.addAchievement(`complete_${grade}_${operation}`, `¡Completaste ${operation} de ${grade}º grado!`);
        }
        
        // CAMBIO PRINCIPAL: Reemplazar en lugar de acumular los datos de precisión
        if (correctCount !== undefined && totalCount !== undefined) {
            // Almacenar historial
            if (!op.history) op.history = [];
            op.history.push({
                date: new Date().toISOString(),
                correctCount: correctCount,
                totalCount: totalCount,
                percent: Math.round((correctCount / totalCount) * 100)
            });
            
            // Mantener solo las últimas 10 sesiones en el historial
            if (op.history.length > 10) {
                op.history = op.history.slice(-10);
            }
            
            // Reemplazar los valores actuales con los de la última sesión
            op.correctCount = correctCount;
            op.totalCount = totalCount;
            op.precision = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
        }
        
        // Actualizar fecha de último juego
        op.lastPlayed = new Date().toISOString();
        
        // Actualizar estadísticas globales
        // Mantener las estadísticas de la sesión actual
        data.currentSession = {
            date: new Date().toISOString(),
            exercises: totalCount,
            correct: correctCount
        };
        
        // Acumular en estadísticas históricas solo para referencia
        data.totalExercises = (data.totalExercises || 0) + totalCount;
        data.totalCorrect = (data.totalCorrect || 0) + correctCount;
        data.globalPrecision = data.totalExercises > 0 ? 
            Math.round((data.totalCorrect / data.totalExercises) * 100) : 0;
        
        this.saveData(data);
        this.checkGradeComplete(grade);
        this.checkGradeUnlock(grade);
        // Verificar si se debe desbloquear la siguiente operación
        if (completed) {
            this.checkOperationUnlock(grade, operation);
        }    
    },
    
    /**
     * Verifica si se han completado todas las operaciones de un grado
     * @param {number} grade - Grado a verificar
     */
    checkGradeComplete(grade) {
        const data = this.getData();
        const gradeData = data.grades[grade];
        
        // Verificar si todas las operaciones están completadas
        const allCompleted = Object.values(gradeData.operations)
            .every(op => op.completed);
        
        if (allCompleted && !gradeData.completed) {
            // Marcar grado como completado
            gradeData.completed = true;
            
            // Calcular estrellas totales del grado
            const totalStars = Object.values(gradeData.operations)
                .reduce((sum, op) => sum + op.stars, 0);
            
            const maxPossibleStars = Object.keys(gradeData.operations).length * 3;
            const starsPercentage = (totalStars / maxPossibleStars) * 100;
            
            // Asignar estrellas al grado según porcentaje
            if (starsPercentage >= 90) {
                gradeData.stars = 3;
            } else if (starsPercentage >= 70) {
                gradeData.stars = 2;
            } else if (starsPercentage >= 50) {
                gradeData.stars = 1;
            }
            
            // Registrar logro de grado completado
            this.addAchievement(`complete_grade_${grade}`, `¡Completaste todos los ejercicios de ${grade}º grado!`);
            
            // Guardar cambios
            this.saveData(data);
        }
    },
    
    /**
     * Verifica si se debe desbloquear la siguiente operación
     * @param {number} grade - Grado actual
     * @param {string} currentOperation - Operación que se acaba de completar
     */
    checkOperationUnlock: function(grade, currentOperation) {
        try {
            const data = this.getData();
            const gradeData = data.grades[grade];
            
            // Obtener todas las operaciones disponibles para este grado
            const operations = Object.keys(gradeData.operations);
            
            // Encontrar el índice de la operación actual
            const currentIndex = operations.indexOf(currentOperation);
            
            // Si es la última operación o no se encuentra, no hacer nada
            if (currentIndex === -1 || currentIndex === operations.length - 1) {
                return;
            }
            
            // Obtener la siguiente operación
            const nextOperation = operations[currentIndex + 1];
            
            // Desbloquear la siguiente operación si la actual está completada
            if (gradeData.operations[currentOperation].completed && 
                !gradeData.operations[nextOperation].unlocked) {
                
                gradeData.operations[nextOperation].unlocked = true;
                this.saveData(data);
                
                console.log(`Operación ${nextOperation} desbloqueada en grado ${grade}`);
            }
        } catch (error) {
            console.error("Error al verificar desbloqueo de operación:", error);
        }
    },

    /**
     * Verifica si se debe desbloquear el siguiente grado
     * @param {number} currentGrade - Grado actual
     */
    checkGradeUnlock(currentGrade) {
        if (currentGrade >= 6) return; // No hay grado siguiente después del 6to
        
        const nextGrade = currentGrade + 1;
        const data = this.getData();
        
        // Verificar si el grado actual tiene al menos una operación completada
        const currentGradeData = data.grades[currentGrade];
        const hasCompletedOps = Object.values(currentGradeData.operations)
            .some(op => op.completed);
        
        if (hasCompletedOps && !data.grades[nextGrade].unlocked) {
            data.grades[nextGrade].unlocked = true;
            this.saveData(data);
            
            // Registrar logro de desbloqueo de grado
            this.addAchievement(`unlock_grade_${nextGrade}`, `¡Desbloqueaste el grado ${nextGrade}!`);
        }
    },
    
    /**
     * Añade un logro al registro de logros
     * @param {string} id - Identificador único del logro
     * @param {string} description - Descripción del logro
     */
    addAchievement(id, description) {
        try {
            const data = this.getData();
            
            // Verificar si el logro ya existe
            if (data.achievements.some(a => a.id === id)) {
                return; // El logro ya está registrado
            }
            
            // Agregar nuevo logro
            data.achievements.push({
                id,
                description,
                date: new Date().toISOString()
            });
            
            this.saveData(data);
            console.log(`Nuevo logro registrado: ${description}`);
            
            // Aquí se podría disparar un evento o mostrar una notificación
        } catch (error) {
            console.error('Error al registrar logro:', error);
        }
    },
    
    /**
     * Obtiene la lista de logros conseguidos
     * @returns {Array} Lista de logros
     */
    getAchievements() {
        const data = this.getData();
        return data.achievements || [];
    },
    
    /**
     * Reinicia todo el progreso
     */
    resetProgress() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.initialData));
            this.dataCache = JSON.parse(JSON.stringify(this.initialData));
            console.log('Progreso reiniciado correctamente');
        } catch (error) {
            console.error('Error al reiniciar progreso:', error);
        }
    },
    
    /**
     * Reinicia la configuración a valores predeterminados
     */
    resetConfig() {
        try {
            localStorage.removeItem(this.CONFIG_KEY);
            localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.defaultConfig));
            this.configCache = JSON.parse(JSON.stringify(this.defaultConfig));
            console.log('Configuración reiniciada correctamente');
        } catch (error) {
            console.error('Error al reiniciar configuración:', error);
        }
    },
    
    /**
     * Verifica si todas las operaciones de un grado están completas
     * @param {number} grade - Número de grado
     * @returns {boolean} true si todas están completas
     */
    isGradeCompleted(grade) {
        const gradeData = this.getGrade(grade);
        return gradeData && gradeData.completed;
    },
    
    /**
     * Verifica si una operación está desbloqueada
     * @param {number} grade - Grado escolar
     * @param {string} operation - Nombre de la operación
     * @returns {boolean} true si está desbloqueada
     */
    isOperationUnlocked: function(grade, operation) {
        try {
            const op = this.getOperation(grade, operation);
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
            const op = this.getOperation(grade, operation);
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
            if (!this.getOperation) return 0;
            
            const op = this.getOperation(grade, operation);
            return op ? op.stars : 0;
        } catch (error) {
            console.error("Error al obtener estrellas:", error);
            return 0;
        }
    },

    /**
     * Obtiene la precisión para una operación - MODIFICADO PARA MOSTRAR SOLO SESIÓN ACTUAL
     * @param {number} grade - Grado escolar
     * @param {string} operation - Nombre de la operación
     * @returns {Object} Objeto con la información de precisión
     */
    getOperationPrecision: function(grade, operation) {
        try {
            const op = this.getOperation(grade, operation);
            if (!op || typeof op.correctCount === 'undefined' || typeof op.totalCount === 'undefined' || op.totalCount === 0) {
                return { percent: 0, text: "0/0 intentos (0%)" };
            }
            
            // Usar solo los valores de la sesión actual (no acumulativos)
            const percent = op.precision;
            return { 
                percent, 
                text: `${op.correctCount}/${op.totalCount} intentos (${percent}%)` 
            };
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
     * Exporta todos los datos de progreso y configuración como JSON
     * @returns {string} Datos en formato JSON
     */
    exportData() {
        try {
            const exportObj = {
                progress: this.getData(),
                config: this.getConfig(),
                exported: new Date().toISOString()
            };
            
            return JSON.stringify(exportObj);
        } catch (error) {
            console.error('Error al exportar datos:', error);
            return null;
        }
    },
    
    /**
     * Importa datos previamente exportados
     * @param {string} jsonData - Datos en formato JSON
     * @returns {boolean} true si la importación fue exitosa
     */
    importData(jsonData) {
        try {
            const importObj = JSON.parse(jsonData);
            
            // Verificar que contiene las propiedades esperadas
            if (!importObj.progress || !importObj.config) {
                console.error('Datos de importación inválidos');
                return false;
            }
            
            // Asegurar estructura correcta de los datos
            const hasValidStructure = this.ensureDataStructure(importObj.progress);
            
            if (!hasValidStructure) {
                console.error('Los datos importados no tienen la estructura correcta');
                return false;
            }
            
            // Guardar datos importados
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(importObj.progress));
            localStorage.setItem(this.CONFIG_KEY, JSON.stringify(importObj.config));
            
            // Actualizar cache
            this.dataCache = importObj.progress;
            this.configCache = importObj.config;
            
            console.log('Datos importados correctamente');
            return true;
        } catch (error) {
            console.error('Error al importar datos:', error);
            return false;
        }
    }
};

// Inicializar cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    storage.initialize();
});

// Exportar para uso en otros módulos
window.storage = storage;