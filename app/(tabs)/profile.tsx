import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/Components/Colors";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Data_setting, Data_support } from "@/Data/data";

import { supabase } from "@/utils/supabase";
// Correction du chemin
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/assets/hooks/useAuth";
import NotAuthenticated from "@/Components/NotAuthenticated";

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  // const router = useRouter();

  // Écran de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !user) {
    return <NotAuthenticated />;
  }

  // Utiliser les vraies données de l'utilisateur connecté
  // Ce calcul est très léger et rapide
  const userProfile = {
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      "Utilisateur",
    email: user.email || "Email non disponible",
    avatar:
      user.user_metadata?.avatar_url ||
      "https://www.w3schools.com/w3images/avatar2.png",
  };

  const handleProfileEdit = () => {
    console.log("Édition du profil");
    // router.push("/profile/edit");
  };

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) {
              Alert.alert("Erreur", error.message);
            }
            // La redirection sera gérée automatiquement par le hook useAuth
          } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
            Alert.alert("Erreur", "Impossible de se déconnecter");
          }
        },
      },
    ]);
  };

  const handleMenuItemPress = (item: any) => {
    console.log(`Pressed: ${item.title}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Section Information profil */}
          <Pressable
            style={styles.Container_information}
            onPress={handleProfileEdit}
          >
            <View style={styles.profileInfo}>
              <Image
                source={{ uri: userProfile.avatar }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                placeholder="https://www.w3schools.com/w3images/avatar2.png"
              />
              <View style={styles.information}>
                <Text style={styles.userName}>{userProfile.name}</Text>
                <Text style={styles.userEmail}>{userProfile.email}</Text>
                <View style={styles.verifiedBadge}>
                  <AntDesign name="checkcircle" size={12} color="#4CAF50" />
                  <Text style={styles.verifiedText}>Email vérifié</Text>
                </View>
              </View>
            </View>
            <AntDesign name="right" size={20} color={Colors.dark} />
          </Pressable>

          {/* Section Paramètres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres et préférences</Text>
            <View style={styles.itemsContainer}>
              {Data_setting.map((item, index) => (
                <Pressable
                  key={`setting-${index}`}
                  style={[
                    styles.menuItem,
                    index === Data_setting.length - 1 && styles.lastMenuItem,
                  ]}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            (item.color || Colors.primary) + "20",
                        },
                      ]}
                    >
                      {/* Vous pouvez améliorer ceci en ajoutant une propriété icon à vos données */}
                      <AntDesign
                        name="setting"
                        size={20}
                        color={item.color || Colors.primary}
                      />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  <AntDesign name="right" size={16} color={Colors.gray} />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.itemsContainer}>
              {Data_support.map((item, index) => (
                <Pressable
                  key={`support-${index}`}
                  style={[
                    styles.menuItem,
                    index === Data_support.length - 1 && styles.lastMenuItem,
                  ]}
                  onPress={() => handleMenuItemPress(item)}
                >
                  <View style={styles.menuItemLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            (item.color || Colors.primary) + "20",
                        },
                      ]}
                    >
                      <SimpleLineIcons
                        name="support"
                        size={18}
                        color={item.color || Colors.primary}
                      />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      {item.subtitle && (
                        <Text style={styles.menuItemSubtitle}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                  <AntDesign name="right" size={16} color={Colors.gray} />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Informations du compte */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations du compte</Text>
            <View style={styles.itemsContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>ID Utilisateur</Text>
                <Text style={styles.infoValue}>{user.id.slice(0, 8)}...</Text>
              </View>
              <View style={[styles.infoItem, styles.lastInfoItem]}>
                <Text style={styles.infoLabel}>Membre depuis</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.created_at).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            </View>
          </View>

          {/* Section Déconnexion */}
          <Pressable style={styles.logoutContainer} onPress={handleLogout}>
            <SimpleLineIcons
              name="logout"
              size={20}
              color={Colors.error || "#FF4444"}
            />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray,
  },

  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },

  Container_information: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },

  information: {
    flex: 1,
    gap: 4,
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
  },

  userEmail: {
    fontSize: 14,
    color: Colors.gray || "#666",
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },

  verifiedText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light || "#f0f0f0",
  },

  section: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },

  itemsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  lastMenuItem: {
    borderBottomWidth: 0,
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  menuItemText: {
    flex: 1,
    gap: 2,
  },

  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.dark,
  },

  menuItemSubtitle: {
    fontSize: 13,
    color: Colors.gray || "#666",
    marginTop: 2,
  },

  // Nouveaux styles pour les informations du compte
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  lastInfoItem: {
    borderBottomWidth: 0,
  },

  infoLabel: {
    fontSize: 14,
    color: Colors.gray || "#666",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.dark,
  },

  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  logoutText: {
    color: Colors.error || "#FF4444",
    fontWeight: "500",
    fontSize: 16,
  },
});
