export class JarvisHibrido {
    constructor() {
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

        // 1. Lógica Local (Instantánea)
        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) {
                return { fuente: "SISTEMA LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Lógica de Nube con Proxy Robusto
        try {
            const targetUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
            // Usamos corsproxy.io para envolver la petición
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
            
            const response = await fetch(proxyUrl, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `<s>[INST] Eres Jarvis, asistente técnico. Responde breve en español: ${textoUsuario} [/INST]`,
                    parameters: { max_new_tokens: 150, temperature: 0.7 }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error && errorData.error.includes("currently loading")) {
                    return { fuente: "SISTEMA", respuesta: "Núcleo cargando. Por favor, reintenta en unos segundos." };
                }
                throw new Error("Fallo en la respuesta");
            }

            const data = await response.json();
            let respuestaIA = data[0].generated_text;
            
            if (respuestaIA.includes("[/INST]")) {
                respuestaIA = respuestaIA.split("[/INST]")[1].trim();
            }

            return { fuente: "IA NUBE", respuesta: respuestaIA };

        } catch (error) {
            console.error("Error detallado:", error);
            return { fuente: "ERROR", respuesta: "Error de enlace con la nube. Intente de nuevo." };
        }
    }
}
