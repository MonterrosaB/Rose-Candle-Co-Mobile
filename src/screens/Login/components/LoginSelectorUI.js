import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get("window"); // ancho de pantalla para animaciones

export default function LoginSelectorUI({ goToPhoneLogin, goToUserLogin }) {
  const [hoveredButton, setHoveredButton] = useState(null); // para efectos de hover o selección

  // Animaciones de elementos decorativos
  const rotateStar1 = useSharedValue(0);
  const moveYStar1 = useSharedValue(0);

  const rotateStar2 = useSharedValue(0);
  const moveXStar2 = useSharedValue(0);

  const rotateFlower = useSharedValue(0);
  const scaleFlower = useSharedValue(1);

  const moveYCharacter = useSharedValue(0);

  // Iniciar animaciones cuando se monta el componente
  useEffect(() => {
    rotateStar1.value = withRepeat(withTiming(360, { duration: 8000, easing: Easing.linear }), -1);
    moveYStar1.value = withRepeat(withTiming(-20, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);

    rotateStar2.value = withRepeat(withTiming(-360, { duration: 6000, easing: Easing.linear }), -1);
    moveXStar2.value = withRepeat(withTiming(15, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);

    rotateFlower.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1);
    scaleFlower.value = withRepeat(withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);

    moveYCharacter.value = withRepeat(withTiming(-10, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  // Estilos animados para los elementos decorativos
  const animatedStar1 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateStar1.value}deg` },
      { translateY: moveYStar1.value },
    ],
  }));

  const animatedStar2 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateStar2.value}deg` },
      { translateX: moveXStar2.value },
    ],
  }));

  const animatedFlower = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotateFlower.value}deg` },
      { scale: scaleFlower.value },
    ],
  }));

  const animatedCharacter = useAnimatedStyle(() => ({
    transform: [
      { translateY: moveYCharacter.value },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Estrellas y flores animadas como fondo */}
      <Animated.Image
        source={require("../../../../assets/stars.png")}
        style={[styles.decorativeImage, { top: 50, left: 50, position: "absolute", width: 60, height: 60 }, animatedStar1]}
      />
      <Animated.Image
        source={require("../../../../assets/flower.png")}
        style={[styles.decorativeImage, { top: 150, right: 50, position: "absolute", width: 60, height: 60, opacity: 0.6 }, animatedStar2]}
      />
      <Animated.Image
        source={require("../../../../assets/flower.png")}
        style={[styles.decorativeImage, { bottom: 100, left: 30, position: "absolute", width: 80, height: 80, opacity: 0.7 }, animatedFlower]}
      />

      {/* Contenido principal: personaje y botones de login */}
      <View style={styles.content}>
        <Animated.Image
          source={require("../../../../assets/floating-rose.png")}
          style={[styles.characterImage, animatedCharacter]}
        />

        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Rose candle</Text>

          {/* Botón de login con teléfono */}
         

          {/* Botón de login con usuario */}
          <TouchableOpacity
            style={styles.buttonAlt}
            onPress={() => {
              setHoveredButton("user");
              goToUserLogin(); // navegación a UserLogin
            }}
          >
            <View style={styles.iconButton}>
              <FontAwesome name="user" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.buttonText}>Iniciar con Usuario</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F7F3",
    overflow: "hidden",
  },
  decorativeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  characterImage: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: "contain",
    marginBottom: 30,
  },
  formContainer: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
  },
  button: {
    backgroundColor: "#A78A5E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonAlt: {
    backgroundColor: "#5E84A7",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
