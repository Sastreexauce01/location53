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
  scrollToInput: (reactNode: any) => void;
}

const Detail_CreateAnnonce: React.FC<Detail_CreateAnnonceProps> = ({ scrollToInput }) => {

  const inputRef = useRef<TextInput | null>(null);

  const handleFocus = () => {
    if (inputRef.current) {
      // Ici, on utilise la fonction scrollToInput pour défiler vers le TextInput
      scrollToInput(inputRef.current?.measureLayout);
    }
  };

 const {annonce,saveAnnonce}=useAnnonce(); 

  return (
  
      <View style={styles.container}>
        <Text style={styles.title}>
          Salut Exaucé, donnez les détails de votre propriété
        </Text>

        {/* Nom de l'annonce */}
        <View style={styles.container_input}>
          <TextInput
            placeholder="La maison d'ange"
            style={styles.input_nom}
            value={annonce.nomAnnonce}
            returnKeyType="done"
            onSubmitEditing={() => {
              Keyboard.dismiss(); // Ferme le clavier quand l'utilisateur appuie sur "Retour" ou "Entrée"
            }}
            onChangeText={(text) =>
              saveAnnonce({ ...annonce, nomAnnonce: text })
            }
          />
          <MaterialCommunityIcons
            name="warehouse"
            size={30}
            color={Colors.dark}
          />
        </View>

        {/* Type d'annonce */}
        <View style={styles.container_type_annonce}>
          <Text style={styles.label}>Type d&apos;annonce</Text>
          <View style={styles.type_annonce}>
            {Data_TypeAnnonce.map((type, index) => (
              <Pressable
                key={index}
                style={
                  annonce.typeAnnonce === type
                    ? styles.item_active
                    : styles.item
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
        <View style={styles.container_type_annonce}>
          <Text style={styles.label}>Catégorie de propriété</Text>
          <View style={styles.Categorie_Appartement}>
            {Data_Categorie_Appartement.map((categorie, index) => (
              <Pressable
                key={index}
                style={
                  annonce.categorie === categorie
                    ? styles.item_active
                    : styles.item
                }
                onPress={() =>
                  saveAnnonce({ ...annonce, categorie: categorie })
                }
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
        <View style={styles.container_type_annonce}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Décrivez votre bien ici..."
            style={styles.input_desc}
            multiline={true}
            value={annonce.description}
           onFocus={handleFocus}
            returnKeyType="done"
            onSubmitEditing={() => {
              // Logic when submit is pressed, for example, focus on next input field or hide keyboard
              Keyboard.dismiss(); // Ferme le clavier quand l'utilisateur appuie sur "Retour" ou "Entrée"
            }}
            onChangeText={(text) =>
              saveAnnonce({ ...annonce, description: text })
            }
            // multiline={true}
          />
        </View>
      </View>
   
  );
};

export default Detail_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 50,
    padding: 10,
    // backgroundColor: "orange",
    // borderWidth: 1,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 25,
    color: Colors.dark,
  },

  container_input: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    justifyContent: "space-between",
    backgroundColor: Colors.light,
    borderRadius: 5,
  },

  input_nom: {
    height: "100%",
    //  backgroundColor:'orange',
    flex: 1,
  },

  container_type_annonce: {
    gap: 10,
  },

  label: {
    fontSize: 20,
    color: Colors.dark,
    fontWeight: "500",
  },

  type_annonce: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
  },

  Categorie_Appartement: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 25,
  },

  item: {
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 5,
  },

  item_texte: {
    color: Colors.dark,
    fontWeight: "500",
    fontSize: 15,
  },

  item_active: {
    backgroundColor: Colors.dark,
    padding: 10,
    borderRadius: 5,
  },

  item_texte_active: {
    color: Colors.light,
    fontWeight: "500",
    fontSize: 15,
  },

  input_desc: {
    height: 120,
    backgroundColor: Colors.light,
    borderRadius: 5,
    paddingTop: 10,
    paddingLeft: 10,
    textAlignVertical: "top",
  },
});
