import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animación de salida (fade out)
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, 
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Splash'); 
      });
    }, 1000); 

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Decoraciones en pantalla (burbujas) */}
      <View style={[styles.decoration, { top: 50, left: 30, backgroundColor: '#FFD1DC' }]} />
      <View style={[styles.decoration, { top: 120, right: 40, backgroundColor: '#FFF0B3' }]} />
      <View style={[styles.decoration, { bottom: 80, left: 60, backgroundColor: '#D1F0FF' }]} />
      <View style={[styles.decoration, { bottom: 50, right: 30, backgroundColor: '#E5D1FF' }]} />
      <View style={[styles.decorationSmall, { top: 200, left: 100, backgroundColor: '#FFD1DC' }]} />
      <View style={[styles.decorationSmall, { bottom: 150, right: 100, backgroundColor: '#FFF0B3' }]} />

      {/* Contenido principal */}
      <Image 
        source={require('../../../assets/Logotipo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.text}>Bienvenido a Rose Candle Co</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.5,
  },
  decorationSmall: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.4,
  },
});
