import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";

import Fontisto from "@expo/vector-icons/Fontisto";
import { useState } from "react";
import { Colors } from "@/Components/Colors";
import { useRouter } from "expo-router";
import Search from "@/Components/Search";

const SearchScreen = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>(""); // Texte de la recherche
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.container_title}>
          <Pressable onPress={() => router.back()}>
            <Fontisto name="angle-left" size={20} color={Colors.primary} />
          </Pressable>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.title}>Destination</Text>
          </View>
        </View>

        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    padding: 10,
    gap: 50,
    backgroundColor: "white",
    justifyContent: "space-between",
  },

  container_first: {
    gap: 50,
  },

  container_title: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },

  button: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
