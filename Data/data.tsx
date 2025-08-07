import {
  // Entypo,
  // MaterialIcons,
  FontAwesome5,
  // Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

import { Colors } from "@/Components/Colors";

export const icone_acessibilite = [
  {
    selected: false,
    title: "Piscine",
    icone: <FontAwesome5 name="swimming-pool" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Television",
    icone: <FontAwesome name="television" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Wifi",
    icone: <FontAwesome5 name="wifi" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Plage",
    icone: <FontAwesome5 name="swimmer" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Terrasse",
    icone: <FontAwesome6 name="people-roof" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Parking",
    icone: <FontAwesome5 name="parking" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Climatisation",
    icone: (
      <MaterialCommunityIcons name="air-filter" size={20} color={Colors.dark} />
    ),
  },
  {
    selected: false,
    title: "Cuisine",
    icone: <FontAwesome6 name="kitchen-set" size={20} color={Colors.dark} />,
  },
  {
    selected: false,
    title: "Ascenseur",
    icone: (
      <MaterialCommunityIcons name="stairs" size={20} color={Colors.dark} />
    ),
  },
];


export const Data_Destination = [
  {
    id: 1,
    nom_ville: "Benin, cotonou",
    image:
      "https://res.cloudinary.com/dait4sfc5/image/upload/v1740653948/empty-flat-interrior-with-elements-decoration_nbswbt.jpg",
  },
  {
    id: 2,
    nom_ville: "Benin, Parakou",
    image:
      "https://res.cloudinary.com/dait4sfc5/image/upload/v1740653948/empty-flat-interrior-with-elements-decoration_nbswbt.jpg",
  },
  {
    id: 3,
    nom_ville: "Benin, Calavi",
    image:
      "https://res.cloudinary.com/dait4sfc5/image/upload/v1740653948/empty-flat-interrior-with-elements-decoration_nbswbt.jpg",
  },
];

export const Data_TypeAnnonce = ["Location", "Vente"];

export const Data_Categorie_Appartement = [
  "Appartement",
  "Maison",
  "villas",
  "Chambre",
  "Hotel",
];

// @/Data/data.ts
export const Data_setting = [
  {
    id: 1,
    title: "Notifications",
    subtitle: "Gérer vos notifications",
    icon: "notification",
    color: "#FF6B6B",
    route: "/settings/notifications",
  },
  {
    id: 2,
    title: "Confidentialité",
    subtitle: "Contrôlez vos données",
    icon: "shield",
    color: "#4ECDC4",
    route: "/settings/privacy",
  },
  {
    id: 3,
    title: "Sécurité",
    subtitle: "Mot de passe et sécurité",
    icon: "lock",
    color: "#45B7D1",
    route: "/settings/security",
  },
  {
    id: 4,
    title: "Langue",
    subtitle: "Français",
    icon: "global",
    color: "#96CEB4",
    route: "/settings/language",
  },
  {
    id: 5,
    title: "Thème",
    subtitle: "Clair",
    icon: "bulb",
    color: "#FECA57",
    route: "/settings/theme",
  },
];

export const Data_support = [
  {
    id: 1,
    title: "Centre d'aide",
    subtitle: "FAQ et guides",
    icon: "question",
    color: "#A8E6CF",
    route: "/support/help",
  },
  {
    id: 2,
    title: "Nous contacter",
    subtitle: "Assistance par email",
    icon: "mail",
    color: "#FFD93D",
    route: "/support/contact",
  },
  {
    id: 3,
    title: "Signaler un problème",
    subtitle: "Rapporter un bug",
    icon: "exclamation",
    color: "#FF8A80",
    route: "/support/report",
  },
  {
    id: 4,
    title: "Conditions d'utilisation",
    subtitle: "Termes et conditions",
    icon: "file-text",
    color: "#B8B5FF",
    route: "/support/terms",
  },
  {
    id: 5,
    title: "Politique de confidentialité",
    subtitle: "Protection des données",
    icon: "shield-check",
    color: "#C7CEEA",
    route: "/support/privacy-policy",
  },
];


export const testAnnonceData = {
  id: "1",
  nomAnnonce: "Villa de Luxe - Cotonou",
  typeAnnonce: "Vente",
  categorie: "Villa",
  description: "Magnifique villa avec vue panoramique",
  image: [
    "https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMGFICYqgaHltiyCrLU0VTSs4qXgmAOo7WZ2fcj",
    "https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMGpaFy2InjhFVr1S2QDTgwi8yeJlRpYNIu6MLX",
  ],
  adresse: "Quartier Haie Vive, Cotonou",
  coordonnee: {
    latitude: 6.3728,
    longitude: 2.3903,
  },
  prix: 85000000,
  nbre_chambre: 4,
  nbre_salle_bains: 3,
  accessibilite: ["Parking", "Jardin", "Piscine"],

  // Images panoramiques 360°
  virtualSpace: [
    {
      id: "salon-principal",
      uri: "https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMGFICYqgaHltiyCrLU0VTSs4qXgmAOo7WZ2fcj",
      title: "Salon Principal",
      description: "Grand salon avec vue sur le jardin",
      hotspots: [],
      initialYaw: 0,
      initialPitch: 0,
      initialFov: 75,
    },
    {
      id: "cuisine-moderne",
      uri: "https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMGpaFy2InjhFVr1S2QDTgwi8yeJlRpYNIu6MLX",
      title: "Cuisine Moderne",
      description: "Cuisine équipée avec îlot central",
      hotspots: [],
      initialYaw: 1.5,
      initialPitch: -0.2,
      initialFov: 80,
    },
    {
      id: "chambre-master",
      uri: "https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMG2ELdJs8BsgvCqbN1LSjRVWkKZPc7dhwFr869",
      title: "Chambre Master",
      description: "Chambre principale avec dressing",
      hotspots: [],
      initialYaw: -0.8,
      initialPitch: 0.1,
      initialFov: 70,
    },
  ],

  date_creation: "2024-12-15T10:30:00Z",
  id_agent: "agent-123",
};