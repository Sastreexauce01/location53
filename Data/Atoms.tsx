import { atom } from "jotai";
import { AnnonceType } from "@/assets/Types/type";


export const annonce_Atom = atom<AnnonceType>({
  id: "1",
  nomAnnonce: "",
  typeAnnonce: "",
  categorie: "",
  description: "",
  image: [],
  adresse: "",
  coordonnee: { latitude: 0, longitude: 0 }, // Tableau correct
  prix: 0,
  nbre_chambre: 0,
  nbre_salle_bains: 0, // Ajouté ici
  accessibilite: [], // Tableau vide
  virtualSpace: [],
  date_creation: "",
  id_agent: "",
});

