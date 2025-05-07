import Loading from "@/assets/ui/Loading";
import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { Colors } from "./Colors";

type props = {
  item: string[];
};

const Image_Carousel = ({ item }: props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { width } = Dimensions.get("window");

  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={6}
      autoplayLoop
      index={1}
      showPagination
      data={item}
      renderItem={({ item }) => (
        <View style={styles.container_image}>
          {isLoading && <Loading />}
          <Image
            style={[styles.image, { width, height: '100%'}]}
            source={{ uri: item }}
            resizeMode="cover"
            onLoadEnd={() => setIsLoading(false)}
          />
        </View>
      )}
    />
  );
};

export default Image_Carousel;

const styles = StyleSheet.create({
  container_image: {
    alignItems: "center",
    justifyContent:'center',
  },
  image: {
    borderWidth: 1,
    backgroundColor: Colors.light,
  },
});
