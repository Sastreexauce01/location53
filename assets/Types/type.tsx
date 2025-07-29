

// Types.ts (ou dans ton fichier de types global)
  export type AnnonceType = {
    id:number;
    nomAnnonce: string;
    typeAnnonce: string;
    categorie: string;
    description: string;
    image: string[];
    adresse: string;
    coordonnee: { latitude: number; longitude: number };
    prix: number;
    nbre_chambre: number;
    nbre_salle_bains: number;
    accessibilite:string [];
    virtualSpace: string;
    date_creation: string;
    id_agent: string;
  };


  
  export type Rotation_Type = {
  alpha: number; // orientation horizontale
  beta: number;  // inclinaison haut-bas
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
  uri: string;        // URL ou chemin vers l'image 360°
  title: string;      // Titre de l'image/lieu
  description: string; // Description détaillée
}

// Props du composant VirtualTour
export interface VirtualTourProps {
  imageMetadata: ImageMetadata;
  style?: import('react-native').ViewStyle;
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