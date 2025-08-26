import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "./Colors";

const { width } = Dimensions.get("window");

interface NotAuthenticatedProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  redirectRoute?: string;
}

const NotAuthenticated: React.FC<NotAuthenticatedProps> = ({
  title = "Accès Restreint",
  subtitle = "Vous devez être un agent authentifié pour accéder à cette page",
  buttonText = "Devenir un agent",
  redirectRoute = '/inscription',
}) => {

  const router = useRouter();

  const handleRedirect = () => {
    router.push(redirectRoute as any);
  };


  return (
    <View style={styles.container}>
      {/* Icon ou Image */}
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed-outline" size={64} color={Colors.primary} />
      </View>

      {/* Titre principal */}
      <Text style={styles.title}>{title}</Text>

      {/* Sous-titre explicatif */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Message additionnel */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Pour publier et gérer vos annonces immobilières, vous devez créer un
          compte agent.
        </Text>
      </View>

      {/* Bouton d'action principal */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleRedirect}
        activeOpacity={0.8}
      >
        <Ionicons
          name="person-add-outline"
          size={20}
          color="white"
          style={styles.buttonIcon}
        />
        <Text style={styles.primaryButtonText}>{buttonText}</Text>
      </TouchableOpacity>

      {/* Bouton secondaire pour se connecter */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push('/connexion')}
        activeOpacity={0.8}
      >
        <Text style={styles.secondaryButtonText}>
          Déjà agent ? Se connecter
        </Text>
      </TouchableOpacity>

      {/* Informations supplémentaires */}
      {/* <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>Publication d&apos;annonces</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>Gestion de portfolio</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.infoText}>Tableau de bord avancé</Text>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#f8f9fa",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  messageContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 14,
    color: "#495057",
    textAlign: "center",
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
    minWidth: width * 0.7,
    shadowColor: Colors.light,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",

    textDecorationLine: "underline",
  },
  infoContainer: {
    alignItems: "flex-start",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#495057",
  },
});

export default NotAuthenticated;
