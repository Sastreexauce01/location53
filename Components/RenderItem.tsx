import { Text, View, StyleSheet } from "react-native";
import { Colors } from "./Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { JSX } from "react";
type Props = {
  item: {
    icone: JSX.Element; // Type pour une icône React Native
    title: string;
  };
};

export default function RenderItem({ item }: Props) {
  return (
    <View style={styles.container }>
      <View style={styles.title}>
        {item.icone}
        <Text style={styles.text}>{item.title}</Text>
      </View>

      <AntDesign name="right" size={20} color={Colors.dark} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    padding: 12,
    marginVertical:4,
    borderRadius: 8,
    backgroundColor: Colors.light,
   
  },

  title:{
    flexDirection: "row",
    alignItems: "center",
    gap:10,
  },

  text:{
   fontSize: 15
  },
});
