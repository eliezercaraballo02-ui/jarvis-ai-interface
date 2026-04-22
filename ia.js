export class JarvisHibrido {
    constructor() {
        this.apiKey = "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";
        this.model = "mistralai/Mistral-7B-Instruct-v0.2";
        
        this.comandosLocales = {
            "saluda": "Sistemas en línea. Hola, soy Jarvis.",
            "baila": "Iniciando protocolos de baile.",
            "quien eres": "Soy una IA híbrida diseñada para tu portafolio."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const prompt = textoUsuario.toLowerCase().trim();

        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
        }

        try {
            // USAMOS UN PROXY QUE AÑADE LOS HEADERS DE CORS AUTOMÁTICAMENTE
            const proxyUrl = "https://cors-anywhere.herokuapp.com/";
            const targetUrl = `https://api-inference.huggingface.co/models/${this.model}`;
            
            const response = await fetch(proxyUrl + targetUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify({
                    inputs: `[INST] Eres Jarvis, responde corto en español: ${textoUsuario} [/INST]`,
                    parameters: { max_new_tokens: 100 }
                })
            });

            if (!response.ok) return { fuente: "SISTEMA", respuesta: "El núcleo está saturado. Reintenta en breve." };

            const data = await response.json();
            const respuestaIA = Array.isArray(data) ? data[0].generated_text : data.generated_text;
            return { fuente: "IA NUBE", respuesta: respuestaIA.split("[/INST]")[1]?.trim() || respuestaIA };

        } catch (error) {
            console.error("Error de CORS:", error);
            return { fuente: "ERROR", respuesta: "Error de enlace. Activa el acceso al proxy si es necesario." };
        }
    }
}
