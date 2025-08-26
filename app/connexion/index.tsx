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
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation email
  const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ FONCTION CORRIGÉE
  const isAdmin = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("id", userId)       // ✅ Utiliser id (clé primaire Auth)
        .eq("role", "admin");   // ✅ Vérifier explicitement le rôle admin

      if (error) {
        console.error("❌ Erreur lors de la vérification admin:", error);
        return false; // ✅ Retourner false en cas d'erreur
      }

      console.log("✅ Données admin récupérées:", data);
      
      // ✅ Retourner true si on trouve au moins un enregistrement admin
      return data && data.length > 0;
      
    } catch (error) {
      console.error("❌ Erreur dans isAdmin:", error);
      return false; // ✅ Retourner false en cas d'exception
    }
  };


  //  Mettre a jour le user rolees

  

  const handleEmailLogin = async () => {
    // Validation des champs
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez saisir une adresse email valide");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères"
      );
      return;
    }

    setIsLoading(true);

    try {
      // Connexion avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        Alert.alert("Erreur", error.message);
        return;
      }

      if (data.user) {
        // Vérifier si l'email est confirmé
        if (!data.user.email_confirmed_at) {
          Alert.alert(
            "Email non vérifié",
            "Votre compte n'est pas encore vérifié. Vous allez être redirigé vers la page de vérification.",
            [
              {
                text: "OK",
                onPress: () =>
                  router.push({
                    pathname: "/inscription/verification-email",
                    params: {
                      email: data.user.email,
                      fromLogin: "true",
                    },
                  }),
              },
            ]
          );
          return;
        }

        // ✅ LOGIQUE CORRIGÉE pour la redirection
        console.log("✅ Utilisateur connecté:", data.user.id);
        
        // Vérifier si l'utilisateur est admin
        const userIsAdmin = await isAdmin(data.user.id);
        
        console.log("✅ Est admin:", userIsAdmin);
        
        // Redirection selon le statut
        if (userIsAdmin) {
          console.log("🔑 Redirection vers dashboard admin");
          router.push("/dashboard");
        } else {
          console.log("👤 Redirection vers tabs utilisateur");
          router.push("/(tabs)");
        }
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de la connexion:", error);
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
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
            <View
              style={[
                styles.inputContainer,
                email && !validateEmail(email) && styles.inputError,
              ]}
            >
              <MaterialIcons name="email" size={18} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.gray}
              />
              {email && validateEmail(email) && (
                <MaterialIcons name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>

            {/* Password Input */}
            <View
              style={[
                styles.inputContainer,
                password && password.length < 6 && styles.inputError,
              ]}
            >
              <MaterialIcons name="lock" size={18} color={Colors.primary} />
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
                  size={18}
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
              style={[
                styles.button,
                (isLoading ||
                  !email ||
                  !password ||
                  !validateEmail(email) ||
                  password.length < 6) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleEmailLogin}
              disabled={
                isLoading ||
                !email ||
                !password ||
                !validateEmail(email) ||
                password.length < 6
              }
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.buttonText}>Connexion...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Se connecter</Text>
              )}
            </Pressable>
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
    backgroundColor: "#F8F9FA",
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "white",
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
    paddingBottom: 20,
  },

  form: {
    backgroundColor: "white",
    marginHorizontal: 10,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    gap: 10,
    backgroundColor: "#FAFBFC",
  },

  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500",
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },

  buttonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },

  signupLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  signupText: {
    fontSize: 14,
    color: Colors.gray,
  },

  link: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});