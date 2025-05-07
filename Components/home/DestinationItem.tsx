import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { Link } from "expo-router";
import { Colors } from "../Colors";
import { Image } from "expo-image";
import { useState } from "react";
type props = {
  item: {
    id: number;
    nom_ville: string;
    image: string;
  };
};
const DestinationItem = ({ item }: props) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <View style={styles.container_Destination}>
      <Link href={`../Screen/annonces/${item.id}`} asChild>
        <Pressable>
          {/* Section Image */}

          <View style={styles.container_image}>
            {isLoading && (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loader}
              />
            )}
            <Image
              source={{ uri: item.image }}
              onLoadEnd={() => setIsLoading(false)}
              style={styles.image}
            />
          </View>

          <Text style={styles.text}>{item.nom_ville}</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default DestinationItem;

const styles = StyleSheet.create({
  container_Destination: {
    flexDirection: "column",
    justifyContent: "space-between",
   // alignItems: "center",
    height: 200,
    width: 300,
    // backgroundColor: Colors.light,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light,
  },

  container_image: {},

  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  text: {
    padding:10
    },

  loader: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
  },
});
