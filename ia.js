export class JarvisHibrido {
    constructor() {
        // Esta es la URL de tu nuevo servidor en Vercel
        this.urlServidor = "https://jarvis-backend-eight.vercel.app/chat";
        
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

        // 2. Lógica de Nube (Llamada a tu servidor en Vercel)
        try {
            const response = await fetch(this.urlServidor, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: textoUsuario })
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }

            const data = await response.json();
            
            // Retornamos la respuesta que viene de tu backend
            return { 
                fuente: "IA NUBE", 
                respuesta: data.respuesta 
            };

        } catch (error) {
            console.error("Error de conexión:", error);
            return { 
                fuente: "ERROR", 
                respuesta: "No pude conectar con mi cerebro en Vercel. Asegúrate de que el servidor esté activo." 
            };
        }
    }
}
