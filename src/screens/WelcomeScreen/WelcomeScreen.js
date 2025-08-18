// Importaciones de React y React Native
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

// Pantalla de bienvenida
export default function WelcomeScreen({ navigation }) {
  // Creamos una animación con Animated.Value inicializada en 1 (completamente visible)
  // useRef asegura que este valor no se reinicie cada vez que el componente renderiza
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // useEffect se ejecuta al montar la pantalla
  useEffect(() => {
    // Creamos un temporizador que dura 1 segundo
    const timer = setTimeout(() => {
      
      // Luego del segundo, ejecutamos una animación de opacidad
      Animated.timing(fadeAnim, {
        toValue: 0,       // la opacidad pasa de 1 a 0 (se desvanece)
        duration: 500,    // en 500ms (medio segundo)
        useNativeDriver: true, // usa driver nativo para mejor rendimiento
      }).start(() => {
        // Cuando termina la animación, reemplazamos la pantalla actual por "Splash"
        navigation.replace('Splash'); 
      });
    }, 1000); // espera 1 segundo antes de iniciar la animación

    // Limpiamos el temporizador en caso de que el componente se desmonte
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]); 
  // dependencias: se vuelve a ejecutar solo si cambia navigation o fadeAnim

  // Renderizado de la vista animada
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* === Decoraciones en la pantalla (círculos de colores tipo burbujas) === */}
      <View style={[styles.decoration, { top: 50, left: 30, backgroundColor: '#FFD1DC' }]} />
      <View style={[styles.decoration, { top: 120, right: 40, backgroundColor: '#FFF0B3' }]} />
      <View style={[styles.decoration, { bottom: 80, left: 60, backgroundColor: '#D1F0FF' }]} />
      <View style={[styles.decoration, { bottom: 50, right: 30, backgroundColor: '#E5D1FF' }]} />
      <View style={[styles.decorationSmall, { top: 200, left: 100, backgroundColor: '#FFD1DC' }]} />
      <View style={[styles.decorationSmall, { bottom: 150, right: 100, backgroundColor: '#FFF0B3' }]} />

      {/* === Contenido principal (logo y texto) === */}
      <Image 
        source={require('../../../assets/Logotipo.png')}  // logo de la app
        style={styles.logo} 
        resizeMode="contain"  // asegura que el logo no se deforme
      />
      <Text style={styles.text}>Bienvenido a Rose Candle Co</Text>
    </Animated.View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,                       // ocupa toda la pantalla
    justifyContent: 'center',      // centra en vertical
    alignItems: 'center',          // centra en horizontal
    backgroundColor: '#fff',       // fondo blanco
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  decoration: {
    position: 'absolute',          // posiciones absolutas en pantalla
    width: 60,
    height: 60,
    borderRadius: 30,              // círculo
    opacity: 0.5,                  // un poco transparente
  },
  decorationSmall: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,              // círculo más pequeño
    opacity: 0.4,
  },
});
