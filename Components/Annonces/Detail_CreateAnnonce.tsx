import React, { useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Data_Categorie_Appartement, Data_TypeAnnonce } from "@/Data/data";
import { Colors } from "@/Components/Colors";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

interface Detail_CreateAnnonceProps {
  scrollToInput: (yPosition: number) => void;
}

const Detail_CreateAnnonce: React.FC<Detail_CreateAnnonceProps> = ({
  scrollToInput,
}) => {
  const inputRef = useRef<TextInput | null>(null);

  const handleFocus = () => {
    // Délai pour s'assurer que le layout est calculé
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.measure((x, y, width, height, pageX, pageY) => {
          // Faire défiler vers la position de l'input avec un offset
          scrollToInput(pageY - 100);
        });
      }
    }, 100);
  };

  const { annonce, saveAnnonce } = useAnnonce();

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>
          Salut Exaucé, donnez les détails de votre propriété
        </Text>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        {/* Nom de l'annonce */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Nom de l&apos;annonce</Text>
          <View style={styles.container_input}>
            <TextInput
              placeholder="La maison d'ange"
              style={styles.input_nom}
              value={annonce.nomAnnonce}
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              onChangeText={(text) => saveAnnonce({ ...annonce, nomAnnonce: text })}
            />
            <MaterialCommunityIcons
              name="warehouse"
              size={24}
              color={Colors.dark}
            />
          </View>
        </View>

        {/* Type d'annonce */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Type d&apos;annonce</Text>
          <View style={styles.type_annonce}>
            {Data_TypeAnnonce.map((type, index) => (
              <Pressable
                key={index}
                style={
                  annonce.typeAnnonce === type ? styles.item_active : styles.item
                }
                onPress={() => saveAnnonce({ ...annonce, typeAnnonce: type })}
              >
                <Text
                  style={
                    annonce.typeAnnonce === type
                      ? styles.item_texte_active
                      : styles.item_texte
                  }
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Catégorie de propriété */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Catégorie de propriété</Text>
          <View style={styles.Categorie_Appartement}>
            {Data_Categorie_Appartement.map((categorie, index) => (
              <Pressable
                key={index}
                style={
                  annonce.categorie === categorie
                    ? styles.item_active
                    : styles.item
                }
                onPress={() => saveAnnonce({ ...annonce, categorie: categorie })}
              >
                <Text
                  style={
                    annonce.categorie === categorie
                      ? styles.item_texte_active
                      : styles.item_texte
                  }
                >
                  {categorie}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Description</Text>
          <TextInput
            ref={inputRef}
            placeholder="Décrivez votre bien ici..."
            style={styles.input_desc}
            multiline={true}
            value={annonce.description}
            onFocus={handleFocus}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            onChangeText={(text) =>
              saveAnnonce({ ...annonce, description: text })
            }
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );
};

export default Detail_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  
  },

  headerSection: {
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    color: Colors.dark,
    fontWeight: "600",
    lineHeight: 32,
  },

  contentSection: {
    flex: 1,
    gap: 28,
  },

  inputSection: {
    gap: 12,
  },

  sectionLabel: {
    fontSize: 18,
    color: Colors.dark,
    fontWeight: "500",
    marginBottom: 4,
  },

  container_input: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light,
    borderRadius: 8,
    minHeight: 48,
  },

  input_nom: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
  },

  type_annonce: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  Categorie_Appartement: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  item: {
    backgroundColor: Colors.light,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  item_texte: {
    color: Colors.dark,
    fontWeight: "500",
    fontSize: 14,
  },

  item_active: {
    backgroundColor: Colors.dark,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  item_texte_active: {
    color: Colors.light,
    fontWeight: "500",
    fontSize: 14,
  },

  input_desc: {
    minHeight: 120,
    maxHeight: 200,
    backgroundColor: Colors.light,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark,
    textAlignVertical: "top",
  },
});