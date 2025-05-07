import {
  Text,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/Components/Colors";
import { Link } from "expo-router";
import { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";

const Login = () => {
  const [emailValue, setEmailValue] = useState<string>("");
  const [passwordsValue, setPasswordsValue] = useState<string>("");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/dait4sfc5/image/upload/v1741799422/Banniere_login_ij56s0.png",
          }}
          style={styles.image}
        />
        {/* Section de input */}
        <View>
          <View style={styles.container_input}>
            <MaterialIcons name="email" size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              onChangeText={setEmailValue}
              value={emailValue}
              placeholder="Adress email"
              keyboardType="email-address"
            />
          </View>
          {/* Input Passwords */}
          <View style={styles.container_input}>
            <Fontisto name="unlocked" size={20} color={Colors.primary} />
            <TextInput
              style={styles.input}
              onChangeText={setPasswordsValue}
              value={passwordsValue}
              placeholder="Mots de passe"
              keyboardType="email-address"
            />
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Link
              href={"/connexion/MotsPasseOublie"}
              style={{ fontWeight: "500", color: Colors.primary }}
            >
              Mots de passe oublie ?
            </Link>
          </View>
        </View>
        {/* Section Button  */}
        <Link href={"../"} asChild>
          <Pressable style={styles.Button}>
            <Text style={{ color: "white" }}>Connexion</Text>
          </Pressable>
        </Link>

        {/* Lien pour la page Inscription */}
        <View style={styles.container_inscription}>
          <Text style={{ color: Colors.dark }}>Vous n&apos;avez pas de compte?</Text>
          <Link href={"../Screen/inscription"} asChild>
            <Text style={{ color: Colors.primary, fontWeight: 500 }}>
              Inscrivez-vous ici
            </Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor:'orange',
    paddingVertical: 100,
    justifyContent: "space-between",
    flex: 1,
  },

  image: {
    height: 300,
    width: "100%",
    justifyContent: "flex-start",
  },

  container_input: {
    flexDirection: "row",
    borderWidth: 1,
    alignItems: "center",
    borderRadius: 8,
    padding: 8,
    borderColor: Colors.dark,
    marginBottom: 20, // Un peu d'espace sous l'input
  },

  container_inscription: {
    flexDirection: "row",
    gap: 4,
    color: Colors.dark,
    marginTop: 10,
  },

  input: {
    height: 30, // Augmenter la hauteur pour plus de confort
    width: "80%", // Augmenter la largeur
    //backgroundColor: Colors.light,
    paddingHorizontal: 10,
  },

  input_Container: {
    width: "100%", // Limiter la largeur à 80% de l'écran
    paddingHorizontal: 20,
    // backgroundColor:'orange'
  },

  Button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
});
