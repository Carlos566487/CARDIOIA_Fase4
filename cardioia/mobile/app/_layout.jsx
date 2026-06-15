import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0F172A" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0F172A" },
          headerTintColor: "#F8FAFC",
          headerTitleStyle: { fontWeight: "600", fontSize: 17 },
          contentStyle: { backgroundColor: "#F1F5F9" },
          animation: "slide_from_right",
        }}
<<<<<<< HEAD
      />
=======
      >
        <Stack.Screen name="index" options={{ title: "CardioIA" }} />
        <Stack.Screen name="result" options={{ title: "Resultado da Análise" }} />
      </Stack>
>>>>>>> b2e6e34e (Repositório limpo: histórico removido para corrigir limite de tamanho)
    </>
  );
}
