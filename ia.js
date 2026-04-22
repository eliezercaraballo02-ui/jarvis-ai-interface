import { GoogleGenerativeAI } from "@google/generative-ai";

export class JarvisHibrido {
    constructor() {
        // PEGA AQUÍ TU API KEY DE GOOGLE
        this.apiKey = "AIzaSyDnbYAoTJ1n152b7_rIpb7TFI1WmkFlTDA"; 
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        this.comandosLocales = {
            "saluda": "Sistemas en línea. Hola, soy Jarvis.",
            "baila": "Iniciando protocolos de baile. ¡Observe!",
            "quien eres": "Soy una interfaz de IA híbrida potenciada por Google Gemini.",
            "proyectos": "He desarrollado sistemas SQL, simuladores y esta interfaz 3D."
        };
    }

    async hablarConJarvis(textoUsuario) {
        const promptLimpio = textoUsuario.toLowerCase().trim();

        // 1. Lógica Local (Instantánea)
        for (let comando in this.comandosLocales) {
            if (promptLimpio.includes(comando)) {
                return { fuente: "LOCAL", respuesta: this.comandosLocales[comando] };
            }
        }

        // 2. Lógica de Nube con Google Gemini
        try {
            const instruccion = `Eres Jarvis, el asistente de un desarrollador experto. 
                                 Responde de forma breve (máximo 2 frases), técnica y educada. 
                                 Usuario dice: ${textoUsuario}`;

            const result = await this.model.generateContent(instruccion);
            const response = await result.response;
            const text = response.text();

            return { fuente: "GEMINI NUBE", respuesta: text.trim() };

        } catch (error) {
            console.error("Error en Gemini:", error);
            return { 
                fuente: "ERROR", 
                respuesta: "Error de conexión con los servidores de Google. Verifique la API Key." 
            };
        }
    }
}
