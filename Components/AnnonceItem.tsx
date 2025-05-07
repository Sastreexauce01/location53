import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,


} from "react-native";

import { Colors } from "./Colors";
import { MaterialIcons, SimpleLineIcons } from "@expo/vector-icons";

import Options_Modal from "./Options_Modal";
import Loading from "@/assets/ui/Loading"

type Props = {
  item: {
    id: number;
    nomAnnonce: string;
    image: string[];
    date_creation: string;
  };
};

export const AnnonceItem = ({ item }: Props) => {
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [modalVisible, setModalVisible] = useState(false); // État du modal

  return (
    <View style={styles.container}>
     
        
          {/* Image avec indicateur de chargement */}
          <View style={styles.imageContainer}>
            {isLoading && 
             <Loading/>
            }
            <ImageBackground
              source={{ uri: item.image[0] }}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setIsLoading(false)}
            >
              <View style={styles.overlay}>
                <Text style={styles.tag}>Location</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                  <SimpleLineIcons
                    name="options-vertical"
                    size={25}
                    color={Colors.light}
                  />
                </Pressable>
              </View>
            </ImageBackground>
          </View>

          {/* Informations sur l'annonce */}
          <View style={styles.container_information}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode='tail'>{item.nomAnnonce}</Text>
            <View style={styles.container_date}>
              <MaterialIcons name="update" size={10} color={Colors.primary} />
              <Text style={styles.date}>{item.date_creation}</Text>
            </View>
          </View>
      
     

      {/* MODAL */}
      <Options_Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#E0DEF7",
    height: '100%',
    width: '100%',
    justifyContent: "space-between",
  },

  imageContainer: {
    position: "relative",
    height: 160,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },

  loader: {
    position: "absolute",
    zIndex: 1,
  },

  image: {
    height: 160,
    width: "100%",
    justifyContent: "flex-start",
  },

  overlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingHorizontal: 2,
  },

  tag: {
    backgroundColor: Colors.light,
    padding: 4,
    borderRadius: 5,
  },

  container_information: {
    flex:1,
    padding: 2,
    flexDirection: "column",
    justifyContent:'space-between',
    gap:0,
    // backgroundColor:'orange'
  },

  container_date: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  title: {
    color: Colors.dark,
    fontSize: 15,
    fontWeight: "500",
  },

  date: {
    fontSize: 10,
    color: "black",
    opacity: 0.5,
  },

  /* Styles du modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  modalButton: {
    width: "100%",
    padding: 10,
    alignItems: "center",
  },

  deleteButton: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 10,
  },

  modalText: {
    fontSize: 16,
    color: Colors.dark,
  },

  closeText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
  },
});
