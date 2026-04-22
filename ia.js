export class JarvisHibrido {
    constructor() {
        this.apiKey = "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";
        this.model = "mistralai/Mistral-7B-Instruct-v0.2";
        
        this.comandosLocales = {
            "saluda": "Hola, soy Jarvis. Sistemas en línea.",
            "baila": "Iniciando rutina de baile...",
            "quien eres": "Soy una interfaz de IA híbrida diseñada para tu portafolio."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const prompt = textoUsuario.toLowerCase().trim();

        // 1. Respuesta Local
        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
        }

        // 2. Respuesta Nube (Petición Directa sin librerías externas)
        try {
            const response = await fetch(`https://api-inference.huggingface.co/models/${this.model}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: `[INST] Eres Jarvis, responde corto en español: ${textoUsuario} [/INST]`,
                    parameters: { max_new_tokens: 100, return_full_text: false }
                })
            });

            const data = await response.json();

            if (data.error) {
                if (data.error.includes("loading")) return { fuente: "SISTEMA", respuesta: "Núcleo cargando... intenta en 10 segundos." };
                return { fuente: "ERROR", respuesta: "Error en el núcleo de IA." };
            }

            let textoIA = data[0].generated_text || data.generated_text;
            return { fuente: "IA NUBE", respuesta: textoIA.trim() };

        } catch (error) {
            console.error("Error de red:", error);
            return { fuente: "ERROR", respuesta: "Sin conexión con la nube." };
        }
    }
}
