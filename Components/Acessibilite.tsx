import { View, Text, StyleSheet } from "react-native";
import { icone_acessibilite } from "@/Data/data";
import { Colors } from "./Colors";
type props={
  acces:string;
}
const Acessibilite = ({acces}:props) => {

 const icone_acess=icone_acessibilite.find((objet)=> objet.title.toString()===acces)

  return (
    
      <View  style={styles.container_accessibilite}>
         {icone_acess?.icone}
        <Text style={{ fontWeight: 500 ,fontSize:15 , color:'gray'}}>{acces}</Text>
      </View>
  
  );
};

export default Acessibilite;

const styles = StyleSheet.create({
 
  container_accessibilite: {
    flexDirection:'row',
    alignItems:'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    gap:5,
    borderColor:Colors.dark,
  },
});
