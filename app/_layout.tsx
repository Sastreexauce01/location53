import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade", // Ajoute un effet de transition fluide
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen name="annonces/[id]" />
      <Stack.Screen name="virtual360/[id]" />
 

   
      <Stack.Screen name="annonces/CreateAnnonce" />

      <Stack.Screen name="connexion/index" options={{ title: "Connexion" }} />
      
      <Stack.Screen
        name="inscription/index"
        options={{ title: "Inscription" }}
      />
      <Stack.Screen
        name="connexion/MotsPasseOublie"
        options={{ title: "Mot de passe oublié" }}
      />
    </Stack>
  );
}
