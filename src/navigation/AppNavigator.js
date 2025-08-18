import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// ----------------------------------------------------
// Pantallas principales (asegúrate que las rutas de archivos existan)
// ----------------------------------------------------
import Home from "../screens/Home/Home.js";
import Materials from "../screens/Materials/Materials.js";
// import Sales from "../screens/Sales/Sales.js"; // <<< QUITADO DE LA BARRA
import MaterialsDetails from "../screens/Materials/MaterialsDetails.js";
import Stock from "../screens/Stock/Stock.js";

// Suppliers
import Suppliers from "../screens/Suppliers/Suppliers.js";
// Atención al nombre del archivo: ajusta si tu archivo se llama diferente
import SupplierDetails from "../screens/Suppliers/SupliersDetails.js";

// Categories (genéricas)
import Categories from "../screens/Categories/Categories.js";
import CategoriesDetails from "../screens/Categories/CategoriesDetails.js";

// ----------------------------------------------------
// CategoriesMateria (lista y detalle)
// ----------------------------------------------------
import CategoriesMateria from "../screens/CategoriesMateria/CategoriesMateria.js";
import CategoriesMateriaDetail from "../screens/CategoriesMateria/CategoriesMateriaDetail.js";

// ----------------------------------------------------
// Collections (lista y detalle)
// ----------------------------------------------------
import Collections from "../screens/Collections/Collections.js";
import CollectionsDetails from "../screens/Collections/CollectionsDetail.js";

// ----------------------------------------------------
// Products (lista y detalle) NUEVOS
// ----------------------------------------------------
import Products from "../screens/Products/Products.js";
import ProductDetail from "../screens/Products/ProductDetail.js";

// ----------------------------------------------------
// Employees (lista y detalle) NUEVOS
// ----------------------------------------------------
import Employees from "../screens/Employees/Employees.js"; 
// Si hay un detalle futuro, se agrega así:
import EmployeesDetail from "../screens/Employees/EmployeesDetail.js";

// ----------------------------------------------------
// Record (nueva pantalla dentro de Stock)
// ----------------------------------------------------
import Record from "../screens/Record/Record.js";

// Login (comentado)
// import PhoneLogin from "../screens/Login/Login.js";
// import CodeVerification from "../screens/Login/CodeVerification.js";

// Splash
import SplashScreen from "../screens/Splash/SplashScreen.js";

// >>> NUEVO: Importa la pantalla estática personalizada
import WelcomeScreen from "../screens/WelcomeScreen/WelcomeScreen.js";

// Icons
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

// Moti para animaciones
import { MotiView } from "moti";

// ----------------------------------------------------
// Navegadores
// ----------------------------------------------------
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ----------------------------------------------------
// STACK INTERNOS PARA "STOCK" (contiene pantallas relacionadas)
// ----------------------------------------------------
function StockStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pantalla principal del módulo Stock */}
      <Stack.Screen name="StockHome" component={Stock} />

      {/* Materials dentro de Stock */}
      <Stack.Screen name="Materials" component={Materials} />
      <Stack.Screen name="MaterialsDetails" component={MaterialsDetails} />

      {/* Suppliers dentro de Stock */}
      <Stack.Screen name="Suppliers" component={Suppliers} />
      <Stack.Screen name="SupplierDetails" component={SupplierDetails} />

      {/* Categories genéricas dentro de Stock */}
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="CategoriesDetails" component={CategoriesDetails} />

      {/* CategoriesMateria (lista) y su detalle dentro de Stock */}
      <Stack.Screen name="CategoriesMateria" component={CategoriesMateria} />
      <Stack.Screen
        name="CategoriesMateriaDetail"
        component={CategoriesMateriaDetail}
      />

      {/* Collections (lista y detalle) dentro de Stock */}
      <Stack.Screen name="Collections" component={Collections} />
      <Stack.Screen name="CollectionsDetail" component={CollectionsDetails} />

      {/* Products (lista y detalle) dentro de Stock */}
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />

      {/* Record (NUEVA pantalla dentro de Stock) */}
      <Stack.Screen name="Record" component={Record} />
    </Stack.Navigator>
  );
}

// ----------------------------------------------------
// STACK INTERNOS PARA "EMPLOYEES" (contiene pantallas relacionadas)
// ----------------------------------------------------
function EmployeesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pantalla principal del módulo Employees */}
      <Stack.Screen name="EmployeesHome" component={Employees} />

      {/* Detalle de Employee */}
      <Stack.Screen name="EmployeesDetail" component={EmployeesDetail} />
    </Stack.Navigator>
  );
}

// Stack para Login (comentado)
/*
function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
      <Stack.Screen name="CodeVerification" component={CodeVerification} />
    </Stack.Navigator>
  );
}
*/

// ----------------------------------------------------
// COMPONENTE ANIMADO PARA ICONOS DE TAB
// ----------------------------------------------------
function AnimatedTab({ focused, icon: IconComponent, label }) {
  const baseWidth = 40; // espacio solo para icono
  const expandedWidth = 110; // icono + texto

  return (
    <MotiView
      animate={{
        width: focused ? expandedWidth : baseWidth,
        backgroundColor: focused ? "#A78A5E" : "transparent",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
      transition={{ type: "timing", duration: 200 }}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: focused ? "flex-start" : "center",
      }}
    >
      <IconComponent
        name={label.iconName}
        size={22}
        color={focused ? "white" : "black"}
      />

      <MotiView
        animate={{
          opacity: focused ? 1 : 0,
          marginLeft: focused ? 6 : 0,
        }}
        transition={{ type: "timing", duration: 200 }}
        style={{
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Text style={{ color: "white", fontSize: 14 }}>{label.text}</Text>
      </MotiView>
    </MotiView>
  );
}

// ----------------------------------------------------
// BOTÓN PERSONALIZADO PARA QUITAR RIPPLE/SHADOW
// ----------------------------------------------------
function CustomTabButton({ children, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={1} // quita efecto de presionado gris
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

// ----------------------------------------------------
// TABS PRINCIPALES
// ----------------------------------------------------
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 65,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          backgroundColor: "#fff",
          elevation: 0, // Android
          shadowOpacity: 0, // iOS
        },
        tabBarButton: (props) => <CustomTabButton {...props} />, // sin ripple
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          let iconName;
          let textLabel;

          if (route.name === "Home") {
            IconComponent = Feather;
            iconName = "home";
            textLabel = "Home";
          } else if (route.name === "EmployeesStack") {
            IconComponent = MaterialIcons;
            iconName = "people";
            textLabel = "Employees";
          } else if (route.name === "StockStack") {
            IconComponent = MaterialIcons;
            iconName = "inventory";
            textLabel = "Stock";
          }

          return (
            <AnimatedTab
              focused={focused}
              icon={IconComponent}
              label={{ iconName, text: textLabel }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      {/* Sales eliminado de la barra */}
      <Tab.Screen name="EmployeesStack" component={EmployeesStack} />
      <Tab.Screen name="StockStack" component={StockStack} />
    </Tab.Navigator>
  );
}

// ----------------------------------------------------
// NAVEGADOR PRINCIPAL
// ----------------------------------------------------
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Primero Welcome */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        {/* Splash inicial */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Flujo de login (comentado) */}
        {/* <Stack.Screen name="LoginStack" component={LoginStack} /> */}

        {/* Tabs principales */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
