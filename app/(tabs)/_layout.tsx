import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7065F0",
        headerStyle: {
          //  backgroundColor: "#7065F0",
        },
        headerShadowVisible: false,
        // headerTintColor: "#fffff",//text en blanc
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Acceuil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="home-outline" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoris"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="favorite-border" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="annonces"
        options={{
          title: "Mes annonces",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="notification" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="person" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
