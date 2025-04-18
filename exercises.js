/**
 * Módulo para la generación y gestión de ejercicios matemáticos
 * Optimizado para cálculo mental y rendimiento
 */

const exercises = {
    // Configuración de ejercicios por grado
    config: {
        1: { // 1er grado
            exerciseCount: 20, // Corregido a 20 ejercicios
            operations: {
                // El resto del código para 1er grado permanece igual...
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
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
                            display: `${num1} + ${num2} = ?`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
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
                            display: `${num1} - ${num2} = ?`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    generator: function() {
                        // Multiplicación básica (tablas del 1, 2 y 5)
                        const options = [1, 2, 5];
                        const num1 = options[Math.floor(Math.random() * options.length)];
                        const num2 = Math.floor(Math.random() * 5) + 1; // 1-5
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    generator: function() {
                        // División simple con más variedad
                        const divisorOptions = [1, 2, 3, 4, 5]; // Ampliamos a más divisores
                        const divisor = divisorOptions[Math.floor(Math.random() * divisorOptions.length)];
                        const quotient = Math.floor(Math.random() * 5) + 1; // 1-5 
                        const dividend = divisor * quotient; // Asegura división exacta
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`
                        };
                    }
                }
            }
        },
        2: { // 2do grado
            exerciseCount: 20, // Corregido a 20 ejercicios
            operations: {
                // El resto del código para 2do grado permanece igual...
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    generator: function() {
                        // Suma con decenas completas o múltiplos de 5
                        const options = [
                            // Suma a decenas exactas: 35 + 5 = 40
                            () => {
                                const tens = Math.floor(Math.random() * 5) + 1; // 1-5
                                const units = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num1 = tens * 10 + units; // 11-59
                                const num2 = 10 - units; // Lo que falta para llegar a decena
                                return { num1, num2 };
                            },
                            // Sumas de decenas exactas: 20 + 30 = 50
                            () => {
                                const tens1 = Math.floor(Math.random() * 5) + 1; // 1-5
                                const tens2 = Math.floor(Math.random() * 5) + 1; // 1-5
                                return { num1: tens1 * 10, num2: tens2 * 10 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    generator: function() {
                        // Resta de decenas exactas o números pequeños
                        const options = [
                            // Restas de decenas exactas: 50 - 30 = 20
                            () => {
                                const tens1 = Math.floor(Math.random() * 5) + 3; // 3-7
                                const tens2 = Math.floor(Math.random() * (tens1 - 1)) + 1; // 1-(tens1-1)
                                return { num1: tens1 * 10, num2: tens2 * 10 };
                            },
                            // Restas pequeñas: 45 - 5 = 40
                            () => {
                                const tens = Math.floor(Math.random() * 5) + 1; // 1-5
                                const units = Math.floor(Math.random() * 9) + 1; // 1-9
                                return { num1: tens * 10 + units, num2: units };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    generator: function() {
                        // Multiplicación de tablas del 1 al 5
                        const num1 = Math.floor(Math.random() * 5) + 1; // 1-5
                        const num2 = Math.floor(Math.random() * 5) + 1; // 1-5
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    generator: function() {
                        // División con divisores 2, 5
                        const divisors = [2, 5];
                        const divisor = divisors[Math.floor(Math.random() * divisors.length)];
                        const quotient = Math.floor(Math.random() * 5) + 1; // 1-5
                        const dividend = divisor * quotient;
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`
                        };
                    }
                }
            }
        },
        3: { // 3er grado
            exerciseCount: 15, // Corregido a 15 ejercicios
            operations: {
                // El resto del código para 3er grado permanece igual...
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    generator: function() {
                        // Sumas con números "amigables"
                        const options = [
                            // Sumas a centenas exactas: 80 + 20 = 100
                            () => {
                                const base = 100;
                                const num1 = Math.floor(Math.random() * 8) * 10 + 10; // 10, 20, 30...80
                                const num2 = base - num1;
                                return { num1, num2 };
                            },
                            // Sumas de centenas exactas: 200 + 300 = 500
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 1; // 1-5
                                const hundreds2 = Math.floor(Math.random() * 4) + 1; // 1-4
                                return { num1: hundreds1 * 100, num2: hundreds2 * 100 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    generator: function() {
                        // Restas con números "amigables"
                        const options = [
                            // Restas de centenas exactas: 500 - 200 = 300
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 3; // 3-7
                                const hundreds2 = Math.floor(Math.random() * (hundreds1 - 1)) + 1; // 1-(hundreds1-1)
                                return { num1: hundreds1 * 100, num2: hundreds2 * 100 };
                            },
                            // Restas tipo: 100 - 25 = 75
                            () => {
                                const base = 100;
                                const num2 = Math.floor(Math.random() * 4) * 25 + 25; // 25, 50, 75, 100
                                return { num1: base, num2 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    generator: function() {
                        // Multiplicación por 10, 5, dobles
                        const options = [
                            // Multiplicación por 10: 7 × 10 = 70
                            () => {
                                const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num2 = 10;
                                return { num1, num2 };
                            },
                            // Multiplicación por 5: 6 × 5 = 30
                            () => {
                                const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num2 = 5;
                                return { num1, num2 };
                            },
                            // Dobles: 7 × 2 = 14
                            () => {
                                const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num2 = 2;
                                return { num1, num2 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    generator: function() {
                        // División por 10, 5, 2
                        const divisors = [2, 5, 10];
                        const divisor = divisors[Math.floor(Math.random() * divisors.length)];
                        const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
                        const dividend = divisor * quotient;
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`
                        };
                    }
                }
            }
        },
        4: { // 4to grado
            exerciseCount: 15, // Corregido a 15 ejercicios
            operations: {
                // El resto del código para 4to grado permanece igual...
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    generator: function() {
                        // Sumas de números "amigables"
                        const options = [
                            // Suma de centenas: 300 + 400 = 700
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 1; // 1-5
                                const hundreds2 = Math.floor(Math.random() * 5) + 1; // 1-5
                                return { num1: hundreds1 * 100, num2: hundreds2 * 100 };
                            },
                            // Suma de múltiplos de 25: 25 + 75 = 100
                            () => {
                                const multiples = [25, 50, 75, 100];
                                const num1 = multiples[Math.floor(Math.random() * 3)]; // 25, 50, 75
                                const num2 = multiples[Math.floor(Math.random() * 3)]; // 25, 50, 75
                                return { num1, num2 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    generator: function() {
                        // Restas de números "amigables"
                        const options = [
                            // Resta tipo: 100 - 25 = 75
                            () => {
                                const bases = [100, 200, 500, 1000];
                                const base = bases[Math.floor(Math.random() * bases.length)];
                                const num2 = Math.floor(Math.random() * 4) * 25 + 25; // 25, 50, 75, 100
                                return { num1: base, num2: num2 };
                            },
                            // Resta tipo: 500 - 200 = 300
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 5) + 5; // 5-9
                                const hundreds2 = Math.floor(Math.random() * (hundreds1 - 1)) + 1; // 1-(hundreds1-1)
                                return { num1: hundreds1 * 100, num2: hundreds2 * 100 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    generator: function() {
                        // Multiplicación con factores amigables
                        const options = [
                            // Multiplicación por 10/100: 7 × 10 = 70
                            () => {
                                const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num2 = [10, 100][Math.floor(Math.random() * 2)];
                                return { num1, num2 };
                            },
                            // Multiplicación por 5: 12 × 5 = 60
                            () => {
                                const num1 = Math.floor(Math.random() * 19) + 1; // 1-19
                                const num2 = 5;
                                return { num1, num2 };
                            },
                            // Multiplicación por 25: 4 × 25 = 100
                            () => {
                                const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num2 = 25;
                                return { num1, num2 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    generator: function() {
                        // División con divisores amigables
                        const options = [
                            // División por 10: 70 ÷ 10 = 7
                            () => {
                                const divisor = 10;
                                const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            },
                            // División por 5: 35 ÷ 5 = 7
                            () => {
                                const divisor = 5;
                                const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            },
                            // División por 2: 14 ÷ 2 = 7
                            () => {
                                const divisor = 2;
                                const quotient = Math.floor(Math.random() * 9) + 1; // 1-9
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            }
                        ];
                        
                        const { dividend, divisor, quotient } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`
                        };
                    }
                }
            }
        },
        5: { // 5to grado
            exerciseCount: 12, // Corregido a 12 ejercicios (no 10)
            operations: {
                // El resto del código para 5to grado permanece igual...
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    generator: function() {
                        // Sumas de números "amigables" para cálculo mental
                        const options = [
                            // Suma de múltiplos de 25: 75 + 125 = 200
                            () => {
                                const multiples = [25, 50, 75, 100, 125, 150, 175];
                                const num1 = multiples[Math.floor(Math.random() * multiples.length)];
                                const num2 = multiples[Math.floor(Math.random() * multiples.length)];
                                return { num1, num2 };
                            },
                            // Suma para completar a 100/1000: 65 + 35 = 100
                            () => {
                                const target = [100, 1000][Math.floor(Math.random() * 2)];
                                const offset = target === 100 ? 
                                    Math.floor(Math.random() * 80) + 10 : // 10-89 para 100
                                    Math.floor(Math.random() * 800) + 100; // 100-899 para 1000
                                return { num1: offset, num2: target - offset };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '+',
                            correctAnswer: num1 + num2,
                            display: `${num1} + ${num2} = ?`
                        };
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    generator: function() {
                        // Restas con números "amigables"
                        const options = [
                            // Restas desde 100/1000: 100 - 75 = 25
                            () => {
                                const base = [100, 1000][Math.floor(Math.random() * 2)];
                                const multiples = base === 100 ? [25, 50, 75] : [250, 500, 750];
                                const num2 = multiples[Math.floor(Math.random() * multiples.length)];
                                return { num1: base, num2 };
                            },
                            // Restas entre números redondos: 500 - 300 = 200
                            () => {
                                const hundreds1 = Math.floor(Math.random() * 7) + 3; // 3-9
                                const hundreds2 = Math.floor(Math.random() * hundreds1); // 0-(hundreds1-1)
                                return { num1: hundreds1 * 100, num2: hundreds2 * 100 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '-',
                            correctAnswer: num1 - num2,
                            display: `${num1} - ${num2} = ?`
                        };
                    }
                },
                multiplication: {
                    name: "Multiplicación",
                    icon: "fa-xmark",
                    generator: function() {
                        // Multiplicación con factores estratégicos
                        const options = [
                            // Multiplicación por 25: 4 × 25 = 100
                            () => {
                                const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
                                const num2 = 25;
                                return { num1, num2 };
                            },
                            // Multiplicación por 11: 9 × 11 = 99
                            () => {
                                const num1 = Math.floor(Math.random() * 9) + 1; // 1-9
                                const num2 = 11;
                                return { num1, num2 };
                            },
                            // Multiplicación por 5: 15 × 5 = 75
                            () => {
                                const num1 = Math.floor(Math.random() * 19) + 1; // 1-19
                                const num2 = 5;
                                return { num1, num2 };
                            }
                        ];
                        
                        const { num1, num2 } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1,
                            num2,
                            operator: '×',
                            correctAnswer: num1 * num2,
                            display: `${num1} × ${num2} = ?`
                        };
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    generator: function() {
                        // División con divisores estratégicos
                        const options = [
                            // División por 10: 450 ÷ 10 = 45
                            () => {
                                const divisor = 10;
                                const quotient = Math.floor(Math.random() * 90) + 10; // 10-99
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            },
                            // División por 5: 125 ÷ 5 = 25
                            () => {
                                const divisor = 5;
                                const quotient = Math.floor(Math.random() * 19) + 1; // 1-19
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            },
                            // División por 25: 100 ÷ 25 = 4
                            () => {
                                const divisor = 25;
                                const quotient = Math.floor(Math.random() * 8) + 2; // 2-9
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            }
                        ];
                        
                        const { dividend, divisor, quotient } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: `${dividend} ÷ ${divisor} = ?`
                        };
                    }
                },
                fractions: {
                    name: "Fracciones",
                    icon: "fa-chart-pie",
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
                                    display: `Si ${selected.num}/${selected.den} = ?/${selected.totDen}, entonces ? = `
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
                                    display: `¿Cuánto es ${selected.text} de ${quantity}?`
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
                                    display: `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?`
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
                                    display: `${num1.toFixed(2)} × ${num2} = ?`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                }
            }
        },
        6: { // 6to grado
            exerciseCount: 10, // Corregido a 10 ejercicios
            operations: {
                // El resto del código para 6to grado permanece igual...
                addition: {
                    name: "Suma",
                    icon: "fa-plus",
                    generator: function() {
                        // Suma con múltiplos y patrones
                        const options = [
                            // Suma para completar miles: 750 + 250 = 1000
                            () => {
                                const target = 1000;
                                const multiples = [250, 500, 750];
                                const num1 = multiples[Math.floor(Math.random() * multiples.length)];
                                const num2 = target - num1;
                                return { num1, num2 };
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
                                    display: `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?` 
                                };
                            }
                        ];
                        
                        const result = options[Math.floor(Math.random() * options.length)]();
                        if (!result.operator) result.operator = '+';
                        return result;
                    }
                },
                subtraction: {
                    name: "Resta",
                    icon: "fa-minus",
                    generator: function() {
                        // Restas estratégicas
                        const options = [
                            // Resta de miles: 1000 - 250 = 750
                            () => {
                                const base = 1000;
                                const multiples = [250, 500, 750];
                                const num2 = multiples[Math.floor(Math.random() * multiples.length)];
                                return { num1: base, num2 };
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
                                    display: `${base} - ${num2.toFixed(2)} = ?` 
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
                    generator: function() {
                        // Multiplicación estratégica
                        const options = [
                            // Multiplicación por potencias de 10: 45 × 100 = 4500
                            () => {
                                const num1 = Math.floor(Math.random() * 90) + 10; // 10-99
                                const num2 = [10, 100][Math.floor(Math.random() * 2)];
                                return { num1, num2 };
                            },
                            // Multiplicación por 25: 12 × 25 = 300
                            () => {
                                const num1 = Math.floor(Math.random() * 15) + 2; // 2-16
                                const num2 = 25;
                                return { num1, num2 };
                            },
                            // Multiplicación por 0.5 (mitad): 18 × 0.5 = 9
                            () => {
                                const num1 = Math.floor(Math.random() * 19) + 2; // 2-20
                                const num2 = 0.5;
                                return { 
                                    num1, 
                                    num2, 
                                    correctAnswer: num1 * num2,
                                    display: `${num1} × ${num2.toFixed(1)} = ?` 
                                };
                            }
                        ];
                        
                        const result = options[Math.floor(Math.random() * options.length)]();
                        if (!result.correctAnswer) result.correctAnswer = result.num1 * result.num2;
                        if (!result.display) result.display = `${result.num1} × ${result.num2} = ?`;
                        result.operator = '×';
                        return result;
                    }
                },
                division: {
                    name: "División",
                    icon: "fa-divide",
                    generator: function() {
                        // División estratégica
                        const options = [
                            // División por potencias de 10: 4500 ÷ 100 = 45
                            () => {
                                const divisors = [10, 100];
                                const divisor = divisors[Math.floor(Math.random() * divisors.length)];
                                const quotient = Math.floor(Math.random() * 90) + 10; // 10-99
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            },
                            // División por 25: 250 ÷ 25 = 10
                            () => {
                                const divisor = 25;
                                const quotient = Math.floor(Math.random() * 9) + 2; // 2-10
                                const dividend = divisor * quotient;
                                return { dividend, divisor, quotient };
                            },
                            // División por 0.5 (doble): 15 ÷ 0.5 = 30
                            () => {
                                const divisor = 0.5;
                                const dividend = Math.floor(Math.random() * 25) + 5; // 5-29
                                const quotient = dividend / divisor;
                                return { 
                                    dividend, 
                                    divisor, 
                                    quotient,
                                    display: `${dividend} ÷ ${divisor.toFixed(1)} = ?` 
                                };
                            }
                        ];
                        
                        const { dividend, divisor, quotient, display } = options[Math.floor(Math.random() * options.length)]();
                        
                        return {
                            num1: dividend,
                            num2: divisor,
                            operator: '÷',
                            correctAnswer: quotient,
                            display: display || `${dividend} ÷ ${divisor} = ?`
                        };
                    }
                },
                fractions: {
                    name: "Fracciones",
                    icon: "fa-chart-pie",
                    generator: function() {
                        // Resto del código para fracciones permanece igual...
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
                                        display: `${numerator1}/${denominator} + ${numerator2}/${denominator} = ?/${denominator}`
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
                                        display: `${max}/${denominator} - ${min}/${denominator} = ?/${denominator}`
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
                                    display: `¿Cuánto es ${selected.text} de ${quantity}?`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                },
                decimals: {
                    name: "Decimales",
                    icon: "fa-circle-dot",
                    generator: function() {
                        // Resto del código para decimales permanece igual...
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
                                    display: `${num1.toFixed(2)} + ${num2.toFixed(2)} = ?`
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
                                    display: `${num1} × ${num2.toFixed(2)} = ?`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                },
                powers: {
                    name: "Potencias",
                    icon: "fa-superscript",
                    generator: function() {
                        // Resto del código para potencias permanece igual...
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
                                    display: `${base}² = ?`
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
                                    display: `${base}³ = ?`
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
                                    display: `${base}^${exponent} = ?`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                },
                percentages: {
                    name: "Porcentajes",
                    icon: "fa-percent",
                    generator: function() {
                        // Resto del código para porcentajes permanece igual...
                        // Porcentajes comunes
                        const options = [
                            // 10%, 25%, 50%, 75% de un número
                            () => {
                                const percentages = [10, 25, 50, 75];
                                const percent = percentages[Math.floor(Math.random() * percentages.length)];
                                const baseOptions = [20, 40, 50, 100, 200, 400];
                                const base = baseOptions[Math.floor(Math.random() * baseOptions.length)];
                                
                                return {
                                    num1: percent,
                                    num2: base,
                                    operator: '%',
                                    correctAnswer: (base * percent) / 100,
                                    display: `${percent}% de ${base} = ?`
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
                                    display: `¿Qué porcentaje de ${whole} es ${part}?`
                                };
                            }
                        ];
                        
                        return options[Math.floor(Math.random() * options.length)]();
                    }
                }
            }
        }
    },
    
    // El resto del código permanece igual, incluyendo findGCD, generateExercises y checkAnswer
    findGCD: function(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        if (b === 0) return a;
        return this.findGCD(b, a % b);
    },
    
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
    }
};