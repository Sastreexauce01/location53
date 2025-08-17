import { useEffect, useState, useCallback } from "react";
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

      if (error) throw error;

      console.log("✅Donne brute virtualSpace de  supabase", data);

      const images360: Image360[] = data.map((item) => ({
        id: item.id,
        panorama: item.panorama,
        thumbnail: item.thumbnail,
        name: item.name,
        caption: item.caption,
        links: Array.isArray(item.links)
          ? item.links.map((l: any) => ({
              nodeId: l.nodeId ?? "",
              position: {
                yaw: l.position?.yaw ?? 0,
                pitch: l.position?.pitch ?? 0,
              },
            }))
          : [],
      }));

      return images360;
    } catch (error) {
      console.error("❌ Erreur virtual spaces:", error);
      return [];
    }
  };

  // ✅ Fonction simple pour récupérer 10 annonces
  const fetchdataAll = async () => {
    setIsLoadingAnnonces(true);
    try {
      const { data, error } = await supabase
        .from("annonces")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("❌ Erreur lors de la récupération des annonces:", error);
        throw error;
      }

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
      return mappedData;
    } catch (error) {
      console.error("❌ Erreur dans fetchdataAll:", error);
      setListAppartments([]);
    } finally {
      setIsLoadingAnnonces(false);
    }
  };

  // ✅ Mémoriser fetchData avec useCallback
  const fetchData = useCallback(async () => {
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
        throw error; // ✅ Plus cohérent
      }

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
    } catch (error) {
      console.error("❌ Erreur dans fetchData:", error);
      setListAppartments([]);
    } finally {
      setIsLoadingAnnonces(false);
    }
  }, [isAuthenticated, user?.id]); // ✅ Dépendances correctes

  // ✅ Un seul useEffect, bien configuré
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = (idAnnonce: string) => {
    const annonceQuery: AnnonceType | undefined = listAppartments.find(
      (annonce) => annonce.id === idAnnonce
    );

    if (annonceQuery) {
      saveAnnonce(annonceQuery);
    }
  };

  const handleDelete = async (idAnnonce: string) => {
    try {
      const { data, error } = await supabase
        .from("annonces")
        .delete()
        .eq("id", idAnnonce);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'annonce");
        return false;
      }

      console.log("Annonce supprimée avec succès:", data);
      alert("Annonce supprimée avec succès!");

      // Rafraîchir la liste
      await fetchData();

      return true;
    } catch (err) {
      console.error("Erreur inattendue:", err);
      alert("Une erreur inattendue s'est produite");
      return false;
    }
  };

  return {
    fetchdataAll,
    handleUpdate,
    handleDelete,
    listAppartments,
    setListAppartments,
    isLoadingAnnonces,
  };
};

export default useAnnonce_Data;
