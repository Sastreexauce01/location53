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
import { Link, useRouter } from "expo-router";
import { MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      // Simulation de connexion
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Succès", "Connexion réussie !", [
        { text: "OK", onPress: () => router.push("/") },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    Alert.alert("Info", `Connexion avec ${provider} en cours...`);
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
            <Text style={styles.title}>Se connecter</Text>
            <Text style={styles.subtitle}>Bon retour parmi nous !</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
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

            {/* Mot de passe oublié */}
            <View style={styles.forgotContainer}>
              <Link href={"/connexion/MotsPasseOublie"} asChild>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Bouton Connexion */}
            <Pressable
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleEmailLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </Pressable>
          </View>

          {/* Diviseur */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>ou connectez-vous avec</Text>
            <View style={styles.line} />
          </View>

          {/* Boutons Sociaux */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#DB4437" }]}
              onPress={() => handleSocialLogin("Google")}
            >
              <AntDesign name="google" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <Ionicons name="logo-facebook" size={24} color="white" />
            </TouchableOpacity>

            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: "#000" }]}
                onPress={() => handleSocialLogin("Apple")}
              >
                <AntDesign name="apple1" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Lien Inscription */}
          <View style={styles.signupLink}>
            <Text style={styles.signupText}>
              Vous n&apos;avez pas de compte ?
            </Text>
            <TouchableOpacity onPress={() => router.push("/inscription")}>
              <Text style={styles.link}>S&apos;inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark,
    marginTop: 20,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
  },

  form: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.light,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
    gap: 12,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 25,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  signupLink: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingBottom: 20,
  },

  signupText: {
    fontSize: 16,
    color: Colors.gray,
  },

  link: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
});
