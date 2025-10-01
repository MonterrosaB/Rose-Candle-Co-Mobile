import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

import { AuthContext } from "../../context/AuthContext"; // Contexto de autenticación

const { width } = Dimensions.get("window"); // ancho de pantalla para animaciones

const UserLoginScreen = ({ navigation }) => {
  const { login, authToken } = useContext(AuthContext); // login y token de auth

  const [user, setUser] = useState("");       // nombre de usuario
  const [password, setPassword] = useState(""); // contraseña
  const [loading, setLoading] = useState(false); // loader

  // Animaciones
  const slideAnim = useSharedValue(-width); // animación de entrada horizontal
  const floatAnim = useSharedValue(0);      // animación flotante de personaje

  useEffect(() => {
    if (authToken) {
      navigation.replace("MainTabs");
    }

    // Animación de slide de entrada
    slideAnim.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    // Animación flotante repetida
    floatAnim.value = withRepeat(
      withTiming(-15, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1, // infinito
      true // alternar dirección
    );
  }, [authToken]);

  // Estilos animados
  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  // Función para login con loader visible
  const handleLogin = async () => {
    if (loading) return; // prevenir dobles pulsaciones
    setLoading(true);

    // pequeño delay para asegurar que el loader renderiza
    await new Promise((res) => setTimeout(res, 50));

    try {
      const success = await login(user, password);

      if (success) {
        navigation.replace("MainTabs");
      } else {
        // Aquí podrías mostrar un Alert con error si quieres
      }
    } catch (e) {
      console.warn("Login error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón para regresar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Contenedor principal con animación de slide */}
      <Animated.View style={[styles.contentWrapper, slideStyle]}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Ingrese sus credenciales</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Input de usuario */}
          <View style={styles.inputContainer}>
            <FontAwesome
              name="user"
              size={20}
              color="#888"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={user}
              onChangeText={setUser}
              autoCapitalize="none"
              placeholderTextColor="#888"
              editable={!loading}
            />
          </View>

          {/* Input de contraseña */}
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#888"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#888"
              editable={!loading}
            />
          </View>

          {/* Olvidé mi contraseña */}
          <TouchableOpacity
  style={styles.forgotButton}
  disabled={loading}
  onPress={() => navigation.navigate("RecoveryPassword")} 
>
  <Text style={styles.forgotText}>Olvidé mi contraseña</Text>
</TouchableOpacity>


          {/* Botón de login */}
          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.9 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator
                  size="small"
                  color="#000"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.loginText}>Ingresando...</Text>
              </View>
            ) : (
              <Text style={styles.loginText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Personaje flotante */}
      <Animated.View style={[styles.characterContainer, floatStyle]}>
        <Image
          source={require("../../../assets/character.png")}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default UserLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 40,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 80,
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
  },
  form: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#aaa",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  characterContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 20,
  },
  characterImage: {
    width: width * 1.6,
    height: width * 0.9,
  },
});
