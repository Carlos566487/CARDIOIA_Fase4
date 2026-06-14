/**
 * CardioIA — Tela de Resultado
 * Integrante 3: Carlos Eduardo — RM566487
 *
 * Exibe a classificação do modelo CNN com:
 * - Classe detectada e nível de confiança
 * - Barras de probabilidade por classe
 * - Aviso claro sobre limitações do uso clínico
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { imageUri, predictedClass, confidence, probabilities, isPlaceholder } =
    params;

  // JSON.parse protegido: evita crash se o parâmetro vier corrompido da navegação
  const parsedProbs = (() => {
    try {
      return JSON.parse(probabilities || "{}");
    } catch {
      return {};
    }
  })();

  // Fallback para 0 evita exibir "NaN%" se o parâmetro vier vazio ou inválido
  const confidenceNum = parseFloat(confidence) || 0;
  const isPlaceholderModel = isPlaceholder === "true";

  // Determina cor do badge pelo nível de confiança
  function getConfidenceColor(conf) {
    if (conf >= 85) return { bg: "#DCFCE7", text: "#166534", border: "#BBF7D0" };
    if (conf >= 65) return { bg: "#FEF9C3", text: "#854D0E", border: "#FEF08A" };
    return { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" };
  }

  const confColor = getConfidenceColor(confidenceNum);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {/* Imagem analisada */}
      <View style={styles.imageCard}>
        <Text style={styles.sectionLabel}>Imagem analisada</Text>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>

      {/* Banner de placeholder */}
      {isPlaceholderModel && (
        <View style={styles.placeholderBanner}>
          <Text style={styles.placeholderIcon}>⚠️</Text>
          <Text style={styles.placeholderText}>
            Modelo placeholder ativo. Resultados são simulados para fins de
            desenvolvimento. Substitua pelo modelo real do Integrante 2.
          </Text>
        </View>
      )}

      {/* Resultado principal */}
      <View style={styles.resultCard}>
        <Text style={styles.sectionLabel}>Classificação</Text>
        <Text style={styles.predictedClass}>{predictedClass}</Text>
        <View
          style={[
            styles.confidenceBadge,
            {
              backgroundColor: confColor.bg,
              borderColor: confColor.border,
            },
          ]}
        >
          <Text style={[styles.confidenceText, { color: confColor.text }]}>
            Confiança: {confidenceNum.toFixed(1)}%
          </Text>
        </View>
        <Text style={styles.confidenceHint}>
          {confidenceNum >= 85
            ? "Alta confiança do modelo"
            : confidenceNum >= 65
            ? "Confiança moderada — resultado incerto"
            : "Baixa confiança — resultado não confiável"}
        </Text>
      </View>

      {/* Probabilidades por classe */}
      <View style={styles.probCard}>
        <Text style={styles.sectionLabel}>Probabilidade por classe</Text>
        {Object.entries(parsedProbs).map(([cls, prob]) => (
          <View key={cls} style={styles.probRow}>
            <View style={styles.probLabelRow}>
              <Text style={styles.probClass}>{cls}</Text>
              <Text style={styles.probValue}>{prob.toFixed(1)}%</Text>
            </View>
            <View style={styles.probBarBg}>
              <View
                style={[
                  styles.probBarFill,
                  {
                    width: `${prob}%`,
                    backgroundColor:
                      cls === predictedClass ? "#0F172A" : "#CBD5E1",
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Aviso clínico */}
      <View style={styles.warningCard}>
        <Text style={styles.warningTitle}>⚕️ Aviso importante</Text>
        <Text style={styles.warningText}>
          Este sistema é um protótipo educacional desenvolvido para a disciplina
          de Inteligência Artificial na FIAP. Os resultados não devem ser
          utilizados para diagnóstico clínico real. Consulte sempre um
          profissional de saúde habilitado.
        </Text>
      </View>

      {/* Ações */}
      <TouchableOpacity
        style={styles.newAnalysisButton}
        onPress={() => router.replace("/")}
        accessibilityLabel="Voltar e realizar nova análise"
      >
        <Text style={styles.newAnalysisText}>← Nova análise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ──────────────────────────────────────────────────────────
// Estilos
// ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#F1F5F9" },
  container: { padding: 20, paddingBottom: 40 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 12,
  },

  imageCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },

  placeholderBanner: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  placeholderIcon: { fontSize: 16 },
  placeholderText: { fontSize: 12, color: "#92400E", flex: 1, lineHeight: 18 },

  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
  },
  predictedClass: {
    fontSize: 36,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  confidenceBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  confidenceText: { fontSize: 14, fontWeight: "600" },
  confidenceHint: { fontSize: 12, color: "#64748B", textAlign: "center" },

  probCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
  },
  probRow: { marginBottom: 14 },
  probLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  probClass: { fontSize: 14, color: "#1E293B", fontWeight: "500" },
  probValue: { fontSize: 14, color: "#1E293B", fontWeight: "600" },
  probBarBg: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  probBarFill: { height: "100%", borderRadius: 4 },

  warningCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9A3412",
    marginBottom: 6,
  },
  warningText: { fontSize: 12, color: "#7C2D12", lineHeight: 18 },

  newAnalysisButton: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  newAnalysisText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
