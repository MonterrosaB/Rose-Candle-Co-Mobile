import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Importa tus pantallas
import Home from "../screens/Home/Home.js";
import Materials from "../screens/Materials/Materials.js";
import Sales from "../screens/Sales/Sales.js";


//Icons
import { Feather } from "@expo/vector-icons";      // Home
import { Octicons } from "@expo/vector-icons";     // Materials
import { MaterialIcons } from "@expo/vector-icons"; // Sales

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false, // Oculta texto por defecto
          tabBarStyle: {
            height: 70,
            marginTop:1,
            borderTopColor: "black", // Color negro
            backgroundColor: "#F9F7F3",
            borderTopWidth: 2,
            elevation: 10,
            marginLeft: -5,

          },
          tabBarIcon: ({ focused }) => {
            let IconComponent;
            let iconName;

            // Asignar icono según la ruta
            if (route.name === "Home") {
              IconComponent = Feather;
              iconName = "home";
            } else if (route.name === "Materials") {
              IconComponent = Octicons;
              iconName = "checklist";
            } else if (route.name === "Sales") {
              IconComponent = MaterialIcons;
              iconName = "local-offer";
            }

            // Si está activo, mostrar icono + texto en fondo café
            if (focused) {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#A78A5E", // Café
                    paddingHorizontal: 11,
                    paddingVertical: 1,
                    borderRadius: 15,
                    width: 100,
                    height:35,
                    alignItems: "center",
                  }}
                >
                  <IconComponent name={iconName} size={22} color="white"/>
                  <Text style={{ color: "white", marginLeft: 6 }}>
                    {route.name}
                  </Text>
                </View>
              );
            }

            // Si no está activo, solo icono gris
            return <IconComponent name={iconName} size={22} color="black" />;
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Materials" component={Materials} />
        <Tab.Screen name="Sales" component={Sales} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}