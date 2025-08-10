import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/Components/Colors";
import { useRouter } from "expo-router";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Inscription = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailSignup = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'inscription
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Succès", "Compte créé !", [
        { text: "OK", onPress: () => router.push("/") },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Problème lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: string) => {
    Alert.alert("Info", `Inscription avec ${provider} en cours...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/dait4sfc5/image/upload/v1741799422/Banniere_login_ij56s0.png",
              }}
              style={styles.image}
            />
            <Text style={styles.title}>Créer un compte</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Avec votre email</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.gray}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.gray}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={20}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>

            {/* Bouton Inscription */}
            <Pressable
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleEmailSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Créer mon compte</Text>
              )}
            </Pressable>

            {/* Conditions */}
            <Text style={styles.terms}>
              En vous inscrivant, vous acceptez nos{" "}
              <Text style={styles.link}>conditions d&apos;utilisation</Text>
            </Text>
          </View>

          {/* Diviseur */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou continuez avec</Text>
            <View style={styles.line} />
          </View>

          {/* Boutons Sociaux */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
              onPress={() => handleSocialSignup("Google")}
            >
              <AntDesign name="google" size={24} color="white" />
            </TouchableOpacity>

  

            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#000" }]}
                onPress={() => handleSocialSignup("Apple")}
              >
                <AntDesign name="apple1" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Lien Connexion */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push("/connexion")}>
              <Text style={styles.link}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Inscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  image: {
    height: 150,
    width: "100%",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
    marginTop: 20,
  },

  form: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 20,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,

    marginBottom: 15,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  terms: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },

  link: {
    color: Colors.primary,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light,
  },

  dividerText: {
    marginHorizontal: 15,
    fontSize: 14,
    color: Colors.gray,
  },

  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    paddingBottom: 20,
  },

  loginText: {
    fontSize: 14,
    color: Colors.gray,
  },
});
