import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

// Componente de pantalla de inicio con animación Lottie
export default function SplashScreen({ navigation }) {

  // useEffect para controlar la navegación después de la animación
  useEffect(() => {
    // Se configura un temporizador para pasar a la pantalla de login
    const timer = setTimeout(() => {
      navigation.replace("LoginStack"); // Reemplaza la pantalla actual para que no se pueda volver atrás
    }, 6290); // Duración aproximada de la animación en milisegundos

    // Limpieza del temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Animación Lottie */}
      <LottieView
        source={require("../../../assets/animations/splash.json")} // Ruta del archivo JSON de Lottie
        autoPlay // Reproducir automáticamente al montar
        loop={false} // No repetir la animación
        style={styles.animation} // Estilo de la animación
      />
    </View>
  );
}

// Estilos del SplashScreen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff", // Fondo blanco
    justifyContent: "center", // Centrar verticalmente
    alignItems: "center", // Centrar horizontalmente
  },
  animation: {
    width: 500, // Ancho de la animación
    height: 900, // Alto de la animación
  },
});
