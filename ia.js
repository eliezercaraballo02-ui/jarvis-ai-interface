export class JarvisHibrido {
    constructor() {
        // NOTA: Para producción, podrías usar variables de entorno, 
        // pero para tu portafolio, este token servirá por ahora.
        this.apiKey = "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"; 
        
        this.comandosLocales = {
            "saluda": "Hola, soy Jarvis. Sistemas en línea y listos para trabajar.",
            "baila": "Iniciando protocolos de entretenimiento... ¡Bailando!",
            "quien eres": "Soy una interfaz de IA híbrida diseñada por un desarrollador experto en SQL y Web.",
            "proyectos": "Actualmente tengo en mi base de datos: Sistema de Hoteles, Simuladores en Python y esta interfaz 3D."
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

        // 2. Lógica de Nube (IA Real)
        try {
            const url = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";
            
            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `<s>[INST] Eres Jarvis, el asistente personal de un desarrollador. Responde de forma técnica y breve en español: ${textoUsuario} [/INST]`,
                    parameters: { max_new_tokens: 120, temperature: 0.7 }
                })
            });

            const data = await response.json();

            if (data.error) {
                return { fuente: "SISTEMA", respuesta: "Núcleo en espera. Por favor, reintenta en 10 segundos." };
            }

            let respuestaIA = data[0].generated_text;
            const index = respuestaIA.indexOf("[/INST]");
            if (index !== -1) respuestaIA = respuestaIA.substring(index + 7).trim();

            return { fuente: "IA NUBE", respuesta: respuestaIA };

        } catch (error) {
            console.error("Error de conexión:", error);
            return { fuente: "ERROR", respuesta: "Error de enlace. Verifique su conexión a internet." };
        }
    }
}