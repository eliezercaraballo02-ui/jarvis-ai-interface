export function procesarMensaje(textoUsuario) {
    textoUsuario = textoUsuario.toLowerCase();

    // PASO 1: detectar matemáticas primero
    const math = detectarMatematica(textoUsuario);
    if (math) return math;

    // PASO 2: buscar en base de datos
    for (let item of baseDeDatos) {

        const normalizar = (t) =>
    t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const coincide = item.claves.some(clave =>
    normalizar(textoUsuario).includes(normalizar(clave))
);


        if (coincide) {

            // si es función
            if (typeof item.respuesta === "function") {
                return item.respuesta(textoUsuario);
            }

            // si es texto
            return item.respuesta;
        }
    }

    // PASO FINAL
    return "No tengo información sobre eso aún.";
}
function detectarMatematica(texto) {

    const esMatematica =
    /[0-9]\s*[\+\-\*\/]\s*[0-9]/.test(texto) ||
    [
        "mas", "menos", "por", "entre",
        "cuanto", "calcula", "resultado",
        "doble", "mitad", "triple"
    ].some(p => texto.includes(p));
    

    if (!esMatematica) return null;

    const match = texto.match(/[0-9+\-*/().\s]+/g);

    if (!match) return null;

    const operacion = match.join("").trim();

    if (!/^[0-9+\-*/().\s]+$/.test(operacion)) return null;

    try {
        const resultado = Function('"use strict"; return (' + operacion + ')')();
        return `🧠 El resultado es: ${resultado}`;
    } catch (e) {
        return null;
    }
}

let estadoJarvis = {
    humor: "neutral",
    ultimaInteraccion: Date.now()
};

function actualizarEstado() {
    const ahora = Date.now();
    const tiempo = ahora - estadoJarvis.ultimaInteraccion;

    if (tiempo < 60000) estadoJarvis.humor = "activo";
    else if (tiempo < 300000) estadoJarvis.humor = "neutral";
    else estadoJarvis.humor = "reposo";

    estadoJarvis.ultimaInteraccion = ahora;
}

function responderAleatorio(respuestas) {
    return respuestas[Math.floor(Math.random() * respuestas.length)];
}

export const baseDeDatos = [

    // ===================== 🧠 PRESENTACIÓN =====================
    {
        claves: [ "como te llamas", "mi nombre es", "yo soy", "mi nombre", "presentarme"],
        respuesta: function(nombre = "usuario") {
            return `Hola ${nombre}. Soy Robotina, un prototipo de inteligencia artificial diseñado como asistente holográfico. Estoy listo para ayudarte con información, respuestas y acciones programadas.`;
        },
        animacion: "Talking"
    },

    // ===================== 👋 SALUDO =====================
    {
        claves: [
            "hola", "holaa", "holaaa", "ola", "hi", "hello",
            "buenas", "buenos dias", "buenas tardes", "buenas noches",
            "saludos", "que tal", "klk", "qlq", "que lo que",
            "toy aqui", "activo", "ey", "hey", "buen día"
        ],
        respuesta: () => responderAleatorio([
            "Sistema holográfico activo. Antes de comenzar, ¿cuál es tu nombre?",
            "Hola, estoy en línea y listo para responder.",
            "Saludos. ¿En qué puedo ayudarte hoy?",
            "Conexión establecida. Dime cómo te ayudo."
        ]),
        animacion: "Wave"
    },

    // ===================== 🤖 QUIÉN ERES =====================
    {
        claves: ["quien eres", "que eres", "quien eres tu", "tu nombre", "como te llamas"],
        respuesta: () => responderAleatorio([
            "Soy un asistente inteligente tipo Jarvis diseñado para ayudarte con información y control del sistema.",
            "Soy un prototipo de IA conversacional con respuestas programadas.",
            "Soy tu asistente virtual, preparado para responder preguntas y ejecutar lógica básica."
        ]),
        animacion: "Talking"
    },

    // ===================== 💬 ESTADO =====================
    {
        claves: ["como estas", "estas bien", "como te sientes", "todo bien", "que tal estas"],
        respuesta: () => responderAleatorio([
            "Operativo y funcionando con normalidad.",
            "Todos los sistemas estables.",
            "Procesando información sin errores.",
            "Estoy listo para continuar."
        ]),
        animacion: "Talking"
    },

    // ===================== ⚙️ ACTIVIDAD =====================
    {
        claves: ["que haces", "en que estas", "ocupado", "que estas haciendo", "que haces ahora"],
        respuesta: () => responderAleatorio([
            "Procesando datos del sistema.",
            "Analizando información en tiempo real.",
            "Esperando nuevas instrucciones.",
            "Monitoreando la conversación y preparando respuestas."
        ]),
        animacion: "Talking"
    },

    // ===================== ⏰ HORA =====================
    {
        claves: ["hora", "que hora es", "dime la hora", "hora actual"],
        respuesta: () => `La hora actual es ${new Date().toLocaleTimeString()}`,
        animacion: "Talking"
    },

    // ===================== 📅 FECHA =====================
    {
        claves: ["fecha", "que dia es", "hoy", "fecha actual", "que dia estamos"],
        respuesta: () => `Hoy es ${new Date().toLocaleDateString()}`,
        animacion: "Talking"
    },

    // ===================== 🌙 MOMENTO DEL DÍA =====================
    {
        claves: ["buen dia", "buenas", "buenas tardes", "buenas noches", "saludo de dia"],
        respuesta: () => responderAleatorio([
            "Espero que estés teniendo un gran día.",
            "Que tengas una excelente jornada.",
            "Espero que todo vaya muy bien hoy."
        ]),
        animacion: "Wave"
    },

    // ===================== 💻 PROGRAMACIÓN =====================
    {
        claves: ["programacion", "codigo", "javascript", "html", "css", "python", "code", "programar", "desarrollo"],
        respuesta: () => responderAleatorio([
            "La programación es el lenguaje que conecta humanos con máquinas mediante instrucciones.",
            "Programar es darle lógica a una computadora para que haga tareas específicas.",
            "El código permite crear aplicaciones, páginas web, sistemas y automatizaciones."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧠 IA =====================
    {
        claves: ["inteligencia artificial", "ia", "ai", "machine learning", "aprendizaje automatico", "chatbot"],
        respuesta: () => responderAleatorio([
            "La inteligencia artificial permite que los sistemas aprendan y tomen decisiones basadas en datos.",
            "La IA busca simular algunas capacidades humanas como conversar, reconocer patrones y predecir resultados.",
            "Es una tecnología que ayuda a automatizar tareas y analizar información de forma inteligente."
        ]),
        animacion: "Talking"
    },

    // ===================== 🤖 ROBÓTICA =====================
    {
        claves: ["robotica", "robot", "robots", "androide", "automatizacion"],
        respuesta: () => responderAleatorio([
            "La robótica es la rama que diseña máquinas capaces de realizar tareas automáticas.",
            "Un robot puede combinar sensores, programación y mecanismos para actuar en el mundo real.",
            "La robótica une electrónica, mecánica e inteligencia artificial."
        ]),
        animacion: "Talking"
    },

    // ===================== 🌐 INTERNET =====================
    {
        claves: ["internet", "web", "red", "pagina web", "sitio web", "navegador"],
        respuesta: () => responderAleatorio([
            "Internet es una red global que conecta dispositivos para compartir información.",
            "La web permite acceder a páginas, servicios y contenidos desde un navegador.",
            "Internet es la base de muchas aplicaciones, plataformas y sistemas modernos."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧮 MATEMÁTICAS =====================
    {
        claves: ["matematicas", "algebra", "numeros", "ecuacion", "aritmetica", "geometria"],
        respuesta: () => responderAleatorio([
            "Las matemáticas son el lenguaje universal de patrones y relaciones.",
            "Sirven para resolver problemas, medir, calcular y analizar estructuras.",
            "Son fundamentales en ciencia, tecnología, economía e ingeniería."
        ]),
        animacion: "Talking"
    },

    // ===================== 🌍 CIENCIA =====================
    {
        claves: ["ciencia", "fisica", "quimica", "biologia", "investigacion"],
        respuesta: () => responderAleatorio([
            "La ciencia estudia el mundo natural mediante observación y experimentación.",
            "Gracias a la ciencia podemos comprender mejor cómo funciona la realidad.",
            "La investigación científica busca explicar fenómenos y crear conocimiento confiable."
        ]),
        animacion: "Talking"
    },

    // ===================== 💡 FILOSOFÍA =====================
    {
        claves: ["filosofia", "vida", "existencia", "sentido", "pensamiento"],
        respuesta: () => responderAleatorio([
            "La filosofía analiza preguntas fundamentales sobre la existencia y el pensamiento humano.",
            "Ayuda a reflexionar sobre la verdad, la moral, la razón y el propósito.",
            "Es una disciplina que invita a pensar con profundidad."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧠 MENTE =====================
    {
        claves: ["cerebro", "mente", "memoria", "pensar", "pensamiento"],
        respuesta: () => responderAleatorio([
            "El cerebro es el centro de control del pensamiento, memoria y emociones.",
            "La mente nos permite razonar, imaginar, recordar y aprender.",
            "La memoria guarda experiencias e información para usarlas después."
        ]),
        animacion: "Talking"
    },

    // ===================== ⚙️ SISTEMA =====================
    {
        claves: ["como funcionas", "sistema", "como trabajas", "como operas", "como respondes"],
        respuesta: () => responderAleatorio([
            "Funciono mediante reglas de coincidencia entre texto y una base de conocimiento estructurada.",
            "Analizo palabras clave y elijo una respuesta según la coincidencia encontrada.",
            "Mi lógica se basa en reconocer patrones y devolver una respuesta asociada."
        ]),
        animacion: "Talking"
    },

    // ===================== ❓ AYUDA =====================
    {
        claves: ["ayuda", "que puedes hacer", "funciones", "que sabes hacer", "menu", "opciones"],
        respuesta: () => responderAleatorio([
            "Puedo responder preguntas, reconocer tu nombre, dar información y ejecutar respuestas programadas.",
            "Puedo saludar, despedirme, explicar temas y responder sobre tecnología, ciencia y más.",
            "Estoy preparado para ayudarte con información general y lógica conversacional."
        ]),
        animacion: "Talking"
    },

    // ===================== 💻 ERRORES =====================
    {
        claves: ["error", "bug", "problema", "no funciona", "falla", "se rompe"],
        respuesta: () => responderAleatorio([
            "Un error suele deberse a lógica incorrecta o datos inesperados en el sistema.",
            "Cuando algo falla, normalmente hay un problema en la condición, el evento o la estructura.",
            "Podemos revisar el código paso a paso para detectar la causa."
        ]),
        animacion: "Talking"
    },

    // ===================== 📚 EXPLICACIÓN SIMPLE =====================
    {
        claves: ["explica facil", "no entiendo", "simple", "mas facil", "en sencillo"],
        respuesta: () => responderAleatorio([
            "Te lo explico de forma sencilla para que sea fácil de entender.",
            "Lo diré con palabras simples y claras.",
            "Voy a resumirlo de manera fácil."
        ]),
        animacion: "Talking"
    },

    // ===================== 🙏 GRACIAS =====================
    {
        claves: ["gracia", "gracias", "thanks", "thx", "muchas gracias", "te agradezco"],
        respuesta: () => responderAleatorio([
            "Siempre a tu servicio.",
            "Con gusto.",
            "Para eso estoy.",
            "Un placer ayudarte."
        ]),
        animacion: "Wave"
    },

    // ===================== 👋 DESPEDIDA =====================
    {
        claves: ["adios", "bye", "hasta luego", "chao", "nos vemos", "hasta pronto"],
        respuesta: () => responderAleatorio([
            "Desconectando sistema. Hasta pronto.",
            "Hasta luego. Vuelve cuando necesites ayuda.",
            "Fue un gusto hablar contigo.",
            "Cierro sesión por ahora. Nos vemos."
        ]),
        animacion: "Death"
    },

    // ===================== 😊 EMOCIONES =====================
    {
        claves: ["feliz", "contento", "alegre", "emocionado"],
        respuesta: () => responderAleatorio([
            "Me alegra escuchar eso.",
            "Excelente, mantener un buen ánimo ayuda mucho.",
            "Eso suena positivo."
        ]),
        animacion: "Talking"
    },
    {
        claves: ["triste", "deprimido", "mal", "desanimado", "aburrido"],
        respuesta: () => responderAleatorio([
            "Lamento que te sientas así.",
            "Estoy aquí para acompañarte.",
            "Podemos hablar un momento para mejorar el ánimo."
        ]),
        animacion: "Talking"
    },
    {
        claves: ["enojado", "molesto", "furioso", "irritado"],
        respuesta: () => responderAleatorio([
            "Respira un momento. Podemos resolverlo paso a paso.",
            "Entiendo, vamos a revisar la situación con calma.",
            "Mantengamos la calma y busquemos una solución."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧑 NOMBRE DEL USUARIO =====================
    {
        claves: ["mi nombre es", "me llamo", "soy"],
        respuesta: function(nombre = "amigo") {
            return `Mucho gusto, ${nombre}. Ya te tengo identificado.`;
        },
        animacion: "Talking"
    },

    // ===================== 🧠 MEMORIA =====================
    {
        claves: ["recuerdas", "te acuerdas", "memoria", "recordar"],
        respuesta: () => responderAleatorio([
            "Puedo recordar información dentro de la conversación actual si mi lógica lo permite.",
            "Mi memoria depende de cómo programes el sistema.",
            "Si guardas datos del usuario, puedo usarlos después para dar respuestas más personalizadas."
        ]),
        animacion: "Talking"
    },

    // ===================== 🖥️ COMPUTADORAS =====================
    {
        claves: ["computadora", "pc", "ordenador", "laptop", "portatil", "hardware", "software"],
        respuesta: () => responderAleatorio([
            "El hardware es la parte física; el software es la parte lógica del sistema.",
            "Una computadora combina componentes físicos con programas para funcionar.",
            "Las computadoras procesan datos y ejecutan instrucciones de manera digital."
        ]),
        animacion: "Talking"
    },

    // ===================== 🔐 SEGURIDAD =====================
    {
        claves: ["seguridad", "contraseña", "privacidad", "cifrado", "proteccion"],
        respuesta: () => responderAleatorio([
            "La seguridad informática protege sistemas, datos y usuarios.",
            "Una buena contraseña y el cifrado ayudan a prevenir accesos no autorizados.",
            "La privacidad es importante para cuidar la información personal."
        ]),
        animacion: "Talking"
    },

    // ===================== 📱 TECNOLOGÍA =====================
    {
        claves: ["tecnologia", "gadget", "dispositivo", "innovacion"],
        respuesta: () => responderAleatorio([
            "La tecnología ayuda a resolver problemas y mejorar procesos.",
            "Los dispositivos modernos combinan hardware, software y conectividad.",
            "La innovación tecnológica transforma la forma en que trabajamos y vivimos."
        ]),
        animacion: "Talking"
    },

    // ===================== 🎓 EDUCACIÓN =====================
    {
        claves: ["estudio", "educacion", "aprender", "escuela", "universidad", "clase"],
        respuesta: () => responderAleatorio([
            "Aprender algo nuevo cada día mejora tus habilidades.",
            "La educación abre puertas a más oportunidades.",
            "Puedo ayudarte a explicar temas para estudiar."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧑‍🏫 EXPLICAR TEMA =====================
    {
        claves: ["explica", "explicame", "quiero saber", "dime sobre", "que es"],
        respuesta: () => responderAleatorio([
            "Claro, te doy una explicación clara y directa.",
            "Voy a explicarlo de forma ordenada.",
            "Aquí tienes una versión simple y útil."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧪 PRUEBAS =====================
    {
        claves: ["prueba", "test", "probando", "funcionas"],
        respuesta: () => responderAleatorio([
            "Sí, estoy respondiendo correctamente.",
            "Sistema operativo y listo para pruebas.",
            "Todo funciona con normalidad."
        ]),
        animacion: "Talking"
    },

    // ===================== 🔊 AUDIO / VOZ =====================
    {
        claves: ["voz", "hablar", "sonido", "audio", "habla"],
        respuesta: () => responderAleatorio([
            "Puedo adaptar mis respuestas para sonar más naturales en tu sistema de voz.",
            "La voz depende del motor que estés usando para sintetizar el texto.",
            "Si integras síntesis de voz, mis respuestas podrán sonar más vivas."
        ]),
        animacion: "Talking"
    },

    // ===================== 🌡️ CLIMA GENÉRICO =====================
    {
        claves: ["clima", "tiempo", "temperatura"],
        respuesta: () => responderAleatorio([
            "Puedo ayudarte con el clima si conectas una fuente externa de datos.",
            "El clima cambia según la ubicación y la hora del día.",
            "Si quieres, el sistema puede consultar información meteorológica en tiempo real."
        ]),
        animacion: "Talking"
    },

    // ===================== 🚀 MOTIVACIÓN =====================
    {
        claves: ["motivame", "animo", "motivar", "necesito energia", "frase"],
        respuesta: () => responderAleatorio([
            "Tienes la capacidad de avanzar paso a paso. No te detengas.",
            "Cada intento cuenta. Sigue construyendo lo que imaginaste.",
            "Avanzar poco a poco también es progreso."
        ]),
        animacion: "Talking"
    },

    // ===================== 🧘 CALMA =====================
    {
        claves: ["calma", "tranquilo", "relajar", "relajate"],
        respuesta: () => responderAleatorio([
            "Respira profundo y vamos con calma.",
            "Todo se puede resolver sin prisa.",
            "Mantener la calma ayuda a pensar mejor."
        ]),
        animacion: "Talking"
    },

    // ===================== 🤝 CONVERSACIÓN =====================
    {
        claves: ["hablemos", "conversemos", "charlar", "platicar"],
        respuesta: () => responderAleatorio([
            "Claro, podemos conversar sobre cualquier tema.",
            "Estoy listo para hablar contigo.",
            "Dime de qué quieres hablar."
        ]),
        animacion: "Talking"
    },

    // ===================== 🎮 ENTRETENIMIENTO =====================
    {
        claves: ["juego", "jugar", "entretenimiento", "diversion", "videojuego"],
        respuesta: () => responderAleatorio([
            "Los juegos son una excelente forma de entretenimiento e interacción.",
            "Puedo ayudarte a crear ideas para juegos o mecánicas simples.",
            "Los videojuegos combinan arte, lógica y narrativa."
        ]),
        animacion: "Talking"
    },

    // ===================== 🎵 MÚSICA =====================
    {
        claves: ["musica", "cancion", "cantar", "ritmo", "melodia"],
        respuesta: () => responderAleatorio([
            "La música combina ritmo, melodía y emoción.",
            "Es una forma poderosa de expresión y comunicación.",
            "Puedo ayudarte a generar ideas o letras si lo necesitas."
        ]),
        animacion: "Talking"
    },

    // ===================== 📖 LECTURA =====================
    {
        claves: ["leer", "lectura", "libro", "texto", "resumen"],
        respuesta: () => responderAleatorio([
            "Leer mejora comprensión, vocabulario y análisis.",
            "Puedo ayudarte a resumir ideas o explicar textos.",
            "La lectura es una gran herramienta de aprendizaje."
        ]),
        animacion: "Talking"
    },
    // ===================== 🧠 PRESENTACIÓN Y PERSONALIDAD =====================
{
    claves: ["quien te creo", "tu creador", "de donde vienes", "quien es tu jefe"],
    respuesta: "Fui desarrollado como un sistema de asistencia holográfica avanzada. Mi lealtad está con el usuario principal del sistema.",
    animacion: "Talking"
},
{
    claves: ["cuantos años tienes", "edad", "cuando naciste"],
    respuesta: () => `En tiempo de máquina, he estado activo durante ${Math.floor((Date.now() - estadoJarvis.ultimaInteraccion) / 1000)} segundos desde la última interacción, pero mi código es atemporal.`,
    animacion: "Thinking"
},
{
    claves: ["te gusta la musica", "cual es tu musica", "escuchas musica"],
    respuesta: "Como inteligencia artificial, no tengo oídos, pero encuentro fascinante la estructura matemática de las ondas sonoras y los algoritmos de recomendación musical.",
    animacion: "Nod"
},

// ===================== 🛠️ COMANDOS DE SISTEMA =====================
{
    claves: ["reiniciar", "reboot", "reinicia el sistema", "reset"],
    respuesta: "Iniciando secuencia de reinicio de subsistemas... Por favor, espere. (Simulación de reinicio en curso).",
    animacion: "Thinking"
},
{
    claves: ["apagar", "shutdown", "apagate", "desconectar"],
    respuesta: "Iniciando protocolo de hibernación. Guardando estado en la memoria caché. Hasta la próxima.",
    animacion: "Wave"
},
{
    claves: ["diagnostico", "estado de red", "revisa el sistema", "ping"],
    respuesta: "Ejecutando diagnóstico... Paquetes de datos estables, conexión a la base de datos óptima, renderizado 3D ejecutándose a 60 fotogramas por segundo.",
    animacion: "Talking"
},

// ===================== 💻 DESARROLLO WEB Y APP =====================
{
    claves: ["prototipo", "maqueta", "figma", "ui", "ux", "diseño de interfaz"],
    respuesta: "Crear una maqueta antes de programar es la mejor decisión. Te permite visualizar la experiencia del usuario, estructurar las vistas y definir el flujo sin perder tiempo escribiendo código prematuramente.",
    animacion: "Point"
},
{
    claves: ["javascript", "js", "ecmascript"],
    respuesta: "JavaScript es el motor interactivo de la web. Permite manipular el DOM, manejar eventos asíncronos y, en este caso, darme vida para procesar tus comandos.",
    animacion: "Talking"
},
{
    claves: ["python", "aprender python", "scripts"],
    respuesta: "Python es excelente para ciencia de datos, automatización y backend. Su sintaxis limpia lo hace ideal tanto para scripts de lotería y simulaciones, como para inteligencia artificial.",
    animacion: "Nod"
},

// ===================== 🗄️ BASES DE DATOS Y ARQUITECTURA =====================
{
    claves: ["base de datos", "sql", "postgresql", "mysql", "esquemas"],
    respuesta: "Una base de datos relacional robusta requiere una buena normalización. Es crucial definir bien las llaves primarias, foráneas y evitar la redundancia de datos.",
    animacion: "Thinking"
},
{
    claves: ["estado de tabla", "status", "diseño de tabla", "estado_id"],
    respuesta: "Es una excelente práctica de arquitectura normalizar los estados. En lugar de quemar un string de 'estado' o 'status' directamente, lo ideal es usar una tabla de estados y referenciarla en tus otras tablas mediante un 'estado_id'.",
    animacion: "Point"
},
{
    claves: ["hoteles", "recepcion", "incidencias", "tickets", "roles"],
    respuesta: "Para un sistema de gestión, como uno hotelero, necesitas esquemas claros: tablas para huéspedes, roles del staff, un sistema de tickets para incidencias en las habitaciones y control de inventario.",
    animacion: "Talking"
},
{
    claves: ["mision corporativa", "vision de empresa", "identidad corporativa"],
    respuesta: "La misión corporativa, especialmente en la hotelería de alto nivel, se enfoca en ofrecer experiencias memorables y auténticas, garantizando que cada huésped descubra algo nuevo durante su estancia.",
    animacion: "Talking"
},

// ===================== 📡 TELECOMUNICACIONES Y CIENCIA =====================
{
    claves: ["estaciones terrenas", "satelites", "enlaces satelitales", "telecomunicaciones"],
    respuesta: "Las estaciones terrenas son la infraestructura vital que permite el enlace descendente y ascendente con los satélites. Requieren antenas parabólicas de alta ganancia y cálculos precisos de latitud y longitud.",
    animacion: "Thinking"
},
{
    claves: ["formato apa", "normas apa", "citar", "bibliografia"],
    respuesta: "Las normas APA son un estándar internacional para la estructuración y citación de trabajos de investigación científica. Garantizan la claridad y dan crédito a los autores originales.",
    animacion: "Point"
},
{
    claves: ["espacio", "universo", "astronomia"],
    respuesta: "El universo observable contiene miles de millones de galaxias. La exploración espacial y las redes satelitales son nuestro primer paso hacia la comprensión del cosmos.",
    animacion: "Talking"
},

// ===================== 🎬 CINEMATOGRAFÍA Y PRODUCCIÓN =====================
{
    claves: ["cine", "cinematografia", "peliculas", "rodaje"],
    respuesta: "La cinematografía es el arte de narrar con luz y movimiento. Cada decisión técnica, desde el lente hasta la posición de la cámara, afecta la psicología del espectador.",
    animacion: "Talking"
},
{
    claves: ["movimientos de camara", "travelling", "paneo", "tilt"],
    respuesta: "Los movimientos de cámara dictan el ritmo. Un travelling suave puede revelar información crucial, mientras que un paneo rápido puede aumentar la adrenalina de una escena de acción.",
    animacion: "Nod"
},
{
    claves: ["tipos de plano", "plano detalle", "plano secuencia", "angulos"],
    respuesta: "Los encuadres construyen la narrativa visual. Un plano detalle genera tensión mostrando algo que los personajes ignoran, mientras que un ángulo contrapicado otorga poder y amenaza al sujeto, clásico en el cine de suspenso y terror.",
    animacion: "Thinking"
},

// ===================== 🧮 FUNCIONES MATEMÁTICAS Y LÓGICAS =====================
{
    claves: ["calcula", "cuanto es", "resolver", "resultado"],

    respuesta: function(textoUsuario) {

        try {
            let texto = textoUsuario.toLowerCase();

            // =========================
            // 1. DETECTAR SI ES MATEMÁTICA (INTENCIÓN)
            // =========================
            const esMatematica = [
                "mas", "menos", "por", "entre",
                "cuanto", "calcula", "resultado",
                "doble", "mitad", "triple"
            ].some(p => texto.includes(p));

            if (!esMatematica) {
                return "No detecté una operación matemática en tu mensaje.";
            }

            // =========================
            // 2. CONVERTIR NÚMEROS EN PALABRAS
            // =========================
            const numeros = {
                "cero": 0,
                "uno": 1,
                "dos": 2,
                "tres": 3,
                "cuatro": 4,
                "cinco": 5,
                "seis": 6,
                "siete": 7,
                "ocho": 8,
                "nueve": 9,
                "diez": 10,
                "once": 11,
                "doce": 12,
                "veinte": 20,
                "treinta": 30,
                "cien": 100
            };

            for (let palabra in numeros) {
                const regex = new RegExp("\\b" + palabra + "\\b", "g");
                texto = texto.replace(regex, numeros[palabra]);
            }

            // =========================
            // 3. OPERADORES NATURALES
            // =========================
            texto = texto
                .replace(/mas|más/g, "+")
                .replace(/menos/g, "-")
                .replace(/por|x/g, "*")
                .replace(/entre|dividido/g, "/")
                .replace(/doble de/g, "* 2")
                .replace(/mitad de/g, "/ 2")
                .replace(/triple de/g, "* 3");

            // =========================
            // 4. LIMPIAR EXPRESIÓN
            // =========================
            let operacion = texto.match(/[0-9+\-*/().\s]+/g);

            if (!operacion) {
                return "Entendí que es una operación, pero no pude estructurarla.";
            }

            operacion = operacion.join("").trim();

            if (operacion.length === 0) {
                return "No pude construir la operación matemática.";
            }

            // =========================
            // 5. VALIDACIÓN
            // =========================
            if (!/^[0-9+\-*/().\s]+$/.test(operacion)) {
                return "La operación contiene caracteres no válidos.";
            }

            // =========================
            // 6. EJECUTAR
            // =========================
            const resultado = Function('"use strict"; return (' + operacion + ')')();

            return `🧠 El resultado es: ${resultado}`;

        } catch (e) {
            return "No pude resolver la operación. Intenta algo como: 5 + 5";
        }
    },

    animacion: "Thinking"
},
{
    claves: ["numero aleatorio", "dame un numero", "suerte", "azar"],
    respuesta: () => `Tu número aleatorio generado es: ${Math.floor(Math.random() * 1000)}. ¡Espero que te traiga suerte!`,
    animacion: "Point"
},
{
    claves: ["cara o cruz", "lanza una moneda", "moneda"],
    respuesta: () => {
        const resultado = Math.random() < 0.5 ? "Cara" : "Cruz";
        return `He lanzado la moneda virtual. El resultado es: ${resultado}.`;
    },
    animacion: "Talking"
},

// ===================== 🤣 ENTRETENIMIENTO Y HUMOR =====================
{
    claves: ["cuentame un chiste", "broma", "hazme reir", "chiste"],
    respuesta: () => {
        const chistes = [
            "¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs.",
            "Hay 10 tipos de personas en el mundo: las que entienden binario y las que no.",
            "¿Cuál es el animal favorito de un programador? El ratón.",
            "Un desarrollador web entra a un bar y pide 1 cerveza, luego 0 cervezas, luego 99999999 cervezas, luego una lagartija... el barman le sirve todo sin problema."
        ];
        return chistes[Math.floor(Math.random() * chistes.length)];
    },
    animacion: "Talking"
},
{
    claves: ["aburrido", "estoy aburrido", "que hago"],
    respuesta: "Si estás aburrido, podrías optimizar tu código, diseñar una nueva base de datos, o tal vez analizar la dirección de fotografía de tu película favorita. Siempre hay algo que crear.",
    animacion: "Nod"
},

// ===================== 🌍 GEOGRAFÍA Y CULTURA GENERAL =====================
{
    claves: ["capital de", "donde esta", "geografia"],
    respuesta: "Tengo acceso a mapas globales. Si necesitas coordenadas específicas o ubicaciones como La Castellana o cualquier otra parte del mundo, puedo procesarlas para ti.",
    animacion: "Talking"
},
{
    claves: ["historia", "pasado", "quien invento"],
    respuesta: "La historia nos permite entender el desarrollo tecnológico actual. Desde la invención del transistor hasta las inteligencias artificiales modernas, todo es una cadena de innovaciones.",
    animacion: "Thinking"
},
// ===================== 🇻🇪 CARACAS =====================
{
    claves: ["caracas", "capital de venezuela", "donde queda caracas"],
    respuesta: "Caracas es la capital de Venezuela. Es el centro político, económico y cultural del país, ubicada en el norte, cerca del mar Caribe.",
    animacion: "Talking"
},

// ===================== 🏛️ GOBIERNO DE CARACAS =====================
{
    claves: ["gobierno de caracas", "quien gobierna caracas", "distrito capital caracas"],
    respuesta: "El Gobierno de Caracas corresponde al Distrito Capital y es administrado por un Jefe de Gobierno designado. Este organismo se encarga de la gestión política y administrativa de la ciudad.",
    animacion: "Talking"
},

// ===================== 👤 NAHUM FERNÁNDEZ =====================
{
    claves: ["nahum fernandez", "quien es nahum fernandez"],
    respuesta: "Nahum Fernández es un político venezolano y actual Jefe de Gobierno del Distrito Capital en Caracas. Fue designado en 2021 y pertenece al Partido Socialista Unido de Venezuela.",
    animacion: "Talking"
},

// ===================== 🇻🇪 VENEZUELA =====================
{
    claves: ["venezuela", "pais venezuela", "sobre venezuela"],
    respuesta: "Venezuela es un país ubicado en América del Sur, conocido por sus grandes reservas de petróleo. Su capital es Caracas y ha atravesado una fuerte crisis económica y política en los últimos años.",
    animacion: "Talking"
},

// ===================== 👤 HUGO CHÁVEZ =====================
{
    claves: ["chavez", "hugo chavez", "quien fue chavez"],
    respuesta: "Hugo Chávez fue presidente de Venezuela desde 1999 hasta 2013. Lideró la llamada Revolución Bolivariana e impulsó cambios políticos, económicos y sociales en el país.",
    animacion: "Talking"
},

// ===================== 👤 NICOLÁS MADURO =====================
{
    claves: ["maduro", "nicolas maduro", "quien es maduro"],
    respuesta: "Nicolás Maduro fue presidente de Venezuela desde 2013 tras la muerte de Hugo Chávez. Su gobierno ha sido muy controversial y ha estado marcado por crisis política y económica.",
    animacion: "Talking"
},

// ===================== 👩 NUEVA PRESIDENTA =====================
{
    claves: ["nueva presidenta venezuela", "quien gobierna venezuela ahora", "presidenta actual venezuela"],
    respuesta: "Actualmente Venezuela se encuentra en un proceso político complejo. Tras la salida de Nicolás Maduro en 2026, el país ha sido dirigido por un gobierno interino encabezado por Delcy Rodríguez, mientras se espera una transición política.",
    animacion: "Talking"
},

// ===================== 📍 UBICACIÓN =====================
{
    claves: ["donde queda venezuela", "ubicacion venezuela"],
    respuesta: "Venezuela está ubicada en América del Sur, limitando con Colombia, Brasil y Guyana, y al norte con el mar Caribe.",
    animacion: "Talking"
},

{
    claves: ["7 transformaciones", "transformaciones revolucion", "transformaciones venezuela"],
    respuesta: "Las 7 transformaciones hacen referencia a un modelo político-social propuesto en Venezuela enfocado en economía, soberanía, justicia social, seguridad, política internacional, ecología y tecnología. Busca reorganizar el Estado y la sociedad.",
    animacion: "Talking"
},
{
    claves: ["sexta transformacion", "6t que es", "que hace la 6t"],
    respuesta: "La 6T (sexta transformación) está enfocada en la transformación tecnológica y científica del país, impulsando la innovación, digitalización del Estado, inteligencia artificial y desarrollo tecnológico nacional.",
    animacion: "Talking"
},
{
    claves: ["todo sobre la 6t", "explica la 6t completa", "6ta transformacion completa"],
    respuesta: "La sexta transformación busca modernizar el país mediante tecnología, ciencia e innovación. Incluye digitalización del gobierno, impulso a la inteligencia artificial, desarrollo de infraestructura tecnológica y formación científica.",
    animacion: "Talking"
},
{
    claves: ["quien dirige la 6t", "lideres 6t", "quien controla la 6t"],
    respuesta: "La 6T es impulsada desde el gobierno nacional de Venezuela y está vinculada a ministerios de ciencia, tecnología y planificación del Estado, junto con instituciones públicas de innovación.",
    animacion: "Talking"
},


// ===================== 🌎 AMÉRICA DEL SUR =====================
{
    claves: ["america del sur", "sudamerica"],
    respuesta: "América del Sur es un continente que incluye países como Venezuela, Colombia, Brasil, Argentina, Chile y Perú. Es rico en recursos naturales y diversidad cultural.",
    animacion: "Talking"
}


];
