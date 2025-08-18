// Importaciones de React y componentes de React Native
import React from "react";
import { View, StyleSheet } from "react-native";

// Importamos el componente UI que renderiza la interfaz del perfil
import ProfileUI from "./components/ProfileUI";

// Importamos el hook personalizado que maneja la lógica del perfil
import { useProfile } from "./hooks/useProfile";

// Importamos useNavigation para poder navegar desde la UI del perfil
import { useNavigation } from "@react-navigation/native";

// Componente principal de la pantalla de perfil
const ProfileScreen = () => {
  // Llamamos al hook personalizado para obtener los datos y funciones del perfil
  const profileHook = useProfile(); 

  // Obtenemos el objeto de navegación para poder pasar a la UI y navegar entre pantallas
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Renderizamos el componente ProfileUI pasando todas las propiedades del hook y navigation */}
      <ProfileUI {...profileHook} navigation={navigation} />
    </View>
  );
};

// Estilos de la pantalla de perfil
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda la pantalla
    backgroundColor: "#fff", // Fondo blanco
    padding: 16, // Padding interno
  },
});

// Exportamos el componente para usarlo en la navegación
export default ProfileScreen;
