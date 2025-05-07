import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Colors } from "../Colors";
import { ImageBackground } from "expo-image";
import Space_cameraView from "./Space_cameraView";

const VirtualSpace_CreateAnnonce = () => {
  const [isLoading, setIsloading] = useState(true);
  const[cameraVisible,setCameraVisible]=useState(false);

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View>
        <Text style={styles.title}>Creer votre espace virtuel</Text>
      </View>

     

      {/* Section Espace virtual */}
      <TouchableOpacity style={styles.imageContainer} onPress={()=>setCameraVisible(!cameraVisible)}>
        {isLoading && (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />
        )}
        <ImageBackground
          style={styles.image}
          resizeMode="cover"
          onLoadEnd={()=>setIsloading(!isLoading)}
          source={{
            uri: "https://res.cloudinary.com/dait4sfc5/image/upload/v1743240231/creer_virtual_space_wa0bzg.png",
          }}
        >
          <Text style={styles.text}>Cliquez pour demarrer</Text>

        </ImageBackground>
      </TouchableOpacity>

      <Space_cameraView cameraVisible={cameraVisible} setCameraVisible={setCameraVisible} />
      
    </View>
  );
};

export default VirtualSpace_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // borderWidth: 1,
    gap: 50,
    padding: 5,
  },
  title: {
    fontSize: 25,
    color: Colors.dark,
  },

  loader: {
    position: "absolute",
    zIndex: 1,
  },

  imageContainer: {
    position: "relative",
   // height: 150,
    width: "100%",
    justifyContent: "center",
     alignItems: "center",
    backgroundColor: "#ffff",
    borderRadius: 30,
  },

  image: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: 320,
    width:'100%',
    borderRadius: 30,
  },

  text: {
    fontSize: 25,
    color: "white",
  },


});
