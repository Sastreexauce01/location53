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
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";

// Types pour les données du formulaire
interface FormData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Type pour les champs du formulaire
type FormField = keyof FormData;

const Inscription: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Validation email
  const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation téléphone
  const validatePhone = (phone: string): boolean => {
    const phoneRegex: RegExp = /^(\+229|00229|229)?[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleInputChange = (field: FormField, value: string): void => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour vérifier si tous les champs sont remplis et valides
  const isFormValid = (): boolean => {
    return Boolean(
      formData.email &&
        validateEmail(formData.email) &&
        formData.phone &&
        validatePhone(formData.phone) &&
        formData.password &&
        formData.password.length >= 6 &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword
    );
  };

  // Fonction d'inscription avec Supabase
  const handleSignup = async (): Promise<void> => {
    if (!isFormValid()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs correctement");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            phone: formData.phone,
          },
        },
      });

      console.log("data", data);
      console.log("error", error);

      if (error) {
        Alert.alert("Erreur", error.message);
        return;
      }

      // Toujours rediriger vers la page de vérification
      // L'utilisateur DOIT confirmer son email avant d'être connecté
      if (data.user) {
        router.push({
          pathname: "/inscription/verification-email",
          params: { 
            email: formData.email,
            phone: formData.phone,
            fromSignup: "true"
          }
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header simplifié */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <MaterialIcons name="arrow-back" size={24} color={Colors.dark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Inscription</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Image et texte d'accueil */}
            <View style={styles.welcomeSection}>
              <View style={styles.imageContainer}>
                <MaterialIcons name="person-add" size={60} color={Colors.primary} />
              </View>
              <Text style={styles.welcomeTitle}>Créer votre compte</Text>
              <Text style={styles.welcomeText}>
                Rejoignez notre communauté et découvrez toutes nos fonctionnalités
              </Text>
            </View>

            {/* Champs du formulaire */}
            <View style={styles.inputSection}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View
                  style={[
                    styles.inputContainer,
                    formData.email &&
                      !validateEmail(formData.email) &&
                      styles.inputError,
                  ]}
                >
                  <MaterialIcons name="email" size={18} color={Colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChangeText={(value: string) =>
                      handleInputChange("email", value)
                    }
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={Colors.gray}
                  />
                  {formData.email && validateEmail(formData.email) && (
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#4CAF50"
                    />
                  )}
                </View>
              </View>

              {/* Téléphone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <View
                  style={[
                    styles.inputContainer,
                    formData.phone &&
                      !validatePhone(formData.phone) &&
                      styles.inputError,
                  ]}
                >
                  <MaterialIcons name="phone" size={18} color={Colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="+229 XX XX XX XX"
                    value={formData.phone}
                    onChangeText={(value: string) =>
                      handleInputChange("phone", value)
                    }
                    keyboardType="phone-pad"
                    placeholderTextColor={Colors.gray}
                  />
                  {formData.phone && validatePhone(formData.phone) && (
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#4CAF50"
                    />
                  )}
                </View>
              </View>

              {/* Mot de passe */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mot de passe</Text>
                <View
                  style={[
                    styles.inputContainer,
                    formData.password &&
                      formData.password.length < 6 &&
                      styles.inputError,
                  ]}
                >
                  <MaterialIcons name="lock" size={18} color={Colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Minimum 6 caractères"
                    value={formData.password}
                    onChangeText={(value: string) =>
                      handleInputChange("password", value)
                    }
                    secureTextEntry={!showPassword}
                    placeholderTextColor={Colors.gray}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility-off" : "visibility"}
                      size={18}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirmer mot de passe */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmer le mot de passe</Text>
                <View
                  style={[
                    styles.inputContainer,
                    formData.confirmPassword &&
                      formData.password !== formData.confirmPassword &&
                      styles.inputError,
                  ]}
                >
                  <MaterialIcons
                    name="lock-outline"
                    size={18}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmer votre mot de passe"
                    value={formData.confirmPassword}
                    onChangeText={(value: string) =>
                      handleInputChange("confirmPassword", value)
                    }
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor={Colors.gray}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialIcons
                      name={showConfirmPassword ? "visibility-off" : "visibility"}
                      size={18}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <Text style={styles.errorText}>
                    Les mots de passe ne correspondent pas
                  </Text>
                )}
              </View>
            </View>

            {/* Bouton Inscription */}
            <Pressable
              style={[
                styles.button,
                (!isFormValid() || loading) && styles.buttonDisabled,
              ]}
              onPress={handleSignup}
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.buttonText}>Création...</Text>
                </View>
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

          {/* Lien Connexion */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push("/connexion")}>
              <Text style={styles.linkButton}>Se connecter</Text>
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
    backgroundColor: "#F8F9FA",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
  },

  backButton: {
    padding: 8,
    marginRight: 12,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.dark,
  },

  form: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  welcomeSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.dark,
    marginBottom: 8,
  },

  welcomeText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  inputSection: {
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.dark,
    marginBottom: 6,
    marginLeft: 2,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FAFBFC",
    gap: 10,
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

  errorText: {
    fontSize: 11,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 2,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
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

  terms: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 16,
  },

  link: {
    color: Colors.primary,
    fontWeight: "500",
  },

  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    marginTop: 20,
  },

  loginText: {
    fontSize: 14,
    color: Colors.gray,
  },

  linkButton: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
});