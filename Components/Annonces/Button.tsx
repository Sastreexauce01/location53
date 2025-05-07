import { StyleSheet, View, Pressable, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Colors } from "@/Components/Colors";

import { useRouter } from "expo-router";

const Button = () => {

  const router=useRouter();

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => router.push('/annonces/CreateAnnonce')}
        
      >
        <FontAwesome6 name="add" size={25} color="white" />
        <Text style={styles.text}>Creer une annonce</Text>
      </Pressable>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  button: {
    borderRadius: 30,
    width: 200,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.primary,

    // Ombre pour iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Ombre pour Android
    elevation: 5,
  },

  text: {
    color: "white",
    fontWeight: "500",
    fontSize: 15,
  },
});
