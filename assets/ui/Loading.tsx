import { Colors } from "@/Components/Colors";
import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
} from "react-native";
const Loading = () => {
  // const [isLoading, setIsLoading] = useState(true);
  return (
    <ActivityIndicator
      size="large"
      color={Colors.primary}
      style={styles.loader}
    />
  );
};

export default Loading;

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    zIndex: 1,
  },
});
