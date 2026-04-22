export class JarvisHibrido {
    constructor() {
        // Asegúrate de que esta URL sea la actual de tu proyecto Kappa
        this.urlServidor = "https://jarvis-backend-kappa.vercel.app/chat";
        
        this.comandosLocales = {
            "saluda": "Sistemas en línea. Hola, soy Jarvis.",
            "baila": "Iniciando protocolos de baile.",
            "quien eres": "Soy una interfaz de IA híbrida con backend en Vercel."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const promptLimpio = textoUsuario.toLowerCase().trim();

        // 1. Lógica Local (Inmediata)
        for (let comando in this.comandosLocales) {
            if (promptLimpio.includes(comando)) {
                return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Lógica de Nube (Llamada a Vercel)
        try {
            const response = await fetch(this.urlServidor, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: textoUsuario })
            });

            // VALIDACIÓN CRÍTICA: ¿Es realmente un JSON lo que viene?
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("El servidor no devolvió JSON, sino:", contentType);
                throw new Error("El cerebro está offline o devolvió una página de error.");
            }

            if (!response.ok) {
                throw new Error(`Error ${response.status}: El servidor no responde correctamente.`);
            }

            const data = await response.json();
            
            return { 
                fuente: "IA NUBE", 
                respuesta: data.respuesta || "Lo siento, no tengo una respuesta clara." 
            };

        } catch (error) {
            console.error("Detalles del fallo:", error);
            return { 
                fuente: "ERROR", 
                respuesta: "Señor, tenemos interferencias en la conexión. Verifique el servidor Kappa." 
            };
        }
    }
}
