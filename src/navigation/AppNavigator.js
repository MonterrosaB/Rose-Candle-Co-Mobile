import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import Home from "../screens/Home/Home.js";

import Materials from "../screens/Materials/Materials.js";
import MaterialsDetails from "../screens/Materials/MaterialsDetails.js";

import Stock from "../screens/Stock/Stock.js";

import Suppliers from "../screens/Suppliers/Suppliers.js";
import SupplierDetails from "../screens/Suppliers/SupliersDetails.js";

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


import Products from "../screens/Products/Products.js";
import ProductDetail from "../screens/Products/ProductDetail.js";


import Employees from "../screens/Employees/Employees.js"; 
import EmployeesDetail from "../screens/Employees/EmployeesDetail.js";

import Record from "../screens/Record/Record.js";

// ----------------------------------------------------
// Profile (stack independiente)
// ----------------------------------------------------
import Profile from "../../src/screens/Profile/ProfileScreen.js";

// ----------------------------------------------------
// Login y autenticación
// ----------------------------------------------------
import LoginSelector from "../screens/Login/LoginSelector.js";
import PhoneLoginScreen from "../screens/Login/PhoneLoginScreen.js";
import CodeVerificationScreen from "../screens/Login/CodeVerification.js";
import UserLoginScreen from "../screens/Login/UserLoginScreen.js";

// Splash
import SplashScreen from "../screens/Splash/SplashScreen.js";

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


function StockStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StockHome" component={Stock} />

      <Stack.Screen name="Materials" component={Materials} />
      <Stack.Screen name="MaterialsDetails" component={MaterialsDetails} />

      <Stack.Screen name="Suppliers" component={Suppliers} />
      <Stack.Screen name="SupplierDetails" component={SupplierDetails} />

      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="CategoriesDetails" component={CategoriesDetails} />

      <Stack.Screen name="CategoriesMateria" component={CategoriesMateria} />
      <Stack.Screen
        name="CategoriesMateriaDetail"
        component={CategoriesMateriaDetail}
      />
      <Stack.Screen name="Collections" component={Collections} />
      <Stack.Screen name="CollectionsDetail" component={CollectionsDetails} />

      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />

      <Stack.Screen name="Record" component={Record} />
    </Stack.Navigator>
  );
}


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

function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="LoginSelector" 
        component={LoginSelector} 
      />
      <Stack.Screen 
        name="PhoneLogin" 
        component={PhoneLoginScreen} 
      />
      <Stack.Screen 
        name="CodeVerification" 
        component={CodeVerificationScreen} 
      />
      <Stack.Screen 
        name="UserLogin" 
        component={UserLoginScreen} 
      />
    </Stack.Navigator>
  );
}



// ----------------------------------------------------
// COMPONENTE ANIMADO PARA ICONOS DE TAB
// ----------------------------------------------------
function AnimatedTab({ focused, icon: IconComponent, label, index, totalTabs }) {
  const baseWidth = 40; // espacio solo para icono
  const expandedWidth = 92; // icono + texto

  let extraPadding = 0;
  if (index === 0) extraPadding = 10; // primer tab
  if (index === totalTabs - 1) extraPadding = 10; // último tab

  return (
    <MotiView
      animate={{
        width: focused ? expandedWidth : baseWidth,
        backgroundColor: focused ? "#A78A5E" : "transparent",
        borderRadius: 20,
        paddingHorizontal: 10 + extraPadding, // agregamos padding extra
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
        <Text style={{ color: "white", fontSize: 11 }}>{label.text}</Text>
      </MotiView>
    </MotiView>
  );
}



function CustomTabButton({ children, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={1} 
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
// Profile (stack independiente)
// ----------------------------------------------------

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={Profile} />
    </Stack.Navigator>
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
          elevation: 0, 
          shadowOpacity: 0, 
        },
        tabBarButton: (props) => <CustomTabButton {...props} />, 
        tabBarIcon: ({ focused, index }) => {
      let IconComponent;
      let iconName;
      let textLabel;

      if (route.name === "Home") {
        IconComponent = Feather;
        iconName = "home";
        textLabel = "Inicio";
      } else if (route.name === "EmployeesStack") {
        IconComponent = MaterialIcons;
        iconName = "people";
        textLabel = "Empleados";
      } else if (route.name === "StockStack") {
        IconComponent = MaterialIcons;
        iconName = "inventory";
        textLabel = "Stock";
      } else if (route.name === "ProfileStack") {
        IconComponent = Feather;
        iconName = "user";
        textLabel = "Perfil";
      }

          return (
            <AnimatedTab
          focused={focused}
          icon={IconComponent}
          label={{ iconName, text: textLabel }}
          index={index}
          totalTabs={4} 
        />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="EmployeesStack" component={EmployeesStack} />
      <Tab.Screen name="StockStack" component={StockStack} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
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

        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="LoginStack" component={LoginStack} /> 
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
