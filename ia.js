export class JarvisHibrido {
    constructor() {
        // Usamos la API Key directamente con la librería que cargamos en el HTML
        this.apiKey = "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";
        
        this.comandosLocales = {
            "saluda": "Hola, soy Jarvis. Sistemas en línea y listos para trabajar.",
            "baila": "Iniciando protocolos de entretenimiento... ¡Bailando!",
            "quien eres": "Soy una interfaz de IA híbrida diseñada por un desarrollador experto.",
            "proyectos": "He trabajado en sistemas SQL, simuladores y esta interfaz 3D."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const prompt = textoUsuario.toLowerCase().trim();

        // 1. Lógica Local
        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) {
                return { fuente: "SISTEMA LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Lógica de Nube usando la librería global HfInference
        try {
            // Accedemos a la librería que cargamos en el script del HTML
            const hf = new window.HfInference(this.apiKey);
            
            const response = await hf.textGeneration({
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                inputs: `<s>[INST] Eres Jarvis, asistente técnico. Responde breve en español: ${textoUsuario} [/INST]`,
                parameters: { max_new_tokens: 120 }
            });

            let respuestaIA = response.generated_text;
            if (respuestaIA.includes("[/INST]")) {
                respuestaIA = respuestaIA.split("[/INST]")[1].trim();
            }

            return { fuente: "IA NUBE", respuesta: respuestaIA };

        } catch (error) {
            console.error("Error detallado:", error);
            if (error.message.includes("currently loading")) {
                return { fuente: "SISTEMA", respuesta: "Núcleo cargando... reintenta en 10 segundos." };
            }
            return { fuente: "ERROR", respuesta: "Error de enlace con el núcleo central." };
        }
    }
}
