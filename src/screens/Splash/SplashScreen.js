import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // 👈 Esto navega al Tab Navigator completo
      navigation.replace("MainTabs");
    }, 6290); // tiempo de la animación en ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../assets/animations/splash.json")} // tu archivo Lottie
        autoPlay
        loop={false} // No repetir
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // mismo color que en app.json
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 500,
    height: 900,
  },
});
