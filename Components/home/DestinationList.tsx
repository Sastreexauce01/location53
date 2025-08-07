import React from "react";
import { StyleSheet, FlatList } from "react-native";

import { Data_Destination } from "@/Data/data";
import DestinationItem from "./DestinationItem";

const DestinationList = () => {
  return (
    <FlatList
      data={Data_Destination}
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <DestinationItem item={item} />}
    />
  );
};

export default DestinationList;

const styles = StyleSheet.create({
  flatListContainer: {
    gap: 20,
    // marginLeft: 15,
    paddingLeft: 10,
    paddingRight: 20,
    //backgroundColor: "green",
  },
});
