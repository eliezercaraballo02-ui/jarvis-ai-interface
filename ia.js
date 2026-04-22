export class JarvisHibrido {
    constructor() {
        this.apiKey = "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";
        this.model = "mistralai/Mistral-7B-Instruct-v0.2";
        
        this.comandosLocales = {
            "saluda": "Sistemas en línea. Hola, soy Jarvis.",
            "baila": "Iniciando protocolos de baile.",
            "quien eres": "Soy una interfaz de IA híbrida diseñada por un desarrollador web y de bases de datos."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const prompt = textoUsuario.toLowerCase().trim();

        // 1. Respuesta Local (Siempre funciona)
        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
        }

        // 2. Respuesta Nube con Proxy (Para evitar el error de Preflight/CORS)
        try {
            const targetUrl = `https://api-inference.huggingface.co/models/${this.model}`;
            // Usamos corsproxy.io que es más automático
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
            
            const response = await fetch(proxyUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `[INST] Eres Jarvis, asistente técnico. Responde breve en español: ${textoUsuario} [/INST]`,
                    parameters: { max_new_tokens: 100 }
                })
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.error && error.error.includes("loading")) {
                    return { fuente: "SISTEMA", respuesta: "Núcleo cargando. Reintenta en 10 segundos." };
                }
                throw new Error("Error en la API");
            }

            const data = await response.json();
            const respuestaIA = Array.isArray(data) ? data[0].generated_text : data.generated_text;
            
            // Limpiar la respuesta si trae el prompt repetido
            return { 
                fuente: "IA NUBE", 
                respuesta: respuestaIA.includes("[/INST]") ? respuestaIA.split("[/INST]")[1].trim() : respuestaIA 
            };

        } catch (error) {
            console.error("Error final:", error);
            return { fuente: "ERROR", respuesta: "Error de enlace con la nube. Intente de nuevo." };
        }
    }
}
