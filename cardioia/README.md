# CardioIA — Fase 4 | Interface (Integrante 3)

**Carlos Eduardo — RM566487 | Desenvolvedor de Interface**  
FIAP · Inteligência Artificial · Visão Computacional aplicada à Saúde

---

## Visão geral

Protótipo mobile desenvolvido para o **Ir Além B** da Fase 4.  
Permite que o usuário selecione ou fotografe uma imagem médica e receba a classificação em tempo real pelo modelo CNN treinado pelo Integrante 2 (João).

```
Imagem → App Expo → POST /predict → Flask Backend → Modelo CNN → Resultado
```

---

## Estrutura do repositório

```
cardioia/
├── backend/
│   ├── app.py              # API Flask com endpoint /predict
│   └── requirements.txt    # Dependências Python
│
├── mobile/
│   ├── app/
│   │   ├── _layout.jsx     # Configuração de navegação (Expo Router)
│   │   ├── index.jsx       # Tela de upload de imagem
│   │   ├── result.jsx      # Tela de resultado com classificação
│   │   └── config/
│   │       └── api.js      # URL do backend (ajustar IP local)
│   ├── app.json
│   └── package.json
│
└── README.md
```

---

## Dependências dos outros integrantes

| Integrante | O que precisamos |
|---|---|
| Tayná (Int. 1) | Dataset em `data/processed/{train,val,test}` — ✅ disponível |
| João (Int. 2) | Arquivo do modelo exportado (`models/cardioia_model.h5`) + lista de classes |

---

## Como rodar — Backend Flask

### Pré-requisitos
- Python 3.10+

### Instalação

```bash
cd cardioia/backend
pip install -r requirements.txt
```

### Ativar o modelo real (quando o João disponibilizar)

1. Coloque o arquivo `cardioia_model.h5` em `cardioia/models/`
2. Em `app.py`, descomente as linhas:
   ```python
   import tensorflow as tf
   model = tf.keras.models.load_model(MODEL_PATH)
   ```
3. Também descomente o bloco de inferência real em `run_inference()`
4. Instale o tensorflow: `pip install tensorflow==2.16.1`
5. Atualize `CLASS_NAMES` com as classes reais do dataset

### Iniciar o servidor

```bash
python app.py
# → rodando em http://0.0.0.0:5000
```

### Testar o endpoint manualmente

```bash
# Verificar saúde do servidor
curl http://localhost:5000/health

# Enviar uma imagem para classificação
curl -X POST http://localhost:5000/predict \
  -F "image=@caminho/para/imagem.jpg"
```

---

## Como rodar — App Expo (React Native)

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** instalado no celular (iOS ou Android)

### Instalação

```bash
cd cardioia/mobile
npm install
```

### Configurar o IP do backend

Edite `app/config/api.js` e substitua o IP:

```js
const DEV_IP = "192.168.1.100"; // ← seu IP local aqui
```

Para descobrir seu IP:
- **macOS/Linux:** `ifconfig | grep "inet "`
- **Windows:** `ipconfig | findstr "IPv4"`

> ⚠️ O celular e o computador precisam estar na **mesma rede Wi-Fi**.

### Iniciar o app

```bash
npx expo start
```

Escaneie o QR code com o app Expo Go no celular.

---

## Fluxo de uso

1. Abra o app → tela de upload
2. Toque em **Galeria** ou **Câmera** para selecionar a imagem
3. Toque em **Analisar imagem**
4. Veja o resultado: classe detectada + confiança + barras de probabilidade

---

## Screenshots

> Adicionar após captura das telas para o relatório do Endrew (Integrante 4).

---

## Entregáveis — Ir Além B

- [x] App React Native com tela de upload e exibição de resultado
- [x] Backend Flask com endpoint `/predict`
- [ ] Integração com modelo real (aguardando `.h5` do João)
- [ ] Vídeo de demonstração (até 3 min)

---

## Grupo

| Integrante | RM | Função |
|---|---|---|
| Tayná Esteves | RM562491 | Engenheira de Dados e Pipeline |
| João | RM565999 | Cientista de IA e Modelos |
| Carlos Eduardo | **RM566487** | **Desenvolvedor de Interface** |
| Endrew Alves | RM563646 | Documentador e Gestor |

FIAP · 3º Semestre · Inteligência Artificial · 2026
