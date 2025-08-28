import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";
import { AnnonceType } from "@/assets/Types/type";

import { Colors } from "@/Components/Colors";
import Loading from "@/Components/Loading";

import { supabase } from "@/utils/supabase";
import {
  FontAwesome6,
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
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
  phone: string;
  role: string;
  updated_at: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  // Ajoutez d'autres champs selon votre base de données
}

const PageAdmin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"annonces" | "agents">("annonces");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    AnnonceType | AgentType | null
  >(null);
  const [listAppartments, setListAppartments] = useState<AnnonceType[]>([]);
  const [listAgents, setListAgents] = useState<AgentType[]>([]);

  const { fetchDataAdmin } = useAnnonce_Data();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDataAdmin();
        setListAppartments(data || []);
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        setListAppartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchDataAdmin]);

  // Charger les agents
  const fetchAgents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "agent")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        Alert.alert("Erreur", "Impossible de charger les agents");
        return;
      }
      setListAgents(data || []);
    } catch (error) {
      console.error("❌ Une erreur est survenue:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Fonction pour obtenir la couleur du badge selon le statut
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4CAF50"; // Vert
      case "rejected":
        return "#F44336"; // Rouge
      case "suspended":
        return "#FF9800"; // Orange pour bloqué
      case "pending":
      default:
        return "#FF9800"; // Orange
    }
  };

  // Fonction pour obtenir le texte du badge selon le statut
  const getBadgeText = (status: string, isAgent: boolean = false) => {
    if (isAgent) {
      switch (status) {
        case "approved":
          return "Actif";
        case "rejected":
          return "Rejeté";
        case "suspended":
          return "Bloqué";
        case "pending":
        default:
          return "En attente";
      }
    } else {
      // Pour les annonces
      switch (status) {
        case "approved":
          return "Approuvée";
        case "rejected":
          return "Rejetée";
        case "pending":
        default:
          return "En attente";
      }
    }
  };

  // Fonction pour gérer les actions sur les annonces
  const handleAnnonceAction = async (
    action: "approve" | "reject",
    item: AnnonceType
  ) => {
    try {
      // Logique pour approuver/rejeter l'annonce
      console.log(`${action} annonce:`, item.id);

      // Exemple d'appel API
      const { error } = await supabase
        .from("annonces")
        .update({ status: action === "approve" ? "approved" : "rejected" })
        .eq("id", item.id);

      if (error) {
        console.error(error);
      }

      setListAppartments((await fetchDataAdmin()) || []);

      Alert.alert(
        "Succès",
        `Annonce ${action === "approve" ? "approuvée" : "rejetée"} avec succès`
      );

      setModalVisible(false);
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

  // Fonction pour gérer les actions sur les agents (bloquer/activer)
  const handleAgentAction = async (
    action: "block" | "activate",
    item: AgentType
  ) => {
    try {
      console.log(`${action} agent:`, item.id);

      const newStatus = action === "block" ? "suspended" : "approved";
      const successMessage = action === "block" 
        ? "Agent bloqué avec succès" 
        : "Agent activé avec succès";

      // Appel API
      const { error } = await supabase
        .from("user_roles")
        .update({ status: newStatus })
        .eq("id", item.id);

      if (error) {
        console.error(error);
      }

      await fetchAgents();

      Alert.alert("Succès", successMessage);
      setModalVisible(false);
    } catch (error) {
      console.error("Erreur:", error);
      Alert.alert("Erreur", "Une erreur est survenue");
    }
  };

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
            <View key={item.id} style={styles.annonceWrapper}>
              <TouchableOpacity
                style={styles.annonce}
                onPress={() => router.push(`/annonces/${item.id}`)}
              >
                <Image
                  source={item.image[0]}
                  style={{ height: 150, width: "100%", borderRadius: 10 }}
                  contentFit="cover"
                />
              </TouchableOpacity>

              {/* Badge de statut amélioré */}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getBadgeColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getBadgeText(item.status, false)}
                </Text>
              </View>

              {/* Bouton options */}
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => {
                  setSelectedItem(item);
                  setModalVisible(true);
                }}
              >
                <SimpleLineIcons
                  name="options-vertical"
                  size={16}
                  color={Colors.gray}
                />
              </TouchableOpacity>
            </View>
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
              style={[
                styles.agentCard,
                { opacity: agent.status === "suspended" ? 0.6 : 1 },
              ]}
              onPress={() => {
                setSelectedItem(agent);
                setModalVisible(true);
              }}
            >
              <View style={styles.agentInfo}>
                <View style={styles.avatarContainer}>
                  <FontAwesome6 name="user" size={20} color={Colors.primary} />
                  {/* Indicateur de statut */}
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getBadgeColor(agent.status) },
                    ]}
                  />
                </View>

                <View style={styles.agentDetails}>
                  <Text style={styles.agentEmail}>{agent.email}</Text>
                  <Text style={styles.agentRole}>Agent immobilier</Text>
                  <View style={styles.agentStatusContainer}>
                    <View
                      style={[
                        styles.agentStatusBadge,
                        { backgroundColor: getBadgeColor(agent.status) },
                      ]}
                    >
                      <Text style={styles.agentStatusText}>
                        {getBadgeText(agent.status, true)}
                      </Text>
                    </View>
                  </View>
                  {agent.phone && (
                    <Text style={styles.agentPhone}>{agent.phone}</Text>
                  )}
                  <Text style={styles.agentDate}>
                    Inscrit le{" "}
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

  const OptionModal = () => {
    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalContainer}>
            {/* Header du modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>
                {activeTab === "annonces" ? "Gérer l'annonce" : "Gérer l'agent"}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <FontAwesome6 name="times" size={18} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            {/* Actions selon l'onglet actif */}
            <View style={styles.modalContent}>
              {activeTab === "annonces" ? (
                <>
                  {/* Actions pour les annonces */}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() =>
                      selectedItem &&
                      handleAnnonceAction(
                        "approve",
                        selectedItem as AnnonceType
                      )
                    }
                  >
                    <View style={styles.actionIcon}>
                      <FontAwesome6 name="check" size={18} color="#4CAF50" />
                    </View>
                    <View style={styles.actionTextContainer}>
                      <Text style={styles.actionTitle}>Approuver</Text>
                      <Text style={styles.actionDescription}>
                        Valider et publier cette annonce
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() =>
                      selectedItem &&
                      handleAnnonceAction("reject", selectedItem as AnnonceType)
                    }
                  >
                    <View style={styles.actionIcon}>
                      <FontAwesome name="times" size={18} color="#F44336" />
                    </View>
                    <View style={styles.actionTextContainer}>
                      <Text style={styles.actionTitle}>Rejeter</Text>
                      <Text style={styles.actionDescription}>
                        Refuser la publication de cette annonce
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Actions pour les agents - Bloquer ou Activer selon le statut */}
                  {selectedItem && 
                   (selectedItem as AgentType).status === "suspended" ? (
                    // Si l'agent est bloqué, afficher "Activer"
                    <TouchableOpacity
                      style={[styles.actionButton, styles.activateButton]}
                      onPress={() =>
                        selectedItem &&
                        handleAgentAction("activate", selectedItem as AgentType)
                      }
                    >
                      <View style={styles.actionIcon}>
                        <FontAwesome6 name="check" size={18} color="#4CAF50" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Activer</Text>
                        <Text style={styles.actionDescription}>
                          Réactiver le compte de cet agent
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    // Sinon, afficher "Bloquer"
                    <TouchableOpacity
                      style={[styles.actionButton, styles.blockButton]}
                      onPress={() =>
                        selectedItem &&
                        handleAgentAction("block", selectedItem as AgentType)
                      }
                    >
                      <View style={styles.actionIcon}>
                        <MaterialIcons name="block" size={18} color="#FF9800" />
                      </View>
                      <View style={styles.actionTextContainer}>
                        <Text style={styles.actionTitle}>Bloquer</Text>
                        <Text style={styles.actionDescription}>
                          Suspendre cet agent
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
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

      <OptionModal />
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
  annonceWrapper: {
    width: "45%",
    position: "relative",
  },
  annonce: {
    height: 185,
    width: "100%",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  statusText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  optionsButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 10,
    zIndex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
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
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
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
    marginBottom: 6,
  },
  agentStatusContainer: {
    marginBottom: 6,
  },
  agentStatusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  agentStatusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
  },
  agentPhone: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 2,
  },
  agentDate: {
    fontSize: 11,
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

  // Styles pour le modal amélioré
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    position: "relative",
  },
  modalHandle: {
    position: "absolute",
    top: 8,
    left: "50%",
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark,
    flex: 1,
    textAlign: "center",
    marginTop: 8,
  },
  closeButton: {
    padding: 8,
    marginTop: 8,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 13,
    color: Colors.gray,
  },
  approveButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#f1f8e9",
  },
  rejectButton: {
    borderColor: "#F44336",
    backgroundColor: "#fef1f0",
  },
  activateButton: {
    borderColor: "#4CAF50",
    backgroundColor: "#f1f8e9",
  },
  blockButton: {
    borderColor: "#FF9800",
    backgroundColor: "#fff8e1",
  },
});