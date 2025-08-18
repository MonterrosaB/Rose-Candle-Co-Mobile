"use client"

import { useEffect, useState, useRef } from "react"
import { View, Text, TouchableWithoutFeedback, ScrollView, StyleSheet, Dimensions, Animated, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native" // <-- Para detectar foco de la pestaña

const { width } = Dimensions.get("window")

const Stock = ({ navigation }) => {
  const isFocused = useIsFocused() // Saber si la pestaña está activa

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnims = useRef([]).current

  const menuItems = [
    { title: "Productos", screen: "Products", icon: "cube-outline", iconType: "Ionicons", colors: ["#BCA88E", "#A78A5E", "#7D7954"], delay: 100 },
    //{ title: "Historial", screen: "Record", icon: "history", iconType: "MaterialIcons", colors: ["#BCA88E", "#A78A5E", "#7D7954"], delay: 200 },
    { title: "Proveedores", screen: "Suppliers", icon: "people-outline", iconType: "Ionicons", colors: ["#7D7954", "#86918C", "#D3CCBE"], delay: 300 },
    { title: "Materia Prima", screen: "Materials", icon: "layers-outline", iconType: "Ionicons", colors: ["#BCA88E", "#A78A5E", "#7D7954"], delay: 400 },
    { title: "Categorías", screen: "Categories", iconType: "MaterialIcons", icon: "local-offer", colors: ["#A78A5E", "#BCA88E", "#DFCCAC"], delay: 500 },
    { title: "Categorías Materia", screen: "CategoriesMateria", icon: "category", iconType: "MaterialIcons", colors: ["#BCA88E", "#A78A5E", "#7D7954"], delay: 600 },
    { title: "Colecciones", screen: "Collections", icon: "layers", iconType: "MaterialIcons", colors: ["#86918C", "#D3CCBE", "#F2EBD9"], delay: 700 },
  ]

  // Inicializa las animaciones de escala
  if (scaleAnims.length === 0) {
    menuItems.forEach(() => scaleAnims.push(new Animated.Value(0)))
  }

  // Animación de aparición cada vez que la pestaña se enfoque
  useEffect(() => {
    if (isFocused) {
      fadeAnim.setValue(0)
      slideAnim.setValue(50)
      scaleAnims.forEach(anim => anim.setValue(0))

      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start()

      menuItems.forEach((item, index) => {
        Animated.spring(scaleAnims[index], { toValue: 1, delay: item.delay, useNativeDriver: true, friction: 6 }).start()
      })
    }
  }, [isFocused])

  const renderIcon = (item) => {
    const iconProps = { name: item.icon, size: 32, color: "#F9F7F3" }
    switch (item.iconType) {
      case "Ionicons": return <Ionicons {...iconProps} />
      case "MaterialIcons": return <MaterialIcons {...iconProps} />
      case "MaterialCommunityIcons": return <MaterialCommunityIcons {...iconProps} />
      default: return <Ionicons {...iconProps} />
    }
  }

  const handleItemPress = (index, screen) => {
    // Animación más rápida al presionar para navegación ágil
    Animated.sequence([
      Animated.spring(scaleAnims[index], { toValue: 0.95, useNativeDriver: true, speed: 3, bounciness: 10 }),
      Animated.spring(scaleAnims[index], { toValue: 1, useNativeDriver: true, speed: 3, bounciness: 10 }),
    ]).start(() => navigation.navigate(screen))
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient colors={["#F9F7F3", "#DFCCAC", "#BCA88E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.titleGradient}>
            <Text style={styles.title}>Panel de Control</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>Gestiona tu sistema</Text>
        </Animated.View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <TouchableWithoutFeedback key={item.screen} onPress={() => handleItemPress(index, item.screen)}>
              <Animated.View style={[styles.menuItemContainer, { transform: [{ scale: scaleAnims[index] }] }]}>
                <LinearGradient colors={["rgba(249,247,243,0.1)","rgba(223,204,172,0.05)"]} style={styles.menuItemBackground}>
                  <View style={styles.iconContainer}>
                    <LinearGradient colors={item.colors} style={styles.iconGradient}>
                      <View style={styles.iconInner}>{renderIcon(item)}</View>
                    </LinearGradient>
                  </View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>Gestionar {item.title.toLowerCase()}</Text>
                  <LinearGradient colors={item.colors} start={{ x:0, y:0 }} end={{ x:1, y:0 }} style={styles.bottomLine}/>
                </LinearGradient>
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.footerText}>Selecciona una opción para continuar</Text>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 40 },
  titleGradient: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, marginBottom: 15 },
  title: { fontSize: 32, fontWeight: "bold", color: "#000", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#D3CCBE", textAlign: "center", maxWidth: 300 },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 15 },
  menuItemContainer: { width: (width-55)/2, marginBottom: 15, borderRadius: 20, overflow: "hidden" },
  menuItemBackground: { flex:1, justifyContent:"center", alignItems:"center", padding:20, borderWidth:1, borderColor:"rgba(223,204,172,0.2)", borderRadius:20 },
  iconContainer: { marginBottom:15 },
  iconGradient: { width:64, height:64, borderRadius:32, padding:2 },
  iconInner: { flex:1, backgroundColor:"rgba(28,28,28,0.8)", borderRadius:30, justifyContent:"center", alignItems:"center" },
  menuItemTitle: { fontSize:16, fontWeight:"bold", color:"#000", textAlign:"center", marginBottom:8 },
  menuItemSubtitle: { fontSize:12, color:"#666", textAlign:"center", opacity:0.8 },
  bottomLine: { position:"absolute", bottom:0, left:"25%", right:"25%", height:3, borderRadius:2 },
  footer: { alignItems:"center", marginTop:30 },
  footerText: { fontSize:14, color:"#000", textAlign:"center" },
})

export default Stock
