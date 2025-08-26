import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";
import { AnnonceType } from "@/assets/Types/type";
import { AnnonceItem } from "@/Components/AnnonceItem";
import { Colors } from "@/Components/Colors";
import Loading from "@/Components/Loading";

import { supabase } from "@/utils/supabase";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Type pour les agents
interface AgentType {
  id: string;
  email: string;
  role: string;
  updated_at: string;
  // Ajoutez d'autres champs selon votre base de données
}

const PageAdmin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"annonces" | "agents">("annonces");

  const [listAppartments, setListAppartments] = useState<AnnonceType[]>([]);
  const [listAgents, setListAgents] = useState<AgentType[]>([]);

  const { fetchdataAll } = useAnnonce_Data();

  // Charger les annonces
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchdataAll();
        await fetchAgents();
        setListAppartments(data || []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        setListAppartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchdataAll]);

  // Charger les agents
  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "agent") // ✅ Correction de la syntaxe
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        Alert.alert("Erreur", "Impossible de charger les agents");
        return;
      }

      // const newData:AgentType={

      // }

      setListAgents(data || []);
    } catch (error) {
      console.error("❌ Une erreur est survenue:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les agents au changement d'onglet
  useEffect(() => {
    if (activeTab === "agents") {
      fetchAgents();
      fetchdataAll();
    }
  }, [activeTab, fetchdataAll]);

  // Composant pour afficher les annonces
  const RenderAnnonces = () => {
    return (
      <View style={styles.container_annonce}>
        {listAppartments.length === 0 ? (
          <View style={styles.noDataContainer}>
            <FontAwesome6 name="house" size={50} color={Colors.gray} />
            <Text style={styles.noDataText}>Aucune annonce trouvée</Text>
            <Text style={styles.noDataSubText}>
              Créez votre première annonce pour commencer
            </Text>
          </View>
        ) : (
          listAppartments.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.annonce}
              onPress={() => router.push(`/annonces/${item.id}`)}
            >
              <AnnonceItem item={item} />
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  // Composant pour afficher les agents
  const RenderAgents = () => {
    return (
      <View style={styles.container_agents}>
        {listAgents.length === 0 ? (
          <View style={styles.noDataContainer}>
            <FontAwesome6 name="users" size={50} color={Colors.gray} />
            <Text style={styles.noDataText}>Aucun agent trouvé</Text>
            <Text style={styles.noDataSubText}>
              Aucun agent n&apos;est encore enregistré
            </Text>
          </View>
        ) : (
          listAgents.map((agent) => (
            <TouchableOpacity
              key={agent.id}
              style={styles.agentCard}
              onPress={() => {
                // Navigation vers le profil de l'agent si nécessaire
                console.log("Agent sélectionné:", agent.email);
              }}
            >
              <View style={styles.agentInfo}>
                <FontAwesome6 name="user" size={42} color={Colors.primary} />
                <View style={styles.agentDetails}>
                  <Text style={styles.agentEmail}>{agent.email}</Text>
                  <Text style={styles.agentRole}>Agent immobilier</Text>
                  <Text style={styles.agentDate}>
                    Inscrit le
                    {new Date(agent.updated_at).toLocaleDateString("fr-FR")}
                  </Text>
                </View>
              </View>
              <FontAwesome6
                name="chevron-right"
                size={16}
                color={Colors.gray}
              />
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Dashboard Admin</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "annonces" && styles.activeTab]}
          onPress={() => setActiveTab("annonces")}
        >
          <FontAwesome6
            name="house"
            size={16}
            color={activeTab === "annonces" ? Colors.light : Colors.gray}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "annonces" && styles.activeTabText,
            ]}
          >
            Annonces ({listAppartments.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "agents" && styles.activeTab]}
          onPress={() => setActiveTab("agents")}
        >
          <FontAwesome6
            name="users"
            size={16}
            color={activeTab === "agents" ? Colors.light : Colors.gray}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "agents" && styles.activeTabText,
            ]}
          >
            Agents ({listAgents.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "annonces" ? <RenderAnnonces /> : <RenderAgents />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PageAdmin;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: Colors.light || "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.dark,
    marginBottom: 20,
  },

  // Styles pour les tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light || "#f5f5f5",
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary || "#007AFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray,
  },
  activeTabText: {
    color: Colors.light || "#fff",
    fontWeight: "600",
  },

  // Styles pour les annonces
  container_annonce: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-between",
  },
  annonce: {
    height: 185,
    width: "45%",
  },

  // Styles pour les agents
  container_agents: {
    gap: 15,
  },
  agentCard: {
    backgroundColor: Colors.light || "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: Colors.light || "#e5e5e5",
  },
  agentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  agentDetails: {
    flex: 1,
  },
  agentEmail: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  agentRole: {
    fontSize: 14,
    color: Colors.primary || "#007AFF",
    marginBottom: 2,
  },
  agentDate: {
    fontSize: 12,
    color: Colors.gray,
  },

  // Styles communs
  noDataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    width: "100%",
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
    marginTop: 20,
    textAlign: "center",
  },
  noDataSubText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
  },
});
