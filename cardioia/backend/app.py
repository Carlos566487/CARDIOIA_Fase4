"""
CardioIA Fase 4 - Backend Flask
Integrante 3: Desenvolvedor de Interface (Carlos Eduardo - RM566487)

Endpoint de inferência CNN para classificação de imagens médicas.
Modelo placeholder ativo. Substituir pelo modelo real do João (Integrante 2)
quando o arquivo .h5 for disponibilizado no repositório.
"""

import os
import io
import random
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)

# Limite de tamanho de upload: 10 MB (proteção contra DoS)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

# CORS com headers explícitos para multipart/form-data
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type"]}})


# ─────────────────────────────────────────────
# CONFIGURAÇÃO DO MODELO
# ─────────────────────────────────────────────

MODEL_PATH = os.environ.get("MODEL_PATH", "../models/cardioia_model.h5")
IMG_SIZE = (224, 224)

# Classes do dataset — ajustar conforme o dataset do João
CLASS_NAMES = ["Normal", "Pneumonia"]

# Variável global para o modelo carregado
model = None


def load_model():
    """
    Carrega o modelo treinado.
    Enquanto o modelo real não está disponível, usa placeholder.
    Para ativar o modelo real, instale tensorflow e descomente o bloco abaixo.
    """
    global model

    if os.path.exists(MODEL_PATH):
        # ── Modelo real (João) ─────────────────────────────────────────
        # import tensorflow as tf
        # model = tf.keras.models.load_model(MODEL_PATH)
        # print(f"✓ Modelo carregado: {MODEL_PATH}")
        pass
    else:
        print("⚠ Modelo real não encontrado. Usando placeholder para desenvolvimento.")
        print(f"  Esperado em: {MODEL_PATH}")
        model = None


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Pré-processa a imagem recebida para o formato esperado pelo modelo.
    Espelha o pipeline da Tayná (Integrante 1):
    - RGB, 224x224, normalizado [0, 1]
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)  # shape: (1, 224, 224, 3)


def run_inference(image_array: np.ndarray) -> dict:
    """
    Executa a inferência no modelo.
    Quando o modelo real estiver disponível (bloco if), usa a CNN do João.
    Caso contrário (bloco else), retorna probabilidades simuladas para desenvolvimento.
    """
    if model is not None:
        # ── Inferência real ────────────────────────────────────────────
        # TODO: descomentar quando o arquivo .h5 do João estiver disponível
        # predictions = model.predict(image_array, verbose=0)
        # probs = predictions[0].tolist()
        pass
    else:
        # ── Placeholder ───────────────────────────────────────────────────
        # Simula saída softmax com probabilidades que somam 1
        raw = [random.uniform(0.1, 0.9) for _ in CLASS_NAMES]
        total = sum(raw)
        probs = [round(v / total, 4) for v in raw]

        predicted_idx = int(np.argmax(probs))
        result = {
            "predicted_class": CLASS_NAMES[predicted_idx],
            "confidence": round(probs[predicted_idx] * 100, 2),
            "probabilities": {
                CLASS_NAMES[i]: round(probs[i] * 100, 2) for i in range(len(CLASS_NAMES))
            },
            "is_placeholder": True,
        }

        app.logger.info(
            f"Predição (placeholder): {result['predicted_class']} ({result['confidence']}%)"
        )
        return result


# ─────────────────────────────────────────────
# CARREGAMENTO DO MODELO NO NÍVEL DO MÓDULO
# Garante que o modelo seja carregado independente do modo de execução
# (python app.py, Gunicorn, uWSGI, etc.)
# ─────────────────────────────────────────────
load_model()


# ─────────────────────────────────────────────
# ROTAS
# ─────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Verifica se o servidor está ativo."""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "classes": CLASS_NAMES,
    })


@app.route("/classes", methods=["GET"])
def classes():
    """
    Retorna a lista de classes do modelo.
    Permite que o app mobile consulte as classes dinamicamente,
    sem precisar hardcodar no frontend.
    """
    return jsonify({"classes": CLASS_NAMES})


@app.route("/predict", methods=["POST"])
def predict():
    """
    Recebe uma imagem e retorna a classificação do modelo.

    Request: multipart/form-data com campo 'image'
    Response JSON:
    {
        "predicted_class": "Normal",
        "confidence": 94.3,
        "probabilities": { "Normal": 94.3, "Pneumonia": 5.7 },
        "is_placeholder": true
    }
    """
    if "image" not in request.files:
        return jsonify({"error": "Nenhuma imagem enviada. Use o campo 'image'."}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Arquivo vazio."}), 400

    allowed_extensions = {"png", "jpg", "jpeg", "webp"}
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in allowed_extensions:
        return jsonify({"error": f"Formato não suportado: {ext}. Use PNG ou JPEG."}), 400

    try:
        image_bytes = file.read()
        image_array = preprocess_image(image_bytes)
        result = run_inference(image_array)
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Erro ao processar imagem: {str(e)}")
        return jsonify({"error": f"Erro ao processar a imagem: {str(e)}"}), 500


# ─────────────────────────────────────────────
# INICIALIZAÇÃO (desenvolvimento local apenas)
# ─────────────────────────────────────────────

if __name__ == "__main__":
    print("─" * 50)
    print("CardioIA Backend — rodando em http://localhost:5000")
    print(f"Classes: {CLASS_NAMES}")
    print(f"Modelo carregado: {model is not None}")
    print("─" * 50)
    app.run(debug=True, host="0.0.0.0", port=5000)
