import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  TextInput,

  Keyboard,
} from "react-native";
import { Colors } from "../Colors";
import { Entypo, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { icone_acessibilite } from "@/Data/data";
import { useAnnonce } from "@/assets/hooks/useAnnonce";



const OtherInfos_CreateAnnonce = () => {
  const { annonce, saveAnnonce } = useAnnonce();

  const [acessibilite, setAcessibilite] = useState(icone_acessibilite);
  

  const List_acessibilite_selected_titles = acessibilite
    .filter((item) => item.selected) // Garde uniquement les éléments sélectionnés
    .map((item) => item.title); // Récupère uniquement les titres

  //   Fonction pour selected et mettre a jour le jotai

  const add_acessibilite = (index: number) => {
    const updatedAcessibilite = acessibilite.map((item, i) =>
      i === index ? { ...item, selected: !item.selected } : item
    );

    setAcessibilite(updatedAcessibilite);

    saveAnnonce({
      ...annonce,
      accessibilite: [...List_acessibilite_selected_titles],
    });



   
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View>
        <Text style={styles.title}>Informations suplementaire</Text>
      </View>

      {/* Section_prix de location */}
      <View style={{ gap: 20 }}>
        <Text style={styles.label}>Prix</Text>
        <View style={styles.container_input}>
          <TextInput
            style={styles.input}
            placeholder="25000"
            value={annonce.prix ? annonce.prix.toString() : ""} // Assurez-vous que c'est une chaîne
            keyboardType="numeric"
            returnKeyType="done"
            onChangeText={(text) =>
              saveAnnonce({ ...annonce, prix: text ? Number(text) : 0 })
            } // Convertir la chaîne en nombre
            onSubmitEditing={() => {
              // Logic when submit is pressed, for example, focus on next input field or hide keyboard
              Keyboard.dismiss(); // Ferme le clavier quand l'utilisateur appuie sur "Retour" ou "Entrée"
            }}
          />
          <Text>F CFA</Text>
        </View>
      </View>

      {/* section caracteristique */}
      <View style={{ gap: 20 }}>
        <Text style={styles.label}>Caractéristiques de la propriété</Text>

        {/* Chambres */}
        <View style={styles.container_propriete}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Ionicons name="bed-outline" size={24} color={Colors.primary} />
            <Text>Chambres</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Pressable
              onPress={() =>
                saveAnnonce({
                  ...annonce,
                  nbre_chambre: annonce.nbre_chambre - 1,
                })
              }
            >
              <Entypo name="circle-with-minus" size={24} color="black" />
            </Pressable>
            <Text style={{ fontSize: 20 }}>{annonce.nbre_chambre}</Text>
            <Pressable
              onPress={() =>
                saveAnnonce({
                  ...annonce,
                  nbre_chambre: annonce.nbre_chambre + 1,
                })
              }
            >
              <Entypo name="circle-with-plus" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Douches */}
        <View style={styles.container_propriete}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <FontAwesome5 name="shower" size={24} color={Colors.primary} />
            <Text>Douches</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Pressable
              onPress={() =>
                saveAnnonce({
                  ...annonce,
                  nbre_salle_bains: annonce.nbre_salle_bains - 1,
                })
              }
            >
              <Entypo name="circle-with-minus" size={24} color="black" />
            </Pressable>
            <Text style={{ fontSize: 20 }}>{annonce.nbre_salle_bains}</Text>
            <Pressable
              onPress={() =>
                saveAnnonce({
                  ...annonce,
                  nbre_salle_bains: annonce.nbre_salle_bains + 1,
                })
              }
            >
              <Entypo name="circle-with-plus" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Section Acessibilite Environnement */}
      <View style={{ gap: 20 }}>
        <Text style={styles.label}>Environnement / Installations</Text>

        {/* Setannonce({...annonce,accessibilite:[...annonce.accessibilite,item.title]})} */}
        <View style={styles.container_acessibilite}>
          {acessibilite.map((item, index) => (
            <Pressable
              key={index}
              style={item.selected ? styles.item_active : styles.item}
              onPress={() => add_acessibilite(index)}
            >
              <Text
                style={
                  item.selected ? styles.item_texte_active : styles.item_texte
                }
              >
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default OtherInfos_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    gap: 50,
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: Colors.dark,
  },

  label: {
    fontSize: 20,
    color: Colors.dark,
    fontWeight: "500",
  },

  container_input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 5,
  },

  input: {
    height: 'auto',
    flex: 1,
  },

  container_propriete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 5,
  },

  container_acessibilite: {
    flexDirection: "row",
    flexWrap: "wrap",
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
});
