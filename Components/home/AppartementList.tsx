import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Data_Appartements from "@/Data/data-appartements.json";
import AppartementItem from "@/Components/home/AppartementItem";
import { useRouter } from "expo-router";
const AppartementList = () => {
    const router = useRouter();
  return (
    <FlatList
      data={Data_Appartements}
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={()=>router.push(`/annonces/${item.id}`)}>
          {/* /annonces/${item.id} */}
          <AppartementItem item={item} />
        </TouchableOpacity>
      )}
    />
  );
};

export default AppartementList;

const styles = StyleSheet.create({
  flatListContainer: {
    gap: 20,
    // marginLeft: 15,
    paddingLeft: 10,
    paddingRight: 20,
    //backgroundColor: "green",
  },
});
