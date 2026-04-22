import { GoogleGenerativeAI } from "@google/generative-ai";

export class JarvisHibrido {
    constructor() {
        // Sustituye con tu clave de Google AI Studio
        this.apiKey = "AIzaSyDnbYAoTJ1n152b7_rIpb7TFI1WmkFlTDA"; 
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        this.comandosLocales = {
            "saluda": "Sistemas en línea. Hola, soy Jarvis.",
            "baila": "Protocolo de baile activado.",
            "quien eres": "Soy una interfaz de IA híbrida potenciada por Google Gemini.",
            "proyectos": "He trabajado en sistemas SQL y esta interfaz 3D."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const promptLimpio = textoUsuario.toLowerCase().trim();

        // 1. Lógica Local
        for (let comando in this.comandosLocales) {
            if (promptLimpio.includes(comando)) {
                return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Lógica con Google Gemini (Petición directa segura)
        try {
            const instruccion = `Eres Jarvis, el asistente de un desarrollador. 
                                 Responde muy breve en español: ${textoUsuario}`;

            const result = await this.model.generateContent(instruccion);
            const response = await result.response;
            const text = response.text();

            return { fuente: "GEMINI NUBE", respuesta: text.trim() };

        } catch (error) {
            console.error("Error en Gemini:", error);
            return { 
                fuente: "ERROR", 
                respuesta: "Error de conexión con el núcleo de Google." 
            };
        }
    }
}
