import { useEffect, useState } from "react";
import { AnnonceType, Image360, SupabaseAnnonce } from "../Types/type";
import useAuth from "./useAuth";
import { supabase } from "@/utils/supabase";
import { useAnnonce } from "./useAnnonce";

const useAnnonce_Data = () => {
  const [listAppartments, setListAppartments] = useState<AnnonceType[]>([]);
  const { saveAnnonce } = useAnnonce();
  const [isLoadingAnnonces, setIsLoadingAnnonces] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchVirtualSpaces = async (annonceId: string): Promise<Image360[]> => {
    try {
      const { data, error } = await supabase
        .from("virtual_spaces")
        .select("*")
        .eq("annonce_id", annonceId);

      if (error) throw error; // ✅ Correction: throw error au lieu de error.message

      const dataVirtual: Image360[] =
        data?.map((item) => ({
          id: item.id,
          uri: item.uri,
          title: item.title,
          description: item.description,
        })) || []; // ✅ Ajout du fallback

      return dataVirtual;
    } catch (error) {
      console.error("❌ Erreur virtual spaces:", error);
      return [];
    }
  };

  const fetchData = async () => {
    // Ne pas charger si pas authentifié ou pas d'utilisateur
    if (!isAuthenticated || !user?.id) {
      return;
    }

    setIsLoadingAnnonces(true);
    try {
      const { data, error } = await supabase
        .from("annonces")
        .select("*")
        .eq("id_agent", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Erreur lors de la récupération des annonces:", error);
        throw new Error(
          `❌ Erreur de récupération de données: ${error.message}`
        );
      } else {
        // console.log("✅ Annonces récupérées:", data);

        // ✅ Option 2: Si vous voulez charger les virtualSpaces (commenté pour l'instant)

        const mappedDataPromises =
          data?.map(async (item: SupabaseAnnonce): Promise<AnnonceType> => {
            const virtualSpaces = await fetchVirtualSpaces(item.id);

            return {
              id: item.id,
              nomAnnonce: item.nom_annonce,
              typeAnnonce: item.type_annonce,
              categorie: item.categorie,
              description: item.description,
              image: item.images || [],
              adresse: item.adresse,
              coordonnee: {
                latitude: item.latitude,
                longitude: item.longitude,
              },
              prix: item.prix,
              nbre_chambre: item.nbre_chambre,
              nbre_salle_bains: item.nbre_salle_bains,
              accessibilite: item.accessibilite || [],
              virtualSpace: virtualSpaces,
              date_creation: item.created_at,
              id_agent: item.id_agent,
            };
          }) || [];

        const mappedData: AnnonceType[] = await Promise.all(mappedDataPromises);

        setListAppartments(mappedData);
      }
    } catch (error) {
      console.error("❌ Erreur dans fetchData:", error);
      setListAppartments([]); // ✅ En cas d'erreur, afficher une liste vide
    } finally {
      setIsLoadingAnnonces(false);
    }
  };

  // Récupérer les annonces de cet utilisateur
  useEffect(() => {
    fetchData(); // ✅ Correction du nom
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // modifier

  const handleUpdate = (idAnnonce: string) => {
    const annonceQuery: AnnonceType | undefined = listAppartments.find(
      (annonce) => annonce.id === idAnnonce
    );

    if (annonceQuery) {
      saveAnnonce(annonceQuery);
    }
  };

  //  delete

  const handleDelete = async (idAnnonce: string) => {
    try {
      // Supprimer l'annonce avec l'ID spécifié
      const { data, error } = await supabase
        .from("annonces")
        .delete()
        .eq("id", idAnnonce);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        // Vous pouvez afficher une alerte ou toast d'erreur
        alert("Erreur lors de la suppression de l'annonce");
        return false;
      }

      console.log("Annonce supprimée avec succès:", data);
      // Vous pouvez afficher un message de succès
      alert("Annonce supprimée avec succès!");

      // Optionnel : rafraîchir la liste des annonces
      await fetchData(); // si vous avez une fonction pour recharger les données

      return true;
      
    } catch (err) {
      console.error("Erreur inattendue:", err);
      alert("Une erreur inattendue s'est produite");
      return false;
    }
  };

  // ////////////////////////////////////////////
  return {
    handleUpdate,
    handleDelete,
    listAppartments,
    setListAppartments,
    isLoadingAnnonces,
  };
};

export default useAnnonce_Data;
