/**
 * CardioIA — Tela Principal (Upload)
 * Integrante 3: Carlos Eduardo — RM566487
 *
 * Permite ao usuário selecionar uma imagem da galeria ou câmera
 * e enviá-la para análise pelo modelo CNN.
 */

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ENDPOINTS } from "./config/api";

export default function HomeScreen() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ──────────────────────────────────────────────────────────
  // Seleção de imagem
  // ──────────────────────────────────────────────────────────

  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Autorize o acesso à galeria nas configurações do dispositivo."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      // MediaTypeOptions.Images (API correta para Expo SDK 51 / expo-image-picker 15.x)
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Autorize o acesso à câmera nas configurações do dispositivo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  // ──────────────────────────────────────────────────────────
  // Envio para o backend
  // ──────────────────────────────────────────────────────────

  async function analyzeImage() {
    if (!image) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        // Usar image.uri diretamente: o fetch do React Native lida com
        // file:// automaticamente em iOS e Android — não remover o prefixo.
        uri: image.uri,
        type: "image/jpeg",
        name: "exam.jpg",
      });

      // Não definir Content-Type manualmente em requests multipart/form-data.
      // O fetch inclui o boundary correto automaticamente quando o body é FormData.
      const response = await fetch(ENDPOINTS.predict, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || `Erro do servidor: ${response.status}`);
      }

      const result = await response.json();

      // Navega para a tela de resultado passando os dados
      router.push({
        pathname: "/result",
        params: {
          imageUri: image.uri,
          predictedClass: result.predicted_class,
          confidence: result.confidence,
          probabilities: JSON.stringify(result.probabilities),
          isPlaceholder: result.is_placeholder ? "true" : "false",
        },
      });
    } catch (error) {
      Alert.alert(
        "Erro na análise",
        error.message.includes("Network request failed")
          ? "Não foi possível conectar ao servidor. Verifique se o backend está rodando e o IP em config/api.js está correto."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  // ──────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CardioIA</Text>
        <Text style={styles.headerSubtitle}>Análise de Imagens Médicas por CNN</Text>
      </View>

      {/* Área de upload */}
      <View style={styles.uploadCard}>
        {image ? (
          <View style={styles.imagePreviewWrapper}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.changeButton}
              onPress={() => setImage(null)}
              accessibilityLabel="Trocar imagem selecionada"
            >
              <Text style={styles.changeButtonText}>Trocar imagem</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadPlaceholder}>
            <Text style={styles.uploadIcon}>🩻</Text>
            <Text style={styles.uploadTitle}>Selecione uma imagem</Text>
            <Text style={styles.uploadHint}>
              Raio-X, ECG ou outra imagem médica{"\n"}(PNG ou JPEG, qualquer tamanho)
            </Text>
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={pickFromGallery}
                accessibilityLabel="Selecionar imagem da galeria"
              >
                <Text style={styles.uploadBtnText}>📁 Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={pickFromCamera}
                accessibilityLabel="Fotografar imagem com a câmera"
              >
                <Text style={styles.uploadBtnText}>📷 Câmera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Info sobre o modelo */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Como funciona</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoStep}>1</Text>
          <Text style={styles.infoText}>Selecione a imagem médica</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoStep}>2</Text>
          <Text style={styles.infoText}>
            A imagem é enviada ao modelo CNN (224×224 px, normalizado)
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoStep}>3</Text>
          <Text style={styles.infoText}>
            O modelo retorna a classificação com nível de confiança
          </Text>
        </View>
      </View>

      {/* Botão de análise */}
      {image && (
        <TouchableOpacity
          style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
          onPress={analyzeImage}
          disabled={loading}
          accessibilityLabel="Enviar imagem para análise pelo modelo"
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.analyzeButtonText}>Analisar imagem →</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ──────────────────────────────────────────────────────────
// Estilos
// ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F1F5F9" },
  container: { padding: 20, paddingBottom: 40 },

  header: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F8FAFC",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },

  uploadCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    marginBottom: 16,
    overflow: "hidden",
  },
  uploadPlaceholder: {
    padding: 32,
    alignItems: "center",
  },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  uploadHint: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  uploadButtons: { flexDirection: "row", gap: 12 },
  uploadBtn: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  uploadBtnText: { fontSize: 14, color: "#334155", fontWeight: "500" },

  imagePreviewWrapper: { alignItems: "center" },
  imagePreview: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  changeButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(15,23,42,0.75)",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  changeButtonText: { color: "#fff", fontSize: 13, fontWeight: "500" },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 12,
  },
  infoStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
    flexShrink: 0,
  },
  infoText: { fontSize: 13, color: "#475569", flex: 1, lineHeight: 20 },

  analyzeButton: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  analyzeButtonDisabled: { backgroundColor: "#64748B" },
  analyzeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
