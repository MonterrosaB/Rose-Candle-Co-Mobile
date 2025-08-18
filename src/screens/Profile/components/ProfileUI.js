"use client"

import { useEffect, useState, useContext } from "react"
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
} from "react-native"
import * as Animatable from "react-native-animatable" // Para animaciones de elementos
import Toast from "react-native-toast-message" // Para mostrar mensajes de error o éxito
import { LinearGradient } from "expo-linear-gradient" // Para botones con degradado
import { AuthContext } from "../../../context/AuthContext" // Contexto de autenticación
import { MaterialIcons } from "@expo/vector-icons" // Iconos

// Dimensiones de pantalla
const { width, height } = Dimensions.get("window")

// Endpoints de la API
const ApiAuth = "https://rose-candle-co.onrender.com/api/auth/verify"
const ApiEmployees = "https://rose-candle-co.onrender.com/api/employees"

// Animación de flotación para las rosas
const floatingAnimation = {
  0: { translateY: 0, rotate: "0deg" },
  0.5: { translateY: -20, rotate: "5deg" },
  1: { translateY: 0, rotate: "0deg" },
}

// Animación de pulso para elementos
const pulseAnimation = {
  0: { scale: 1 },
  0.5: { scale: 1.05 },
  1: { scale: 1 },
}

const ProfileUI = ({ navigation }) => {
  const { logout } = useContext(AuthContext) // Función para cerrar sesión

  // Estado local del formulario
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    surnames: "",
    phone: "",
    email: "",
    dui: "",
    user: "",
    password: "**********",
  })
  const [loading, setLoading] = useState(false)

  // Función para obtener datos del perfil desde la API
  const getProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch(ApiAuth, { credentials: "include" })
      if (!res.ok) throw new Error("Error al verificar usuario")

      const data = await res.json()
      const empRes = await fetch(`${ApiEmployees}/${data.id}`)
      if (!empRes.ok) throw new Error("Error al cargar empleado")
      const empData = await empRes.json()

      setFormData({
        id: empData._id || empData.id,
        name: empData.name || "",
        surnames: empData.surnames || "",
        phone: empData.phone || "",
        email: empData.email || "",
        dui: empData.dui || "",
        user: empData.user || "",
        password: "**********", // Oculta la contraseña
      })
    } catch (err) {
      console.error("Error getProfile:", err)
      Toast.show({ type: "error", text1: "No se pudo cargar el perfil" })
    } finally {
      setLoading(false)
    }
  }

  // Función para actualizar perfil en la API
  const updateProfile = async () => {
    try {
      setLoading(true)
      const sendData = { ...formData }
      if (sendData.password === "**********") delete sendData.password // No enviar si no cambió

      const res = await fetch(`${ApiEmployees}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      })

      if (!res.ok) throw new Error("Error al actualizar perfil")
      const result = await res.json()

      Toast.show({ type: "success", text1: "Perfil actualizado correctamente" })

      // Actualiza el formulario con los datos actualizados
      setFormData({
        ...formData,
        ...result,
        password: "**********",
      })
    } catch (err) {
      console.error("Error updateProfile:", err)
      Toast.show({ type: "error", text1: "Error al guardar cambios" })
    } finally {
      setLoading(false)
    }
  }

  // Cargar perfil al montar el componente
  useEffect(() => {
    getProfile()
  }, [])

  // Confirmación de cierre de sesión
  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Cerrar sesión", style: "destructive", onPress: () => logout(navigation) },
    ])
  }

  return (
    <View style={styles.container}>
      {/* Rosa flotante grande */}
      <Animatable.View
        animation={floatingAnimation}
        iterationCount="infinite"
        duration={3000}
        style={styles.floatingRose}
      >
        <Image source={require("../../../../assets/floating-rose.png")} style={styles.roseImage} resizeMode="contain" />
      </Animatable.View>

      {/* Rosa flotante pequeña */}
      <Animatable.View
        animation={floatingAnimation}
        iterationCount="infinite"
        duration={4000}
        delay={1500}
        style={styles.floatingRoseSmall}
      >
        <Image
          source={require("../../../../assets/floating-rose.png")}
          style={styles.roseImageSmall}
          resizeMode="contain"
        />
      </Animatable.View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Bienvenida</Text>
          <Text style={styles.title}>Mi Perfil</Text>
        </Animatable.View>

        {/* Campos del formulario */}
        {[
          { label: "Nombre", key: "name" },
          { label: "Apellidos", key: "surnames" },
          { label: "Teléfono", key: "phone", keyboard: "phone-pad" },
          { label: "Correo Electrónico", key: "email", keyboard: "email-address" },
          { label: "DUI", key: "dui" },
          { label: "Usuario", key: "user" },
          { label: "Contraseña", key: "password", secure: true },
        ].map((field, idx) => (
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

        {/* Botón Guardar Cambios */}
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

        {/* Botón Cerrar Sesión */}
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
  )
}

// Estilos
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
})

// Inicialización de animaciones personalizadas
Animatable.initializeRegistryWithDefinitions({
  floating: floatingAnimation,
  pulse: pulseAnimation,
})

export default ProfileUI
