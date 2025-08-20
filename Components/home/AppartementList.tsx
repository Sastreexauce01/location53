import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import AppartementItem from "@/Components/home/AppartementItem";
import { useRouter } from "expo-router";
import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";
import { useEffect, useState } from "react";
import { AnnonceType } from "@/assets/Types/type";

const AppartementList = () => {
  const [listAppartments, setListAppartments] = useState<AnnonceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { fetchdataAll } = useAnnonce_Data();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchdataAll();
        setListAppartments(data || []); // ✅ Gérer le cas où data est undefined
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        setListAppartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchdataAll]); // ✅ Ajouter fetchdataAll dans les dépendances

  return (
    <FlatList
      data={listAppartments} // ✅ Utiliser listAppartments au lieu de Data_Appartements
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      horizontal
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/virtual360/[id]`,
              params: { id: item.id },
            })
          }
        >
          <AppartementItem item={item} />
        </TouchableOpacity>
      )}
      // ✅ Optionnel : ajouter un indicateur de chargement
      refreshing={isLoading}
      onRefresh={() => {
        const loadData = async () => {
          setIsLoading(true);
          try {
            const data = await fetchdataAll();
            setListAppartments(data || []);
          } catch (error) {
            console.error("❌ Erreur lors du refresh:", error);
          } finally {
            setIsLoading(false);
          }
        };
        loadData();
      }}
    />
  );
};

export default AppartementList;

const styles = StyleSheet.create({
  flatListContainer: {
    gap: 20,
    paddingLeft: 10,
    paddingRight: 20,
  },
});
