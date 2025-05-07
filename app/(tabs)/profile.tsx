import { Text, View, StyleSheet } from "react-native";
import { Image,} from "expo-image";
import { Colors } from "@/Components/Colors";


import {AntDesign,SimpleLineIcons} from "@expo/vector-icons";



import { Data_setting, Data_support } from "@/Data/data";
import RenderItem from "@/Components/RenderItem";

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* Section Information profile */}
      <View style={styles.Container_information}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            source={{ uri: "https://www.w3schools.com/w3images/avatar2.png" }}
            style={styles.image}
          />
          <View style={styles.information}>
            <Text style={{ fontSize: 20, fontWeight: 500 }}>Exauce SASTRE</Text>
            <Text>sastreexauce01@gmail.com</Text>
          </View>
        </View>

        <AntDesign name="right" size={24} color={Colors.dark} />
      </View>

      {/* Section parametre */}
      <View style={{ gap: 10 }}>
        <Text style={styles.title}>
          Parametre et preference
        </Text>
        {Data_setting.map((item, index) => (
          <RenderItem key={index} item={item} />
        ))}
      </View>
      {/* Section Support */}
      <View style={{ gap: 10 }}>
        <Text style={styles.title}>Support</Text>
        {Data_support.map((item, index) => (
          <RenderItem key={index} item={item} />
        ))}
      </View>
      {/* Section Deconnexion*/}

      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <SimpleLineIcons name="logout" size={24} color={Colors.error} />
        <Text style={{ color: Colors.error, fontWeight: "500", fontSize: 15 }}>
          Deconnexion
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    // alignItems: "center",
    justifyContent: "space-between",
    // marginVertical: 20,
    flex: 1,
    padding: 20,
    backgroundColor:'white',

  },

  Container_information: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    padding: 8,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.dark,
  },

  information: {
    gap: 10,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },

  title: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.dark,
  },
});
