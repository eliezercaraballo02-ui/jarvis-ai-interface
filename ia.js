export class JarvisHibrido {
    constructor() {
        // Usamos la librería global cargada desde el HTML
        this.hf = new HfInference("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");
        
        this.comandosLocales = {
            "saluda": "Hola, soy Jarvis. Sistemas en línea y listos.",
            "baila": "Iniciando protocolos de baile.",
            "proyectos": "He trabajado en sistemas SQL y esta interfaz 3D."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const prompt = textoUsuario.toLowerCase().trim();

        // 1. Respuesta Local
        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) {
                return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Respuesta con Librería Oficial (Evita errores de cabeceras manuales)
        try {
            const response = await this.hf.textGeneration({
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                inputs: `<s>[INST] Eres Jarvis, un asistente robótico. Responde brevemente en español: ${textoUsuario} [/INST]`,
                parameters: { max_new_tokens: 100 }
            });

            let respuestaIA = response.generated_text;
            if (respuestaIA.includes("[/INST]")) {
                respuestaIA = respuestaIA.split("[/INST]")[1].trim();
            }

            return { fuente: "IA NUBE", respuesta: respuestaIA };

        } catch (error) {
            console.error("Error HF:", error);
            if (error.message.includes("loading")) {
                return { fuente: "SISTEMA", respuesta: "Cargando cerebro... reintenta en 10 segundos." };
            }
            return { fuente: "ERROR", respuesta: "Error de conexión con el núcleo." };
        }
    }
}
