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

        // 1. Lógica Local
        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) {
                return { fuente: "SISTEMA LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Lógica de Nube usando un Túnel que limpia el CORS
        try {
            const modelUrl = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
            
            // Usamos un proxy que permite inyectar headers sin disparar el CORS del navegador
            const proxyUrl = "https://corsproxy.io/?";
            
            const response = await fetch(proxyUrl + encodeURIComponent(modelUrl), {
                method: "POST",
                headers: { 
                    // Al usar el proxy, estos encabezados no bloquean la petición
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `<s>[INST] Eres Jarvis, asistente técnico. Responde breve en español: ${textoUsuario} [/INST]`,
                })
            });

            if (!response.ok) {
                // Si el modelo está cargando en HF
                return { fuente: "SISTEMA", respuesta: "Núcleo en espera. Por favor, reintenta en 10 segundos." };
            }

            const data = await response.json();
            let respuestaIA = data[0].generated_text;
            
            if (respuestaIA.includes("[/INST]")) {
                respuestaIA = respuestaIA.split("[/INST]")[1].trim();
            }

            return { fuente: "IA NUBE", respuesta: respuestaIA };

        } catch (error) {
            console.error("Error:", error);
            // Si el proxy falla, intentamos una respuesta genérica para no romper la interfaz
            return { fuente: "ERROR", respuesta: "Error de enlace. Por favor, verifica tu conexión." };
        }
    }
}
