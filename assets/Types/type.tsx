

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


