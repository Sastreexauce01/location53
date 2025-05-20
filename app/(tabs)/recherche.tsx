import VirtualTourCreator from "@/Components/Annonces/VirtualTourCreator";
import { View } from "react-native";

export default function Recherche (){
    return (
        <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Text>Page Favoris</Text> */}
        <VirtualTourCreator/>
      </View>
    );
}