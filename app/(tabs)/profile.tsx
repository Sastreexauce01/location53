import { Text, View, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { Colors } from "@/Components/Colors";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { Data_setting, Data_support } from "@/Data/data";

import { useMemo } from "react";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export default function Profile() {
  // Données utilisateur (idéalement récupérées d'un contexte ou API)
  const userProfile: UserProfile = useMemo(() => ({
    name: "Exauce SASTRE",
    email: "sastreexauce01@gmail.com",
    avatar: "https://www.w3schools.com/w3images/avatar2.png"
  }), []);

  const handleProfileEdit = () => {
    // Navigation vers la page d'édition du profil
    console.log("Édition du profil");
    // router.push("/profile/edit");
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => {
            // Logique de déconnexion
            console.log("Déconnexion confirmée");
            // Supprimer les tokens, vider le cache, rediriger vers login
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Section Information profil */}
        <Pressable style={styles.Container_information} onPress={handleProfileEdit}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: userProfile.avatar }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.information}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <Text style={styles.userEmail}>{userProfile.email}</Text>
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
                  index === Data_setting.length - 1 && styles.lastMenuItem
                ]}
                onPress={() => console.log(`Pressed: ${item.title || item.title}`)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
                    {/* Remplacez par votre icône selon item.icon */}
                    <AntDesign name="setting" size={20} color={item.color || Colors.primary} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title || item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                <AntDesign name="right" size={16} color={Colors.dark} />
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
                  index === Data_support.length - 1 && styles.lastMenuItem
                ]}
                onPress={() => console.log(`Pressed: ${item.title || item.title}`)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}>
                    {/* Remplacez par votre icône selon item.icon */}
                    <SimpleLineIcons name="support" size={18} color={item.color || Colors.primary} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title || item.title}</Text>
                    {item.subtitle && (
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                </View>
                <AntDesign name="right" size={16} color={Colors.primary} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section Déconnexion */}
        <Pressable style={styles.logoutContainer} onPress={handleLogout}>
          <SimpleLineIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  "#f8f9fa",
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
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
    color: "#666",
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },

  // Nouveaux styles pour les items de menu
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
    color: "#666",
    marginTop: 2,
  },

  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  logoutText: {
    color: Colors.error,
    fontWeight: "500",
    fontSize: 16,
  },
});