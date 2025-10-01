"use client";

import { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../../context/AuthContext";
import { useProfile } from "../hooks/useProfile";

const { width, height } = Dimensions.get("window");

const floatingAnimation = {
  0: { translateY: 0, rotate: "0deg" },
  0.5: { translateY: -20, rotate: "5deg" },
  1: { translateY: 0, rotate: "0deg" },
};

const pulseAnimation = {
  0: { scale: 1 },
  0.5: { scale: 1.05 },
  1: { scale: 1 },
};

const ProfileUI = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const { formData, setFormData, loading, updateProfile } = useProfile();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => logout(navigation) },
    ]);
  };

  const fields = [
    { label: "Nombre", key: "name" },
    { label: "Apellidos", key: "surnames" },
    { label: "Teléfono", key: "phone", keyboard: "phone-pad" },
    { label: "Correo Electrónico", key: "email", keyboard: "email-address" },
    { label: "DUI", key: "dui" },
    { label: "Usuario", key: "user" },
    { label: "Contraseña", key: "password", secure: true },
  ];

  return (
    <View style={styles.container}>
      <Animatable.View animation={floatingAnimation} iterationCount="infinite" duration={3000} style={styles.floatingRose}>
        <Image source={require("../../../../assets/floating-rose.png")} style={styles.roseImage} resizeMode="contain" />
      </Animatable.View>

      <Animatable.View animation={floatingAnimation} iterationCount="infinite" duration={4000} delay={1500} style={styles.floatingRoseSmall}>
        <Image source={require("../../../../assets/floating-rose.png")} style={styles.roseImageSmall} resizeMode="contain" />
      </Animatable.View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Bienvenida</Text>
          <Text style={styles.title}>Mi Perfil</Text>
        </Animatable.View>

        {fields.map((field, idx) => (
          <Animatable.View animation="fadeInRight" duration={800} delay={400 + idx * 100} key={field.key}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                value={formData[field.key]}
                onChangeText={(text) => setFormData({ ...formData, [field.key]: text })}
                keyboardType={field.keyboard || "default"}
                secureTextEntry={field.secure || false}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </Animatable.View>
        ))}

        <Animatable.View animation="fadeInUp" duration={800} delay={1100}>
          <TouchableOpacity
            style={[styles.buttonContainer, loading && styles.buttonDisabled]}
            onPress={updateProfile}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#d1d5db", "#9ca3af"]} style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Guardar Cambios</Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={1200}>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleLogout} activeOpacity={0.8}>
            <LinearGradient colors={["#f87171", "#dc2626"]} style={styles.logoutButton}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  floatingRose: { position: "absolute", top: 60, right: 20, zIndex: 1000, opacity: 0.7 },
  floatingRoseSmall: { position: "absolute", bottom: 100, left: 20, zIndex: 1000, opacity: 0.5 },
  roseImage: { width: 80, height: 80 },
  roseImageSmall: { width: 50, height: 50 },
  scrollContainer: { flexGrow: 1, padding: 25, paddingTop: 80 },
  headerContainer: { marginBottom: 40, alignItems: "center" },
  welcomeText: { fontSize: 16, color: "#be185d", fontWeight: "500", marginBottom: 5, letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: "800", color: "#1f2937", textAlign: "center", letterSpacing: -0.5 },
  inputContainer: { marginBottom: 25 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8, marginLeft: 4 },
  input: { borderWidth: 2, borderColor: "#f3e8ff", padding: 18, borderRadius: 15, backgroundColor: "#fefefe", fontSize: 16, color: "#1f2937" },
  buttonContainer: { marginTop: 15, borderRadius: 15, overflow: "hidden" },
  button: { paddingVertical: 18, alignItems: "center", justifyContent: "center" },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16, letterSpacing: 0.5 },
  logoutButton: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  logoutButtonText: { color: "#fff", fontWeight: "700", fontSize: 16, letterSpacing: 0.5 },
});

Animatable.initializeRegistryWithDefinitions({
  floating: floatingAnimation,
  pulse: pulseAnimation,
});

export default ProfileUI;
