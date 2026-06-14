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
      />
    </>
  );
}
