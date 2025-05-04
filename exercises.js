/**
 * Módulo para la generación y gestión de ejercicios matemáticos
 * Optimizado para cálculo mental y rendimiento
 * Versión 2.0 con soporte para pistas y dificultad progresiva
 */

const exercises = {
    // Configuración de ejercicios por grado
    config: {
        1: { // 1er grado
            exerciseCount: 20,
            theme: "sky", // Tema cielo
            mascotPhrases: {
                start: "¡Vamos a practicar matemáticas de 1er grado! ¿Estás listo?",
                correct: ["¡Muy bien!", "¡Excelente!", "¡Sigue así!", "¡Eres genial!"],
                incorrect: ["¡Inténtalo otra vez!", "¡No te preocupes, sigue practicando!", "¡Tú puedes!"],
                complete: "¡Felicidades! Has completado los ejercicios de 1er grado."
            },
            operations: {
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    color: "#4CAF50",
                    generator: function() {
                        // Suma simple para 1er grado (optimizada)
                        const max = 10;
                        const num1 = Math.floor(Math.random() * (max - 1)) + 1; // 1-9
                        const num2 = Math.floor(Math.random() * (max - num1)) + 1; // Suma no excede 10
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`,
                            hint: `Cuenta ${num1} y luego agrega ${num2} más.`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    color: "#2196F3",
                    generator: function() {
                        // Resta simple para 1er grado (optimizada)
                        const max = 10;
                        const num1 = Math.floor(Math.random() * max) + 1; // 1-10
                        const num2 = Math.floor(Math.random() * num1) + 1; // Asegura que num2 <= num1
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`,
                            hint: `Si tienes ${num1} y quitas ${num2}, ¿cuántos te quedan?`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    color: "#FF9800",
                    generator: function() {
                        // Multiplicación para 1er grado (SOLO tablas del 1 y 2, del 0 al 12)
                        const options = [1, 2]; // Solo tablas del 1 y 2
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 13); // 0-12 para incluir desde x0 hasta x12
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`,
                            hint: num1 === 1 ? 
                                `Cualquier número multiplicado por 1 es el mismo número.` : 
                                `Piensa en la tabla del 2: 2, 4, 6, 8...`
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    color: "#9C27B0",
                    generator: function() {
                        // División exactamente inversa a las tablas del 1 y 2
                        const divisorOptions = [1, 2]; // Solo divisores 1 y 2
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 13); // Valores de 0 a 12 (mismo rango que en multiplicación)
                        const dividend = divisor * quotient; // El dividendo es el resultado de la multiplicación
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`,
                            hint: divisor === 1 ? 
                                `Cualquier número dividido entre 1 es el mismo número.` : 
                                `Piensa en la tabla del 2 al revés. ¿Qué número multiplicado por 2 da ${dividend}?`
                        };
                    }
                }
            }
        },
        2: { // 2do grado
            exerciseCount: 20,
            theme: "forest", // Tema bosque
            mascotPhrases: {
                start: "¡Vamos a practicar matemáticas de 2do grado! Sé que puedes lograrlo.",
                correct: ["¡Increíble!", "¡Lo estás haciendo muy bien!", "¡Sigue así, campeón!", "¡Esa es la respuesta correcta!"],
                incorrect: ["¡No te rindas!", "¡Analiza el problema nuevamente!", "¡Casi lo logras, sigue intentando!"],
                complete: "¡Felicidades! Has completado todos los ejercicios de 2do grado. ¡Eres asombroso!"
            },
            operations: {
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    color: "#4CAF50",
                    generator: function() {
                        // Suma con decenas completas o múltiplos de 5
                        const options = [
                            // Suma a decenas exactas: 35 + 5 = 40
                            () => {
                                const tens = Math.floor(Math.random() * 5) + 1; // 1-5
                                const units = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num1 = tens * 10 + units; // 11-59
                                const num2 = 10 - units; // Lo que falta para llegar a decena
                                return { num1, num2, hint: `Primero completa a la decena: ${num1} + ${10-units} = ${tens*10+10}, luego resta: ${tens*10+10} - ${(10-units)-num2} = ${num1+num2}` };
                            },
                            // Sumas de decenas exactas: 20 + 30 = 50
                            () => {
                                const tens1 = Math.floor(Math.random() * 5) + 1; // 1-5
                                const tens2 = Math.floor(Math.random() * 5) + 1; // 1-5
                                return { 
                                    num1: tens1 * 10, 
                                    num2: tens2 * 10,
                                    hint: `Puedes pensar en ${tens1} + ${tens2} = ${tens1+tens2} y agregar el cero: ${tens1+tens2}0`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`,
                            hint: hint || `Intenta hacer la suma por partes: decenas primero, luego unidades.`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    color: "#2196F3",
                    generator: function() {
                        // Resta de decenas exactas o números pequeños
                        const options = [
                            // Restas de decenas exactas: 50 - 30 = 20
                            () => {
                                const tens1 = Math.floor(Math.random() * 5) + 3; // 3-7
                                const tens2 = Math.floor(Math.random() * (tens1 - 1)) + 1; // 1-(tens1-1)
                                return { 
                                    num1: tens1 * 10, 
                                    num2: tens2 * 10,
                                    hint: `Puedes pensar en ${tens1} - ${tens2} = ${tens1-tens2} y agregar el cero: ${tens1-tens2}0`
                                };
                            },
                            // Restas pequeñas: 45 - 5 = 40
                            () => {
                                const tens = Math.floor(Math.random() * 5) + 1; // 1-5
                                const units = Math.floor(Math.random() * 9) + 1; // 1-9
                                return { 
                                    num1: tens * 10 + units, 
                                    num2: units,
                                    hint: `Si quitas ${units} de ${tens * 10 + units}, te quedan exactamente ${tens}0`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`,
                            hint: hint || `Primero resta las decenas, luego las unidades.`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    color: "#FF9800",
                    generator: function() {
                        // Multiplicación para 2do grado (tablas del 1 al 4, del 0 al 12)
                        const options = [1, 2, 3, 4]; // Tablas del 1 al 4
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 13); // 0-12 para incluir desde x0 hasta x12
                        
                        let hint = '';
                        if (num2 === 0) {
                            hint = `Cualquier número multiplicado por 0 siempre es 0.`;
                        } else if (num2 === 1) {
                            hint = `Cualquier número multiplicado por 1 es el mismo número.`;
                        } else if (num1 === 2) {
                            hint = `Piensa en la tabla del 2: 2, 4, 6, 8...`;
                        } else if (num1 === 3) {
                            hint = `Piensa en la tabla del 3: 3, 6, 9, 12...`;
                        } else if (num1 === 4) {
                            hint = `Piensa en la tabla del 4: 4, 8, 12, 16...`;
                        }
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`,
                            hint
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    color: "#9C27B0",
                    generator: function() {
                        // División exactamente inversa a las tablas del 1 al 4
                        const divisorOptions = [1, 2, 3, 4]; // Divisores del 1 al 4
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 13); // Valores de 0 a 12 (mismo rango que en multiplicación)
                        const dividend = divisor * quotient; // El dividendo es el resultado de la multiplicación
                        
                        let hint = '';
                        if (divisor === 1) {
                            hint = `Cualquier número dividido entre 1 es el mismo número.`;
                        } else if (quotient === 0) {
                            hint = `0 dividido entre cualquier número siempre es 0.`;
                        } else if (divisor === 2) {
                            hint = `Piensa en la tabla del 2 al revés. ¿Qué número multiplicado por 2 da ${dividend}?`;
                        } else if (divisor === 3) {
                            hint = `Piensa en la tabla del 3 al revés. ¿Qué número multiplicado por 3 da ${dividend}?`;
                        } else if (divisor === 4) {
                            hint = `Piensa en la tabla del 4 al revés. ¿Qué número multiplicado por 4 da ${dividend}?`;
                        }
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`,
                            hint
                        };
                    }
                }
            }
        },
        3: { // 3er grado
            exerciseCount: 15,
            theme: "desert", // Tema desierto
            mascotPhrases: {
                start: "¡Vamos a practicar matemáticas de 3er grado! Estos ejercicios te ayudarán a mejorar tus habilidades.",
                correct: ["¡Brillante!", "¡Esa es la respuesta correcta!", "¡Tu esfuerzo está dando resultados!", "¡Excelente razonamiento!"],
                incorrect: ["¡Revisa tu cálculo y vuelve a intentarlo!", "¡No te desanimes, casi lo tienes!", "¡Recuerda los métodos que hemos practicado!"],
                complete: "¡Felicidades! Has completado los ejercicios de 3er grado. ¡Tus habilidades matemáticas están creciendo!"
            },
            operations: {
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    color: "#4CAF50",
                    generator: function() {
                        // Sumas con números "amigables"
                        const options = [
                            // Sumas a centenas exactas: 80 + 20 = 100
                            () => {
                                const base = 100;
                                const num1 = Math.floor(Math.random() * 8) * 10 + 10; // 10, 20, 30...80
                                const num2 = base - num1;
                                return { 
                                    num1, 
                                    num2,
                                    hint: `Busca completar la centena: ¿Cuánto le falta a ${num1} para llegar a 100?`
                                };
                            },
                            // Sumas de centenas exactas: 200 + 300 = 500
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 1; // 1-5
                                const hundreds2 = Math.floor(Math.random() * 4) + 1; // 1-4
                                return { 
                                    num1: hundreds1 * 100, 
                                    num2: hundreds2 * 100,
                                    hint: `Suma primero los dígitos de las centenas: ${hundreds1} + ${hundreds2} = ${hundreds1 + hundreds2}, luego agrega los ceros: ${hundreds1 + hundreds2}00`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`,
                            hint: hint || `Intenta descomponer los números por posición y sumar por separado.`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    color: "#2196F3",
                    generator: function() {
                        // Restas con números "amigables"
                        const options = [
                            // Restas de centenas exactas: 500 - 200 = 300
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 3; // 3-7
                                const hundreds2 = Math.floor(Math.random() * (hundreds1 - 1)) + 1; // 1-(hundreds1-1)
                                return { 
                                    num1: hundreds1 * 100, 
                                    num2: hundreds2 * 100,
                                    hint: `Resta las centenas: ${hundreds1} - ${hundreds2} = ${hundreds1 - hundreds2}, luego agrega los ceros: ${hundreds1 - hundreds2}00`
                                };
                            },
                            // Restas tipo: 100 - 25 = 75
                            () => {
                                const base = 100;
                                const num2 = Math.floor(Math.random() * 4) * 25 + 25; // 25, 50, 75, 100
                                return { 
                                    num1: base, 
                                    num2,
                                    hint: `Puedes pensar en fracciones: ${num2} es ${num2/25}/4 de 100, así que la respuesta es ${(100-num2)}`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`,
                            hint: hint || `Descompón los números y resta por posición.`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    color: "#FF9800",
                    generator: function() {
                        // Multiplicación para 3er grado (tablas del 1 al 6, del 0 al 12)
                        const options = [1, 2, 3, 4, 5, 6]; // Tablas del 1 al 6
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 13); // 0-12 para incluir desde x0 hasta x12
                        
                        // Pistas personalizadas según el caso
                        let hint = '';
                        if (num2 === 0) {
                            hint = `Cualquier número multiplicado por 0 siempre es 0.`;
                        } else if (num2 === 1) {
                            hint = `Cualquier número multiplicado por 1 es el mismo número.`;
                        } else if (num1 === 5) {
                            hint = `Las multiplicaciones por 5 terminan en 0 o 5. Si el número es par, termina en 0; si es impar, termina en 5.`;
                        } else if (num1 === 10) {
                            hint = `Para multiplicar por 10, solo agrega un 0 al final del número.`;
                        } else {
                            hint = `Recuerda la tabla del ${num1}: ${num1}, ${num1*2}, ${num1*3}...`;
                        }
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`,
                            hint
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    color: "#9C27B0",
                    generator: function() {
                        // División exactamente inversa a las tablas del 1 al 6
                        const divisorOptions = [1, 2, 3, 4, 5, 6]; // Divisores del 1 al 6
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 13); // Valores de 0 a 12 (mismo rango que en multiplicación)
                        const dividend = divisor * quotient; // El dividendo es el resultado de la multiplicación
                        
                        let hint = '';
                        if (divisor === 1) {
                            hint = `Cualquier número dividido entre 1 es el mismo número.`;
                        } else if (quotient === 0) {
                            hint = `0 dividido entre cualquier número siempre es 0.`;
                        } else if (divisor === 2) {
                            hint = `Piensa si ${dividend} es par o impar. Si es par, puedes dividir entre 2 fácilmente.`;
                        } else if (divisor === 5) {
                            hint = `Para dividir entre 5, piensa en fracciones de 100. Por ejemplo, 5 es 1/20 de 100.`;
                        } else {
                            hint = `Piensa en la tabla del ${divisor} al revés. ¿Qué número multiplicado por ${divisor} da ${dividend}?`;
                        }
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`,
                            hint
                        };
                    }
                }
            }
        },
        4: { // 4to grado
            exerciseCount: 15,
            theme: "space", // Tema espacio
            mascotPhrases: {
                start: "¡Vamos a explorar matemáticas de 4to grado! ¡Prepárate para desafíos más interesantes!",
                correct: ["¡Impresionante!", "¡Excelente trabajo!", "¡Eres todo un matemático!", "¡Sigue con ese buen razonamiento!"],
                incorrect: ["¡Revisa tu estrategia!", "¡Intenta visualizar el problema de otra manera!", "¡No te rindas, estás cerca!"],
                complete: "¡Felicitaciones! Has dominado los ejercicios de 4to grado. ¡Tu viaje matemático es asombroso!"
            },
            operations: {
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    color: "#4CAF50",
                    generator: function() {
                        // Sumas de números "amigables"
                        const options = [
                            // Suma de centenas: 300 + 400 = 700
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 1; // 1-5
                                const hundreds2 = Math.floor(Math.random() * 5) + 1; // 1-5
                                return { 
                                    num1: hundreds1 * 100, 
                                    num2: hundreds2 * 100,
                                    hint: `Suma las centenas: ${hundreds1} + ${hundreds2} = ${hundreds1 + hundreds2}, luego agrega los ceros: ${hundreds1 + hundreds2}00`
                                };
                            },
                            // Suma de múltiplos de 25: 25 + 75 = 100
                            () => {
                                const multiples = [25, 50, 75, 100];
                                const num1 = multiples[Math.floor(Math.random() * 3)]; // 25, 50, 75
                                const num2 = multiples[Math.floor(Math.random() * 3)]; // 25, 50, 75
                                return { 
                                    num1, 
                                    num2,
                                    hint: `Piensa en fracciones: ${num1} es ${num1/25}/4 de 100 y ${num2} es ${num2/25}/4 de 100. Juntos son ${(num1+num2)/25}/4 de 100, o sea ${num1+num2}.`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`,
                            hint: hint || `Busca patrones e intenta usar la descomposición por valor posicional.`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    color: "#2196F3",
                    generator: function() {
                        // Restas de números "amigables"
                        const options = [
                            // Resta tipo: 100 - 25 = 75
                            () => {
                                const bases = [100, 200, 500, 1000];
                                const base = bases[Math.floor(Math.random() * bases.length)];
                                const num2 = Math.floor(Math.random() * 4) * 25 + 25; // 25, 50, 75, 100
                                return { 
                                    num1: base, 
                                    num2: num2,
                                    hint: `${num2} es ${num2/(base/100)}/4 de ${base}, así que la respuesta es ${base - num2}`
                                };
                            },
                            // Resta tipo: 500 - 200 = 300
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 5; // 5-9
                                const hundreds2 = Math.floor(Math.random() * (hundreds1 - 1)) + 1; // 1-(hundreds1-1)
                                return { 
                                    num1: hundreds1 * 100, 
                                    num2: hundreds2 * 100,
                                    hint: `Resta las centenas: ${hundreds1} - ${hundreds2} = ${hundreds1 - hundreds2}, luego agrega los ceros: ${hundreds1 - hundreds2}00`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`,
                            hint: hint || `Intenta descomponer los números para hacer la resta más fácil.`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    color: "#FF9800",
                    generator: function() {
                        // Multiplicación para 4to grado (tablas del 1 al 8, del 0 al 12)
                        const options = [1, 2, 3, 4, 5, 6, 7, 8]; // Tablas del 1 al 8
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 13); // 0-12 para incluir desde x0 hasta x12
                        
                        // Estrategias específicas según el caso
                        let hint = '';
                        if (num2 === 0) {
                            hint = `Cualquier número multiplicado por 0 siempre es 0.`;
                        } else if (num2 === 1) {
                            hint = `Cualquier número multiplicado por 1 es el mismo número.`;
                        } else if (num1 === 5) {
                            hint = `Para multiplicar por 5, puedes multiplicar por 10 y dividir entre 2.`;
                        } else if (num1 === 10) {
                            hint = `Para multiplicar por 10, solo agrega un 0 al final del número.`;
                        } else if (num1 === 8) {
                            hint = `Para multiplicar por 8, puedes multiplicar por 2 tres veces consecutivas.`;
                        } else if (num1 === 4) {
                            hint = `Para multiplicar por 4, puedes multiplicar por 2 dos veces.`;
                        } else {
                            hint = `Intenta descomponer: ${num1} × ${num2} = ${num1} × ${Math.floor(num2/2)} × 2 = ${num1 * Math.floor(num2/2)} × 2 = ${num1 * num2}`;
                        }
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`,
                            hint
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    color: "#9C27B0",
                    generator: function() {
                        // División exactamente inversa a las tablas del 1 al 8
                        const divisorOptions = [1, 2, 3, 4, 5, 6, 7, 8]; // Divisores del 1 al 8
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 13); // Valores de 0 a 12 (mismo rango que en multiplicación)
                        const dividend = divisor * quotient; // El dividendo es el resultado de la multiplicación
                        
                        let hint = '';
                        if (divisor === 1) {
                            hint = `Cualquier número dividido entre 1 es el mismo número.`;
                        } else if (quotient === 0) {
                            hint = `0 dividido entre cualquier número siempre es 0.`;
                        } else if (divisor === 2) {
                            hint = `Para dividir entre 2, determina si el número es par o impar y luego divide.`;
                        } else if (divisor === 5) {
                            hint = `Para dividir entre 5, multiplica por 2 y divide entre 10.`;
                        } else if (divisor === 10) {
                            hint = `Para dividir entre 10, simplemente quita el último dígito.`;
                        } else {
                            hint = `Piensa en la tabla del ${divisor} al revés. ¿Qué número multiplicado por ${divisor} da ${dividend}?`;
                        }
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`,
                            hint
                        };
                    }
                }
            }
        },
        5: { // 5to grado
            exerciseCount: 12,
            theme: "ocean", // Tema océano
            mascotPhrases: {
                start: "¡Bienvenido a los ejercicios de 5to grado! Aquí aplicaremos estrategias más avanzadas.",
                correct: ["¡Fantástico razonamiento!", "¡Dominas este tema!", "¡Tu habilidad matemática es impresionante!", "¡Excelente aplicación de estrategias!"],
                incorrect: ["¡Revisa tu procedimiento paso a paso!", "¡Intenta aplicar otra estrategia!", "¡Recuerda que hay múltiples formas de resolver esto!"],
                complete: "¡Felicitaciones! Has superado los retos de 5to grado. ¡Estás desarrollando una gran capacidad analítica!"
            },
            operations: {
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    color: "#4CAF50",
                    generator: function() {
                        // Sumas de números "amigables" para cálculo mental
                        const options = [
                            // Suma de múltiplos de 25: 75 + 125 = 200
                            () => {
                                const multiples = [25, 50, 75, 100, 125, 150, 175];
                                const num1 = multiples[Math.floor(Math.random() * multiples.length)];
                                const num2 = multiples[Math.floor(Math.random() * multiples.length)];
                                return { 
                                    num1, 
                                    num2,
                                    hint: `Puedes pensar: ${num1} = ${num1/25} × 25 y ${num2} = ${num2/25} × 25. Sumando: (${num1/25} + ${num2/25}) × 25 = ${(num1+num2)/25} × 25 = ${num1+num2}`
                                };
                            },
                            // Suma para completar a 100/1000: 65 + 35 = 100
                            () => {
                                const target = [100, 1000][Math.floor(Math.random() * 2)];
                                const offset = target === 100 ? 
                                    Math.floor(Math.random() * 80) + 10 : // 10-89 para 100
                                    Math.floor(Math.random() * 800) + 100; // 100-899 para 1000
                                return { 
                                    num1: offset, 
                                    num2: target - offset,
                                    hint: `Búsca identificar que ${offset} + ? = ${target}. La diferencia es ${target - offset}.`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`,
                            hint: hint || `Intenta descomponer los números para facilitar la suma.`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    color: "#2196F3",
                    generator: function() {
                        // Restas con números "amigables"
                        const options = [
                            // Restas desde 100/1000: 100 - 75 = 25
                            () => {
                                const base = [100, 1000][Math.floor(Math.random() * 2)];
                                const multiples = base === 100 ? [25, 50, 75] : [250, 500, 750];
                                const num2 = multiples[Math.floor(Math.random() * multiples.length)];
                                return { 
                                    num1: base, 
                                    num2,
                                    hint: `${num2} es ${num2/(base/100)}/4 de ${base}, así que quedan ${base - num2}`
                                };
                            },
                            // Restas entre números redondos: 500 - 300 = 200
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 7) + 3; // 3-9
                                const hundreds2 = Math.floor(Math.random() * hundreds1); // 0-(hundreds1-1)
                                return { 
                                    num1: hundreds1 * 100, 
                                    num2: hundreds2 * 100,
                                    hint: `Resta las centenas: ${hundreds1} - ${hundreds2} = ${hundreds1 - hundreds2}, luego agrega los ceros: ${hundreds1 - hundreds2}00`
                                };
                            }
                        ];
                        
                        const { num1, num2, hint } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`,
                            hint: hint || `Intenta usar el método de compensación para hacer la resta más sencilla.`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    color: "#FF9800",
                    generator: function() {
                        // Multiplicación para 5to grado (tablas del 1 al 10, del 0 al 12)
                        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Tablas del 1 al 10
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 13); // 0-12 para incluir desde x0 hasta x12
                        
                        // Estrategias específicas según el caso
                        let hint = '';
                        if (num2 === 0) {
                            hint = `Cualquier número multiplicado por 0 siempre es 0.`;
                        } else if (num2 === 1) {
                            hint = `Cualquier número multiplicado por 1 es el mismo número.`;
                        } else if (num1 === 9) {
                            hint = `Para multiplicar por 9: multiplica por 10 y resta una vez el número. ${num2} × 9 = ${num2} × 10 - ${num2} = ${num2*10} - ${num2} = ${num1*num2}`;
                        } else if (num1 === 5) {
                            hint = `Para multiplicar por 5: multiplica por 10 y divide entre 2. ${num2} × 5 = ${num2} × 10 ÷ 2 = ${num2*10} ÷ 2 = ${num1*num2}`;
                        } else if (num1 === 10) {
                            hint = `Para multiplicar por 10, solo agrega un 0 al final del número: ${num2} × 10 = ${num2}0`;
                        } else {
                            hint = `Intenta descomponer en factores más simples: ${num1} × ${num2} podría ser más fácil como ${num1} × ${Math.floor(num2/2)} × 2`;
                        }
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`,
                            hint
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    color: "#9C27B0",
                    generator: function() {
                        // División exactamente inversa a las tablas del 1 al 10
                        const divisorOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Divisores del 1 al 10
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 13); // Valores de 0 a 12 (mismo rango que en multiplicación)
                        const dividend = divisor * quotient; // El dividendo es el resultado de la multiplicación
                        
                        let hint = '';
                        if (divisor === 1) {
                            hint = `Cualquier número dividido entre 1 es el mismo número.`;
                        } else if (quotient === 0) {
                            hint = `0 dividido entre cualquier número siempre es 0.`;
                        } else if (divisor === 10) {
                            hint = `Para dividir entre 10, quita el último dígito (o desplaza un lugar el punto decimal).`;
                        } else if (divisor === 5) {
                            hint = `Para dividir entre 5, multiplica por 2 y luego divide entre 10.`;
                        } else if (divisor === 9) {
                            hint = `Recuerda la tabla del 9: 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108...`;
                        } else {
                            hint = `Piensa en la tabla del ${divisor} al revés. ¿Qué número multiplicado por ${divisor} da ${dividend}?`;
                        }
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`,
                            hint
                        };
                    }
                },
                fractions: {
                    name: "Fracciones",
                    icon: "fa-chart-pie",
                    color: "#E91E63",
                    generator: function() {
                        // Fracciones comunes y sencillas
                        const options = [
                            // Fracciones equivalentes: 1/2 = ?/10
                            () => {
                                const fractions = [
                                    {num: 1, den: 2, equiv: 5, totDen: 10},
                                    {num: 1, den: 4, equiv: 25, totDen: 100},
                                    {num: 3, den: 4, equiv: 75, totDen: 100},
                                    {num: 1, den: 5, equiv: 2, totDen: 10}
                                ];
                                const selected = fractions[Math.floor(Math.random() * fractions.length)];
                                return {
                                    num1: selected.num,
                                    num2: selected.den,
                                    num3: selected.equiv,
                                    num4: selected.totDen,
                                    correctAnswer: selected.equiv,
                                    display: `Si ${selected.num}/${selected.den} = ?/${selected.totDen}, entonces ? = `,
                                    hint: `Multiplica el numerador y denominador por el mismo número: ${selected.num} × ${selected.totDen/selected.den} = ${selected.equiv} y ${selected.den} × ${selected.totDen/selected.den} = ${selected.totDen}`
                                };
                            },
                            // Fracciones de cantidades: 1/4 de 20 = ?
                            () => {
                                const fractions = [
                                    {num: 1, den: 2, text: "1/2"},
                                    {num: 1, den: 4, text: "1/4"},
                                    {num: 3, den: 4, text: "3/4"},
                                    {num: 1, den: 5, text: "1/5"},
                                    {num: 2, den: 5, text: "2/5"}
                                ];
                                const selected = fractions[Math.floor(Math.random() * fractions.length)];
                                const quantities = [10, 20, 25, 50, 100];
                                const quantity = quantities[Math.floor(Math.random() * quantities.length)];
                                const result = (selected.num * quantity) / selected.den;
                                return {
                                    num1: selected.num,
                                    num2: selected.den,
                                    num3: quantity,
                                    correctAnswer: result,
                                    display: `¿Cuánto es ${selected.text} de ${quantity}?`,
                                    hint: `Divide ${quantity} entre ${selected.den} para obtener 1/${selected.den}, luego multiplica por ${selected.num}: ${quantity} ÷ ${selected.den} × ${selected.num} = ${quantity/selected.den} × ${selected.num} = ${result}`
                                };
                            }
                        ];
                        
                        const result = options[Math.floor(Math.random() * options.length)]();
                        result.operator = '/';
                        return result;
                    }
                },
                decimals: {
                    name: "Decimales",
                    icon: "fa-circle-dot",
                    color: "#00BCD4",
                    generator: function() {
                        // Operaciones con decimales amigables
                        const options = [
                            // Suma de decimales: 1.5 + 0.5 = 2
                            () => {
                                const decimals = [0.5, 1.5, 2.5, 0.25, 0.75];
                                const num1 = decimals[Math.floor(Math.random() * decimals.length)];
                                const num2 = decimals[Math.floor(Math.random() * decimals.length)];
                                return {
                                    num1,
                                    num2,
                                    operator: '+',
                                    correctAnswer: Math.round((num1 + num2) * 100) / 100,
                                    display: `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?`,
                                    hint: `Puedes convertir a fracciones: ${num1} = ${num1*100}/100 y ${num2} = ${num2*100}/100, luego sumar: (${num1*100} + ${num2*100})/100 = ${(num1+num2)*100}/100 = ${num1+num2}`
                                };
                            },
                            // Multiplicación de decimal por entero: 0.5 × 6 = 3
                            () => {
                                const decimals = [0.5, 0.25, 0.1];
                                const num1 = decimals[Math.floor(Math.random() * decimals.length)];
                                const num2 = Math.floor(Math.random() * 9) + 1; // 1-9
                                return {
                                    num1,
                                    num2, 
                                    operator: '×',
                                    correctAnswer: Math.round(num1 * num2 * 100) / 100,
                                    display: `${num1.toFixed(2)} × ${num2} = ?`,
                                    hint: `Piensa en ${num1} como fracción: ${num1} = ${num1*100}/100, entonces ${num1} × ${num2} = (${num1*100}/100) × ${num2} = ${num1*num2*100}/100 = ${num1*num2}`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                }
            }
        },
        6: { // 6to grado
            exerciseCount: 10,
            theme: "volcano", // Tema volcán
            mascotPhrases: {
                start: "¡Bienvenido a los desafíos de 6to grado! Apliquemos todo lo que has aprendido.",
                correct: ["¡Excelente razonamiento matemático!", "¡Estás dominando conceptos avanzados!", "¡Tu comprensión numérica es impresionante!", "¡Gran trabajo aplicando múltiples estrategias!"],
                incorrect: ["¡Analiza el problema desde otro ángulo!", "¡Intenta aplicar diferentes propiedades numéricas!", "¡No te desanimes, estos conceptos requieren práctica!"],
                complete: "¡Felicidades! Has completado los ejercicios de 6to grado. ¡Tienes un gran futuro matemático por delante!"
            },
            operations: {
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    color: "#4CAF50",
                    generator: function() {
                        // Suma con múltiplos y patrones
                        const options = [
                            // Suma para completar miles: 750 + 250 = 1000
                            () => {
                                const target = 1000;
                                const multiples = [250, 500, 750];
                                const num1 = multiples[Math.floor(Math.random() * multiples.length)];
                                const num2 = target - num1;
                                return { 
                                    num1, 
                                    num2,
                                    hint: `Busca completar el millar: ${num1} + ? = 1000. La diferencia es ${num2}.`
                                };
                            },
                            // Suma de decimales: 2.5 + 1.75 = 4.25
                            () => {
                                const decimals = [0.5, 1.5, 2.5, 0.75, 1.75, 0.25];
                                const num1 = decimals[Math.floor(Math.random() * decimals.length)];
                                const num2 = decimals[Math.floor(Math.random() * decimals.length)];
                                return { 
                                    num1, 
                                    num2, 
                                    correctAnswer: Math.round((num1 + num2) * 100) / 100,
                                    display: `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?`,
                                    hint: `Convierte a la misma fracción decimal: ${num1} = ${num1*100}/100 y ${num2} = ${num2*100}/100, luego suma: (${num1*100} + ${num2*100})/100 = ${(num1+num2)*100}/100 = ${num1+num2}`
                                };
                            }
                        ];
                        
                        const result = options[Math.floor(Math.random() * options.length)]();
                        if (!result.operator) result.operator = '+';
                        if (!result.correctAnswer) result.correctAnswer = result.num1 + result.num2;
                        if (!result.display) result.display = `${result.num1} + ${result.num2} = ?`;
                        return result;
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    color: "#2196F3",
                    generator: function() {
                        // Restas estratégicas
                        const options = [
                            // Resta de miles: 1000 - 250 = 750
                            () => {
                                const base = 1000;
                                const multiples = [250, 500, 750];
                                const num2 = multiples[Math.floor(Math.random() * multiples.length)];
                                return { 
                                    num1: base, 
                                    num2,
                                    hint: `${num2} es ${num2/10}/4 de 1000, así que la resta es ${base - num2}`
                                };
                            },
                            // Resta de decimales: 5 - 0.5 = 4.5
                            () => {
                                const bases = [5, 10];
                                const base = bases[Math.floor(Math.random() * bases.length)];
                                const decimals = [0.5, 0.25, 0.75];
                                const num2 = decimals[Math.floor(Math.random() * decimals.length)];
                                return { 
                                    num1: base, 
                                    num2, 
                                    correctAnswer: base - num2,
                                    display: `${base} - ${num2.toFixed(2)} = ?`,
                                    hint: `Convierte a decimales con el mismo número de dígitos: ${base} = ${base.toFixed(2)} y ${num2.toFixed(2)}, luego resta posicionalmente.`
                                };
                            }
                        ];
                        
                        const result = options[Math.floor(Math.random() * options.length)]();
                        if (!result.correctAnswer) result.correctAnswer = result.num1 - result.num2;
                        if (!result.display) result.display = `${result.num1} - ${result.num2} = ?`;
                        if (!result.operator) result.operator = '-';
                        return result;
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    color: "#FF9800",
                    generator: function() {
                        // Multiplicación para 6to grado (tablas del 1 al 12, del 0 al 12)
                        const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Tablas del 1 al 12
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 13); // 0-12 para incluir desde x0 hasta x12
                        
                        // Estrategias específicas según el caso
                        let hint = '';
                        if (num2 === 0) {
                            hint = `Cualquier número multiplicado por 0 siempre es 0.`;
                        } else if (num2 === 1) {
                            hint = `Cualquier número multiplicado por 1 es el mismo número.`;
                        } else if (num1 === 11) {
                            hint = `Para multiplicar por 11 números de un dígito: suma el dígito consigo mismo y coloca el resultado en medio. Ej: 11×4 = 44, 11×9 = 99`;
                        } else if (num1 === 12) {
                            hint = `Para multiplicar por 12, puedes multiplicar por 10 y luego sumar dos veces el número: ${num2} × 12 = ${num2} × 10 + ${num2} × 2 = ${num2*10} + ${num2*2} = ${num1*num2}`;
                        } else if (num1 === 9) {
                            hint = `Para multiplicar por 9, multiplica por 10 y resta una vez el número: ${num2} × 9 = ${num2} × 10 - ${num2} = ${num2*10} - ${num2} = ${num1*num2}`;
                        } else {
                            hint = `Intenta descomponer: ${num1} × ${num2} podría verse como ${Math.floor(num1/2)} × ${num2} × 2 o como ${num1} × ${Math.floor(num2/2)} × 2`;
                        }
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`,
                            hint
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    color: "#9C27B0",
                    generator: function() {
                        // División exactamente inversa a las tablas del 1 al 12
                        const divisorOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Divisores del 1 al 12
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 13); // Valores de 0 a 12 (mismo rango que en multiplicación)
                        const dividend = divisor * quotient; // El dividendo es el resultado de la multiplicación
                        
                        let hint = '';
                        if (divisor === 1) {
                            hint = `Cualquier número dividido entre 1 es el mismo número.`;
                        } else if (quotient === 0) {
                            hint = `0 dividido entre cualquier número siempre es 0.`;
                        } else if (divisor === 10) {
                            hint = `Para dividir entre 10, quita el último dígito o desplaza un lugar el punto decimal.`;
                        } else if (divisor === 5) {
                            hint = `Para dividir entre 5, multiplica por 2 y luego divide entre 10.`;
                        } else if (divisor === 11) {
                            hint = `Recuerda la tabla del 11: 11, 22, 33, 44, 55, 66, 77, 88, 99, 110, 121, 132...`;
                        } else if (divisor === 12) {
                            hint = `Piensa en factores: 12 = 3 × 4, así que puedes dividir primero entre 3 y luego entre 4.`;
                        } else {
                            hint = `Piensa en la tabla del ${divisor} al revés. ¿Qué número multiplicado por ${divisor} da ${dividend}?`;
                        }
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`,
                            hint
                        };
                    }
                },
                fractions: {
                    name: "Fracciones",
                    icon: "fa-chart-pie",
                    color: "#E91E63",
                    generator: function() {
                        // Operaciones simples con fracciones
                        const options = [
                            // Suma/resta de fracciones con mismo denominador: 1/4 + 2/4 = 3/4
                            () => {
                                const denominators = [2, 4, 5, 10];
                                const denominator = denominators[Math.floor(Math.random() * denominators.length)];
                                const numerator1 = Math.floor(Math.random() * (denominator - 1)) + 1;
                                const numerator2 = Math.floor(Math.random() * (denominator - 1)) + 1;
                                const isAddition = Math.random() > 0.3;
                                
                                if (isAddition) {
                                    return {
                                        num1: numerator1,
                                        num2: denominator,
                                        num3: numerator2,
                                        num4: denominator,
                                        operator: '+',
                                        correctAnswer: numerator1 + numerator2,
                                        display: `${numerator1}/${denominator} + ${numerator2}/${denominator} = ?/${denominator}`,
                                        hint: `Con el mismo denominador, solo suma los numeradores: ${numerator1} + ${numerator2} = ${numerator1 + numerator2}`
                                    };
                                } else {
                                    // Para resta, asegurar que numerator1 > numerator2
                                    const max = Math.max(numerator1, numerator2);
                                    const min = Math.min(numerator1, numerator2);
                                    return {
                                        num1: max,
                                        num2: denominator,
                                        num3: min,
                                        num4: denominator,
                                        operator: '-',
                                        correctAnswer: max - min,
                                        display: `${max}/${denominator} - ${min}/${denominator} = ?/${denominator}`,
                                        hint: `Con el mismo denominador, solo resta los numeradores: ${max} - ${min} = ${max - min}`
                                    };
                                }
                            },
                            // Fracción de cantidad: 3/4 de 40 = 30
                            () => {
                                const fractions = [
                                    {num: 1, den: 2, text: "1/2"},
                                    {num: 1, den: 4, text: "1/4"},
                                    {num: 3, den: 4, text: "3/4"},
                                    {num: 1, den: 5, text: "1/5"},
                                    {num: 2, den: 5, text: "2/5"}
                                ];
                                const selected = fractions[Math.floor(Math.random() * fractions.length)];
                                const quantities = [20, 40, 50, 100, 200];
                                const quantity = quantities[Math.floor(Math.random() * quantities.length)];
                                const result = (selected.num * quantity) / selected.den;
                                return {
                                    num1: selected.num,
                                    num2: selected.den,
                                    num3: quantity,
                                    operator: '/',
                                    correctAnswer: result,
                                    display: `¿Cuánto es ${selected.text} de ${quantity}?`,
                                    hint: `Divide ${quantity} entre ${selected.den} y multiplica por ${selected.num}: ${quantity} ÷ ${selected.den} × ${selected.num} = ${quantity/selected.den} × ${selected.num} = ${result}`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                },
                decimals: {
                    name: "Decimales",
                    icon: "fa-circle-dot",
                    color: "#00BCD4",
                    generator: function() {
                        // Operaciones con decimales comunes
                        const options = [
                            // Suma de decimales: 1.25 + 0.75 = 2
                            () => {
                                const decimals = [0.25, 0.5, 0.75, 1.25, 1.5, 1.75];
                                const num1 = decimals[Math.floor(Math.random() * decimals.length)];
                                const num2 = decimals[Math.floor(Math.random() * decimals.length)];
                                return {
                                    num1,
                                    num2,
                                    operator: '+',
                                    correctAnswer: Math.round((num1 + num2) * 100) / 100,
                                    display: `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?`,
                                    hint: `Asegúrate de alinear los puntos decimales y sumar por columnas.`
                                };
                            },
                            // Multiplicación por 0.1, 0.5: 6 × 0.5 = 3
                            () => {
                                const decimals = [0.1, 0.5, 0.25];
                                const num2 = decimals[Math.floor(Math.random() * decimals.length)];
                                const num1 = Math.floor(Math.random() * 19) + 2; // 2-20
                                return {
                                    num1,
                                    num2,
                                    operator: '×',
                                    correctAnswer: Math.round(num1 * num2 * 100) / 100,
                                    display: `${num1} × ${num2.toFixed(2)} = ?`,
                                    hint: num2 === 0.1 ? 
                                        `Multiplicar por 0.1 es como dividir entre 10: ${num1} × 0.1 = ${num1} ÷ 10 = ${num1*0.1}` : 
                                        num2 === 0.5 ? 
                                        `Multiplicar por 0.5 es como dividir entre 2: ${num1} × 0.5 = ${num1} ÷ 2 = ${num1*0.5}` :
                                        `Multiplicar por 0.25 es como dividir entre 4: ${num1} × 0.25 = ${num1} ÷ 4 = ${num1*0.25}`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                },
                powers: {
                    name: "Potencias",
                    icon: "fa-superscript",
                    color: "#795548",
                    generator: function() {
                        // Potencias simples para cálculo mental
                        const options = [
                            // Cuadrados: 9² = 81
                            () => {
                                const bases = [2, 3, 4, 5, 6, 7, 8, 9, 10];
                                const base = bases[Math.floor(Math.random() * bases.length)];
                                return {
                                    num1: base,
                                    num2: 2,
                                    operator: '^',
                                    correctAnswer: base * base,
                                    display: `${base}² = ?`,
                                    hint: `El cuadrado de un número es el número multiplicado por sí mismo: ${base} × ${base} = ${base*base}`
                                };
                            },
                            // Cubos: 3³ = 27 (solo para números pequeños)
                            () => {
                                const bases = [2, 3, 4, 5];
                                const base = bases[Math.floor(Math.random() * bases.length)];
                                return {
                                    num1: base,
                                    num2: 3,
                                    operator: '^',
                                    correctAnswer: base * base * base,
                                    display: `${base}³ = ?`,
                                    hint: `El cubo de un número es el número multiplicado por sí mismo tres veces: ${base} × ${base} × ${base} = ${base*base*base}`
                                };
                            },
                            // Potencias de 10: 10⁴ = 10000
                            () => {
                                const base = 10;
                                const exponent = Math.floor(Math.random() * 4) + 1; // 1-4
                                return {
                                    num1: base,
                                    num2: exponent,
                                    operator: '^',
                                    correctAnswer: Math.pow(base, exponent),
                                    display: `${base}^${exponent} = ?`,
                                    hint: `Para calcular 10 elevado a una potencia, escribe 1 seguido de ${exponent} ceros: 1${'0'.repeat(exponent)}`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                },
                percentages: {
                    name: "Porcentajes",
                    icon: "fa-percent",
                    color: "#607D8B",
                    generator: function() {
                        // Porcentajes comunes
                        const options = [
                            // 10%, 25%, 50%, 75% de un número
                            () => {
                                const percentages = [10, 25, 50, 75];
                                const percent = percentages[Math.floor(Math.random() * percentages.length)];
                                const baseOptions = [20, 40, 50, 100, 200, 400];
                                const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];
                                
                                let hint = '';
                                if (percent === 10) {
                                    hint = `10% es 1/10 del número: ${base} ÷ 10 = ${base/10}`;
                                } else if (percent === 25) {
                                    hint = `25% es 1/4 del número: ${base} ÷ 4 = ${base/4}`;
                                } else if (percent === 50) {
                                    hint = `50% es la mitad del número: ${base} ÷ 2 = ${base/2}`;
                                } else if (percent === 75) {
                                    hint = `75% es 3/4 del número: 3 × (${base} ÷ 4) = 3 × ${base/4} = ${base*0.75}`;
                                }
                                
                                return {
                                    num1: percent,
                                    num2: base,
                                    operator: '%',
                                    correctAnswer: (base * percent) / 100,
                                    display: `${percent}% de ${base} = ?`,
                                    hint
                                };
                            },
                            // Porcentaje que representa una parte de 100: 25 es qué % de 100
                            () => {
                                const parts = [10, 20, 25, 30, 40, 50, 60, 75, 80];
                                const part = parts[Math.floor(Math.random() * parts.length)];
                                const whole = 100;
                                
                                return {
                                    num1: part,
                                    num2: whole,
                                    operator: '%',
                                    correctAnswer: part, // El porcentaje es el mismo número
                                    display: `¿Qué porcentaje de ${whole} es ${part}?`,
                                    hint: `En una base de 100, el número ${part} representa directamente el ${part}% del total.`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                }
            }
        }
    },
    
    // Funciones utilitarias
    findGCD: function(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        if (b === 0) return a;
        return this.findGCD(b, a % b);
    },
    
    /**
     * Genera ejercicios para un grado y operación específicos
     * @param {number} grade - Grado escolar
     * @param {string} operation - Operación a practicar
     * @returns {Array} Lista de ejercicios generados
     */
    generateExercises: function(grade, operation) {
        try {
            const gradeConfig = this.config[grade];
            if (!gradeConfig) return [];
            
            const operationConfig = gradeConfig.operations[operation];
            if (!operationConfig) return [];
            
            const count = gradeConfig.exerciseCount;
            const result = [];
            
            // Aumentar intentos para garantizar que se generen todos los ejercicios
            const maxAttempts = count * 5; // Multiplicamos por 5 para dar más oportunidades
            let attempts = 0;
            
            for (let i = 0; i < count && attempts < maxAttempts; attempts++) {
                try {
                    const exercise = operationConfig.generator();
                    
                    // Validar que el ejercicio es correcto
                    if (!exercise || typeof exercise.correctAnswer === 'undefined') {
                        console.warn("Ejercicio inválido generado:", exercise);
                        continue;
                    }
                    
                    // Verificamos que no se repita exactamente el mismo ejercicio
                    // Solo comparamos num1, num2 y operador para permitir más variación
                    const isDuplicate = result.some(ex => 
                        ex.num1 === exercise.num1 && 
                        ex.num2 === exercise.num2 && 
                        ex.operator === exercise.operator
                    );
                    
                    if (!isDuplicate) {
                        result.push(exercise);
                        i++; // Sólo incrementamos i si añadimos un ejercicio
                    }
                } catch (error) {
                    console.error("Error generando ejercicio:", error);
                }
            }
            
            // Si no se generaron suficientes ejercicios, rellenar con variaciones
            if (result.length < count) {
                const missing = count - result.length;
                console.warn(`No se pudieron generar ${missing} ejercicios únicos para ${operation} en grado ${grade}.`);
                
                // Añadir ejercicios modificados levemente para completar
                for (let i = 0; i < missing && i < result.length; i++) {
                    const baseExercise = {...result[i]};
                    // Modificamos ligeramente para que no sea exactamente igual
                    if (baseExercise.num1) baseExercise.num1 += 100;
                    if (baseExercise.display) {
                        baseExercise.display = baseExercise.display.replace('?', '?');
                    }
                    result.push(baseExercise);
                }
            }
            
            return result;
        } catch (error) {
            console.error("Error en generateExercises:", error);
            return [];
        }
    },
    
    /**
     * Verifica si la respuesta del usuario es correcta
     * @param {Object} exercise - Ejercicio actual
     * @param {string} answer - Respuesta del usuario
     * @returns {boolean} true si la respuesta es correcta
     */
    checkAnswer: function(exercise, answer) {
        try {
            // Convertir a número y comparar
            const userAnswer = parseFloat(answer);
            
            if (isNaN(userAnswer)) return false;
            
            // Para decimales, permitir cierta tolerancia
            if (exercise.operator === '+' || exercise.operator === '×' || exercise.operator === '÷') {
                const diff = Math.abs(userAnswer - exercise.correctAnswer);
                return diff < 0.01; // Tolerancia para decimales
            }
            
            return userAnswer === exercise.correctAnswer;
        } catch (error) {
            console.error("Error verificando respuesta:", error);
            return false;
        }
    },
    
    /**
     * Obtiene una pista para un ejercicio
     * @param {Object} exercise - Ejercicio actual
     * @returns {string} Pista para resolver el ejercicio
     */
    getHint: function(exercise) {
        if (exercise.hint) return exercise.hint;
        
        // Pistas genéricas por operación
        switch (exercise.operator) {
            case '+':
                return "Intenta sumar por columnas, primero las unidades, luego las decenas.";
            case '-':
                return "Recuerda que puedes descomponer el número mayor para facilitar la resta.";
            case '×':
                return "Intenta multiplicar dígito por dígito y luego suma los resultados.";
            case '÷':
                return "Piensa en la tabla de multiplicar del divisor.";
            case '/':
                return "Recuerda que una fracción representa una división.";
            case '%':
                return "Un porcentaje es una fracción de 100. Para calcular X% de Y, multiplica Y por X/100.";
            case '^':
                return "Una potencia significa multiplicar el número base por sí mismo tantas veces como indique el exponente.";
            default:
                return "Analiza el problema paso a paso.";
        }
    }
};
// Exportar para uso en otros módulos
window.exercises = exercises;