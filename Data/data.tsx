import {
  Entypo,
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

import { Colors } from "@/Components/Colors";
export const Data_setting = [
  {
    icone: <FontAwesome5 name="crown" size={20} color={Colors.primary} />,
    title: "Abonnement",
  },
  {
    icone: <MaterialIcons name="bar-chart" size={20} color={Colors.primary} />,
    title: "Statistiques",
  },
  {
    icone: (
      <Ionicons name="notifications-outline" size={20} color={Colors.primary} />
    ),
    title: "Notifications",
  },
  {
    icone: <Entypo name="language" size={20} color={Colors.primary} />,
    title: "Langue",
  },
];

export const Data_support = [
  {
    icone: <Entypo name="help" size={20} color={Colors.primary} />,
    title: "Centre d'aide",
  },
  {
    icone: <MaterialIcons name="bug-report" size={20} color={Colors.primary} />,
    title: "Rapport de bug",
  },
];

export const icone_acessibilite = [
  {
    selected:false,
    title: "Piscine",
    icone: <FontAwesome5 name="swimming-pool" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Television",
    icone: <FontAwesome name="television" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Wifi",
    icone: <FontAwesome5 name="wifi" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Plage",
    icone: <FontAwesome5 name="swimmer" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Terrasse",
    icone: <FontAwesome6 name="people-roof" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Parking",
    icone: <FontAwesome5 name="parking" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Climatisation",
    icone: (
      <MaterialCommunityIcons name="air-filter" size={20} color={Colors.dark} />
    ),
  },
  {
    selected:false,
    title: "Cuisine",
    icone: <FontAwesome6 name="kitchen-set" size={20} color={Colors.dark} />,
  },
  {
    selected:false,
    title: "Ascenseur",
    icone: <MaterialCommunityIcons name="stairs" size={20} color={Colors.dark} />,
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
