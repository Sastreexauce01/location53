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

import { Colors } from "@/Components/Colors";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Password = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez saisir votre adresse email");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez saisir une adresse email valide");
      return;
    }

    setIsLoading(true);
    try {
      // Simulation d'envoi d'email
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert("Succès", "Email renvoyé avec succès !");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de renvoyer l'email");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          {/* Icône de succès */}
          <View style={styles.successIcon}>
            <MaterialIcons
              name="mark-email-read"
              size={80}
              color={Colors.primary}
            />
          </View>

          {/* Titre et message */}
          <Text style={styles.successTitle}>Email envoyé !</Text>
          <Text style={styles.successMessage}>
            Nous avons envoyé un lien de réinitialisation à{" "}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <View style={styles.instructionItem}>
              <MaterialIcons name="email" size={20} color={Colors.primary} />
              <Text style={styles.instructionText}>
                Vérifiez votre boîte de réception
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <MaterialIcons name="folder" size={20} color={Colors.primary} />
              <Text style={styles.instructionText}>
                Regardez aussi dans les spams
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <MaterialIcons name="link" size={20} color={Colors.primary} />
              <Text style={styles.instructionText}>
                Cliquez sur le lien pour réinitialiser
              </Text>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : (
                <Text style={styles.secondaryButtonText}>
                  Renvoyer l&apos;email
                </Text>
              )}
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Retour à la connexion</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header avec bouton retour */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mot de passe oublié</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationCircle}>
              <MaterialIcons
                name="lock-reset"
                size={60}
                color={Colors.primary}
              />
            </View>
          </View>

          {/* Contenu principal */}
          <View style={styles.content}>
            <Text style={styles.title}>Récupérer votre mot de passe</Text>
            <Text style={styles.description}>
              Saisissez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </Text>

            {/* Input Email */}
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={Colors.primary} />
              <TextInput
                style={styles.input}
                placeholder="Votre adresse email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor={Colors.gray}
              />
            </View>

            {/* Bouton d'envoi */}
            <Pressable
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Envoyer le lien</Text>
              )}
            </Pressable>

            {/* Lien retour */}
            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => router.back()}
            >
              <MaterialIcons
                name="arrow-back"
                size={16}
                color={Colors.primary}
              />
              <Text style={styles.backToLoginText}>Retour à la connexion</Text>
            </TouchableOpacity>
          </View>

          {/* Aide */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpTitle}>Besoin d&apos;aide ?</Text>
            <Text style={styles.helpText}>
              Contactez notre support à{" "}
              <Text style={styles.helpLink}>support@example.com</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
  },

  placeholder: {
    width: 40,
  },

  illustrationContainer: {
    alignItems: "center",
    marginVertical: 30,
  },

  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.light,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 25,
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

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "bold",
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },

  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },

  backToLogin: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  backToLoginText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },

  helpContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.light,
    marginHorizontal: 20,
    borderRadius: 12,
  },

  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 8,
    textAlign: "center",
  },

  helpText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },

  helpLink: {
    color: Colors.primary,
    fontWeight: "600",
  },

  // Styles pour l'écran de succès
  successContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  successIcon: {
    alignItems: "center",
    marginBottom: 30,
  },

  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark,
    textAlign: "center",
    marginBottom: 16,
  },

  successMessage: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },

  emailText: {
    color: Colors.primary,
    fontWeight: "600",
  },

  instructionsContainer: {
    backgroundColor: Colors.light,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },

  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },

  instructionText: {
    fontSize: 14,
    color: Colors.dark,
    flex: 1,
  },

  actionButtons: {
    gap: 12,
  },
});
