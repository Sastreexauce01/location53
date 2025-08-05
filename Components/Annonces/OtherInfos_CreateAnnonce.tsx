import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { Colors } from "../Colors";
import {  FontAwesome5, Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { icone_acessibilite } from "@/Data/data";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

interface AccessibilityItem {
  title: string;
  selected: boolean;
  icon?: string;
  category?: string;
}

const OtherInfos_CreateAnnonce = () => {
  const { annonce, saveAnnonce } = useAnnonce();
  const [acessibilite, setAcessibilite] = useState<AccessibilityItem[]>(icone_acessibilite);
  const [priceError, setPriceError] = useState<string>("");

  // Fonction pour valider le prix
  const validatePrice = (price: string): boolean => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) {
      setPriceError("Veuillez entrer un prix valide");
      return false;
    }
    if (numPrice < 0) {
      setPriceError("Le prix ne peut pas être négatif");
      return false;
    }
    if (numPrice > 999999999) {
      setPriceError("Le prix est trop élevé");
      return false;
    }
    setPriceError("");
    return true;
  };

  // Fonction pour formater le prix avec des espaces
  const formatPrice = (price: string): string => {
    const cleanPrice = price.replace(/\D/g, ''); // Garde seulement les chiffres
    return cleanPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // Ajoute des espaces tous les 3 chiffres
  };

  // Fonction pour gérer le changement de prix
  const handlePriceChange = (text: string) => {
    const cleanText = text.replace(/\D/g, ''); // Enlève tout sauf les chiffres
    
    if (validatePrice(cleanText)) {
      saveAnnonce({ ...annonce, prix: cleanText ? Number(cleanText) : 0 });
    }
  };

  // Fonction pour incrementer/decrementer avec validation
  const updateCounter = (field: 'nbre_chambre' | 'nbre_salle_bains', increment: boolean) => {
    const currentValue = annonce[field];
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1);
    
    // Limites raisonnables
    const maxValue = field === 'nbre_chambre' ? 20 : 10;
    
    if (newValue > maxValue) {
      Alert.alert(
        "Limite atteinte",
        `Le nombre maximum de ${field === 'nbre_chambre' ? 'chambres' : 'salles de bains'} est ${maxValue}.`,
        [{ text: "OK" }]
      );
      return;
    }

    saveAnnonce({
      ...annonce,
      [field]: newValue,
    });
  };

  // Fonction pour gérer la sélection d'accessibilité
  const toggleAccessibility = (index: number) => {
    const updatedAcessibilite = acessibilite.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    );

    setAcessibilite(updatedAcessibilite);

    const selectedTitles = updatedAcessibilite
      .filter((item) => item.selected)
      .map((item) => item.title);

    saveAnnonce({
      ...annonce,
      accessibilite: selectedTitles,
    });
  };

  // Fonction pour tout désélectionner
  const clearAllAccessibility = () => {
    const clearedAcessibilite = acessibilite.map(item => ({ ...item, selected: false }));
    setAcessibilite(clearedAcessibilite);
    saveAnnonce({
      ...annonce,
      accessibilite: [],
    });
  };

  // Grouper les accessibilités par catégorie (si disponible)
  const groupedAccessibility = acessibilite.reduce((acc, item, index) => {
    const category = item.category || 'Général';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...item, originalIndex: index });
    return acc;
  }, {} as Record<string, (AccessibilityItem & { originalIndex: number })[]>);

  const selectedCount = acessibilite.filter(item => item.selected).length;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Section Title */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Informations supplémentaires</Text>
        <Text style={styles.subtitle}>
          Ajoutez les détails qui rendront votre propriété attractive
        </Text>
      </View>

      {/* Section Prix */}
      <View style={styles.section}>
        <Text style={styles.label}>Prix de location</Text>
        <Text style={styles.helper}>Indiquez le prix mensuel en francs CFA</Text>
        
        <View style={[styles.container_input, priceError && styles.container_input_error]}>
          <MaterialIcons name="attach-money" size={20} color={Colors.primary} />
          <TextInput
            style={styles.input}
            placeholder="25 000"
            value={annonce.prix ? formatPrice(annonce.prix.toString()) : ""}
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={handlePriceChange}
            onSubmitEditing={() => Keyboard.dismiss()}
            maxLength={12} // Limite raisonnable
          />
          <Text style={styles.currency}>F CFA</Text>
        </View>
        
        {priceError ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={16} color={Colors.error || '#FF6B6B'} />
            <Text style={styles.errorText}>{priceError}</Text>
          </View>
        ) : annonce.prix > 0 && (
          <Text style={styles.pricePreview}>
            Prix mensuel : {formatPrice(annonce.prix.toString())} F CFA
          </Text>
        )}
      </View>

      {/* Section Caractéristiques */}
      <View style={styles.section}>
        <Text style={styles.label}>Caractéristiques de la propriété</Text>
        <Text style={styles.helper}>Spécifiez le nombre de chambres et de salles de bains</Text>

        {/* Chambres */}
        <View style={styles.container_propriete}>
          <View style={styles.propriete_info}>
            <View style={styles.iconLabelContainer}>
              <Ionicons name="bed-outline" size={24} color={Colors.primary} />
              <Text style={styles.propriete_label}>Chambres</Text>
            </View>
            <Text style={styles.propriete_note}>Nombre de chambres à coucher</Text>
          </View>

          <View style={styles.counter_container}>
            <Pressable
              style={[styles.counter_button, annonce.nbre_chambre <= 0 && styles.counter_button_disabled]}
              onPress={() => updateCounter('nbre_chambre', false)}
              disabled={annonce.nbre_chambre <= 0}
            >
              <MaterialIcons name="remove" size={20} color={annonce.nbre_chambre <= 0 ? Colors.gray : Colors.primary} />
            </Pressable>
            
            <View style={styles.counter_display}>
              <Text style={styles.counter_text}>{annonce.nbre_chambre}</Text>
            </View>
            
            <Pressable
              style={styles.counter_button}
              onPress={() => updateCounter('nbre_chambre', true)}
            >
              <MaterialIcons name="add" size={20} color={Colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Salles de bains */}
        <View style={styles.container_propriete}>
          <View style={styles.propriete_info}>
            <View style={styles.iconLabelContainer}>
              <FontAwesome5 name="shower" size={20} color={Colors.primary} />
              <Text style={styles.propriete_label}>Salles de bains</Text>
            </View>
            <Text style={styles.propriete_note}>Nombre de salles de bains/douches</Text>
          </View>

          <View style={styles.counter_container}>
            <Pressable
              style={[styles.counter_button, annonce.nbre_salle_bains <= 0 && styles.counter_button_disabled]}
              onPress={() => updateCounter('nbre_salle_bains', false)}
              disabled={annonce.nbre_salle_bains <= 0}
            >
              <MaterialIcons name="remove" size={20} color={annonce.nbre_salle_bains <= 0 ? Colors.gray : Colors.primary} />
            </Pressable>
            
            <View style={styles.counter_display}>
              <Text style={styles.counter_text}>{annonce.nbre_salle_bains}</Text>
            </View>
            
            <Pressable
              style={styles.counter_button}
              onPress={() => updateCounter('nbre_salle_bains', true)}
            >
              <MaterialIcons name="add" size={20} color={Colors.primary} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Section Environnement / Installations */}
      <View style={styles.section}>
        <View style={styles.accessibility_header}>
          <View>
            <Text style={styles.label}>Environnement & Installations</Text>
            <Text style={styles.helper}>
              Sélectionnez les équipements et services disponibles ({selectedCount} sélectionné{selectedCount > 1 ? 's' : ''})
            </Text>
          </View>
          
          {selectedCount > 0 && (
            <Pressable onPress={clearAllAccessibility} style={styles.clear_button}>
              <Text style={styles.clear_button_text}>Tout effacer</Text>
            </Pressable>
          )}
        </View>

        {/* Affichage groupé ou simple selon les données */}
        {Object.keys(groupedAccessibility).length > 1 ? (
          // Affichage par catégories
          Object.entries(groupedAccessibility).map(([category, items]) => (
            <View key={category} style={styles.category_section}>
              <Text style={styles.category_title}>{category}</Text>
              <View style={styles.container_acessibilite}>
                {items.map((item) => (
                  <Pressable
                    key={item.originalIndex}
                    style={[
                      styles.accessibility_item,
                      item.selected && styles.accessibility_item_active
                    ]}
                    onPress={() => toggleAccessibility(item.originalIndex)}
                  >
                    <Text
                      style={[
                        styles.accessibility_text,
                        item.selected && styles.accessibility_text_active
                      ]}
                    >
                      {item.title}
                    </Text>
                    {item.selected && (
                      <MaterialIcons name="check" size={16} color={Colors.light} />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        ) : (
          // Affichage simple
          <View style={styles.container_acessibilite}>
            {acessibilite.map((item, index) => (
              <Pressable
                key={index}
                style={[
                  styles.accessibility_item,
                  item.selected && styles.accessibility_item_active
                ]}
                onPress={() => toggleAccessibility(index)}
              >
                <Text
                  style={[
                    styles.accessibility_text,
                    item.selected && styles.accessibility_text_active
                  ]}
                >
                  {item.title}
                </Text>
                {item.selected && (
                  <MaterialIcons name="check" size={16} color={Colors.light} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Résumé des sélections */}
        {selectedCount > 0 && (
          <View style={styles.selection_summary}>
            <MaterialIcons name="info-outline" size={16} color={Colors.primary} />
            <Text style={styles.selection_text}>
              {selectedCount} équipement{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''} pour votre propriété
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default OtherInfos_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerSection: {
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    color: Colors.dark,
    fontWeight: "600",
    lineHeight: 32,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    lineHeight: 22,
  },

  section: {
    marginBottom: 32,
  },

  label: {
    fontSize: 18,
    color: Colors.dark,
    fontWeight: "500",
    marginBottom: 4,
  },

  helper: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 16,
    lineHeight: 20,
  },

  container_input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 8,
  },

  container_input_error: {
    borderColor: Colors.error || '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
    paddingVertical: 0,
  },

  currency: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },

  errorText: {
    fontSize: 12,
    color: Colors.error || '#FF6B6B',
  },

  pricePreview: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 8,
  },

  container_propriete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  propriete_info: {
    flex: 1,
  },

  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },

  propriete_label: {
    fontSize: 16,
    color: Colors.dark,
    fontWeight: '500',
  },

  propriete_note: {
    fontSize: 12,
    color: Colors.gray,
  },

  counter_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  counter_button: {
    backgroundColor: Colors.light,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  counter_button_disabled: {
    opacity: 0.5,
    borderColor: Colors.gray + '30',
  },

  counter_display: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 48,
    alignItems: 'center',
  },

  counter_text: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
  },

  accessibility_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  clear_button: {
    backgroundColor: Colors.error + '10' || '#FFE5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  clear_button_text: {
    fontSize: 12,
    color: Colors.error || '#FF6B6B',
    fontWeight: '500',
  },

  category_section: {
    marginBottom: 20,
  },

  category_title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 12,
    paddingLeft: 4,
  },

  container_acessibilite: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  accessibility_item: {
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray + '30',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  accessibility_text: {
    color: Colors.dark,
    fontWeight: "500",
    fontSize: 14,
  },

  accessibility_item_active: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  accessibility_text_active: {
    color: Colors.light,
  },

  selection_summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },

  selection_text: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});