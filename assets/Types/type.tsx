// Types/type.ts - Version corrigée

export type AnnonceType = {
  id: string;
  nomAnnonce: string;
  typeAnnonce: string;
  categorie: string;
  description: string;
  image: string[]; // images standard
  adresse: string;
  coordonnee: { latitude: number; longitude: number };
  prix: number;
  nbre_chambre: number;
  nbre_salle_bains: number;
  accessibilite: string[];
  virtualSpace: Image360[]; // images panoramiques 360°
  date_creation: string;
  id_agent: string;
};

export interface Image360 {
  id: string; // ✅ Ajout de l'ID unique
  uri: string; // URL ou chemin local
  title: string;
  description: string;
}


export interface Hotspot {
  id: string;
  yaw: number; // horizontal [-π à π]
  pitch: number; // vertical [-π/2 à π/2]
  type: "scene"|string;
  title: string;
  targetSceneId: string; // Pour type 'scene'
}


// Api pour la generattion d'image 360 

export type Rotation_Type = {
  alpha: number; // orientation horizontale
  beta: number; // inclinaison haut-bas
  gamma: number; // inclinaison gauche-droite
};

export type Photo_Type = {
  rotation: Rotation_Type;
  uri: string;
};

export type Scene360_Type = {
  id: string; // identifiant de la scène
  photos: Photo_Type[];
};

// Interface pour les métadonnées d'image 360°
export interface ImageMetadata {
  uri: string; // URL ou chemin vers l'image 360°
  title: string; // Titre de l'image/lieu
  description: string; // Description détaillée
}

// Props du composant VirtualTour
export interface VirtualTourProps {
  imageMetadata: ImageMetadata;
  style?: import("react-native").ViewStyle;
  showInfo?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

// Exemple d'utilisation avec plusieurs images
export interface TourData {
  id: string;
  images: ImageMetadata[];
  tourTitle: string;
  tourDescription: string;
}
