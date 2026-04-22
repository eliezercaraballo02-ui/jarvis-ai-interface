export class JarvisHibrido {
    constructor() {
        this.apiKey = "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";
        this.model = "mistralai/Mistral-7B-Instruct-v0.2";
        
        this.comandosLocales = {
            "saluda": "Sistemas en línea. Hola, soy Jarvis.",
            "baila": "Iniciando protocolos de baile.",
            "quien eres": "Soy una interfaz de IA híbrida diseñada por un desarrollador web."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const prompt = textoUsuario.toLowerCase().trim();

        for (let comando in this.comandosLocales) {
            if (prompt.includes(comando)) return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
        }

        try {
            // USAMOS UN PROXY DIFERENTE Y MÁS SIMPLE
            const targetUrl = `https://api-inference.huggingface.co/models/${this.model}`;
            const proxyUrl = "https://api.allorigins.win/get?url=";
            
            const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
                method: "GET" // AllOrigins funciona mejor con GET para saltar el preflight
            });

            // Nota: Con este proxy, la respuesta viene envuelta en un objeto 'contents'
            const dataWrap = await response.json();
            
            // Ahora enviamos la verdadera petición POST (Esto es lo que hace el híbrido)
            // Si el proxy AllOrigins te da problemas, lo mejor será cambiar a Gemini como sugeriste.
            
            // --- INTENTO DE PETICIÓN DIRECTA SIMPLIFICADA (PLAN B) ---
            const directRes = await fetch(targetUrl, {
                headers: { "Authorization": `Bearer ${this.apiKey}` },
                method: "POST",
                body: JSON.stringify({ inputs: textoUsuario })
            });
            
            const data = await directRes.json();
            return { fuente: "IA NUBE", respuesta: data[0].generated_text };

        } catch (error) {
            console.error("Error:", error);
            return { fuente: "ERROR", respuesta: "Error de enlace. ¿Probamos con Gemini de Google?" };
        }
    }
}
