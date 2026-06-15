/**
 * CardioIA — Configuração da API
 *
 * Durante o desenvolvimento com Expo Go:
 *   - Use o IP local da sua máquina (ex: http://192.168.x.x:5000)
 *   - NÃO use localhost — o emulador/dispositivo não enxerga a máquina assim
 *
 * Para descobrir seu IP local:
 *   macOS/Linux: ifconfig | grep "inet "
 *   Windows:     ipconfig | findstr "IPv4"
 */

<<<<<<< HEAD
const DEV_IP = "192.168.1.100"; // ← Substitua pelo seu IP local
=======
const DEV_IP = "192.168.15.53"; // IP detectado no backend
>>>>>>> b2e6e34e (Repositório limpo: histórico removido para corrigir limite de tamanho)

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://seu-backend-em-producao.com" // ← para deploy futuro
    : `http://${DEV_IP}:5000`;

export const ENDPOINTS = {
  health: `${API_URL}/health`,
  predict: `${API_URL}/predict`,
};
