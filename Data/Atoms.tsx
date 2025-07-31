import { atom } from "jotai";
import { AnnonceType,  Scene360_Type } from "@/assets/Types/type";
import uuid from 'react-native-uuid';

export const annonce_Atom = atom<AnnonceType>({
  id:0,
  nomAnnonce:"",
  typeAnnonce: "",
  categorie: "",
  description: "",
  image: [], 
  adresse: "",
  coordonnee: { latitude: 0, longitude: 0 }, // Tableau correct
  prix:0,
  nbre_chambre: 0,
  nbre_salle_bains: 0, // Ajouté ici
  accessibilite:[], // Tableau vide
  virtualSpace: "",
  date_creation: "",
  id_agent: "",
});



export const Scene360_Atom= atom<Scene360_Type>({
 id: uuid.v4(),
  photos: [],
})




