import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { Colors } from "@/Components/Colors";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/utils/supabase";

const VerificationEmail: React.FC = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Timer pour le renvoi d'email
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Gestion de la saisie OTP
  const handleOtpChange = (value: string, index: number): void => {
    if (value.length > 1) return; // Empêcher la saisie multiple

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Vérification automatique si tous les champs sont remplis
    const updatedOtp = [...newOtp];
    if (updatedOtp.every((digit) => digit !== "")) {
      const otpCode = updatedOtp.join("");
      handleVerifyOTP(otpCode);
    }
  };

  // Gestion du backspace
  const handleKeyPress = (key: string, index: number): void => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Animation de secousse pour erreur
  const shakeInputs = (): void => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Fonction pour vérifier l'OTP avec Supabase
  const handleVerifyOTP = async (otpCode?: string): Promise<void> => {
    const code = otpCode || otp.join("");

    if (code.length !== 6) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email as string,
        token: code,
        type: "signup",
      });

      if (error) {
        Alert.alert("Erreur", "Code de vérification invalide ou expiré");
        shakeInputs();
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }

      if (data.user && data.session) {
        Alert.alert(
          "Vérification réussie",
          "Votre compte a été activé avec succès !",
          [
            {
              text: "Continuer",
              onPress: () => router.push("/(tabs)"),
            },
          ]
        );
      }
    } catch (error: any) {
      console.error("Erreur lors de la vérification:", error);
      Alert.alert("Erreur", "Une erreur inattendue s'est produite");
      shakeInputs();
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour renvoyer l'email de vérification
  const handleResendEmail = async (): Promise<void> => {
    if (!canResend) return;

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email as string,
      });

      if (error) {
        Alert.alert("Erreur", error.message);
        return;
      }

      Alert.alert(
        "Email envoyé",
        "Un nouveau code de vérification a été envoyé"
      );
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      console.error("Erreur lors du renvoi:", error);
      Alert.alert("Erreur", "Impossible de renvoyer l'email");
    } finally {
      setResendLoading(false);
    }
  };

  // Vérifier si tous les champs sont remplis - fonction supprimée car plus nécessaire

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={Colors.dark} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <MaterialIcons
              name="mark-email-read"
              size={80}
              color={Colors.primary}
            />
          </View>

          <Text style={styles.title}>Vérifiez votre email</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un code de vérification à
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Code OTP */}
        <Animated.View
          style={[
            styles.otpContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <Text style={styles.otpLabel}>Saisissez le code de vérification</Text>
          <View style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
              />
            ))}
          </View>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Colors.primary} size="small" />
              <Text style={styles.loadingText}>Vérification en cours...</Text>
            </View>
          )}
        </Animated.View>

        {/* Renvoi du code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Vous n&apos;avez pas reçu le code ?
          </Text>

          {canResend ? (
            <TouchableOpacity
              onPress={handleResendEmail}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <View style={styles.resendLoading}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.resendLink}>Envoi...</Text>
                </View>
              ) : (
                <Text style={styles.resendLink}>Renvoyer le code</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdown}>Renvoyer dans {timer}s</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationEmail;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    marginBottom: 20,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark,
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    marginBottom: 5,
  },

  email: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
  },

  otpContainer: {
    marginBottom: 40,
  },

  otpLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    textAlign: "center",
    marginBottom: 20,
  },

  otpInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    marginBottom: 20,
  },

  otpInput: {
    width: (width - 100) / 6 - 8,
    height: 45,
    borderBottomWidth: 2,
    borderBottomColor: "#E8E8E8",
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark,
    backgroundColor: "transparent",
    paddingBottom: 8,
  },

  otpInputFilled: {
    borderBottomColor: Colors.primary,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },

  loadingText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },

  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  resendText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 10,
  },

  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  resendLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  countdown: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: "500",
  },
});
