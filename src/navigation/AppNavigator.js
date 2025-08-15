// AppNavigator.js
import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importa tus pantallas
import Home from "../screens/Home/Home.js";
import Materials from "../screens/Materials/Materials.js";
import Sales from "../screens/Sales/Sales.js";
import MaterialsDetails from "../screens/Materials/MaterialsDetails.js";
import Stock from "../screens/Stock/Stock.js";
import PhoneLogin from "../screens/Login/Login.js";
import CodeVerificationScreen from "../screens/Login/CodeVerification.js";

// Icons
import { Feather } from "@expo/vector-icons"; // Home
import { Octicons } from "@expo/vector-icons"; // Materials
import { MaterialIcons } from "@expo/vector-icons"; // Sales, Stock

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para Materials
function MaterialsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Materials" component={Materials} />
      <Stack.Screen name="MaterialsDetails" component={MaterialsDetails} />
    </Stack.Navigator>
  );
}

// Stack para Stock (incluye también Materials)
function StockStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StockHome" component={Stock} />
      <Stack.Screen name="Materials" component={Materials} />
      <Stack.Screen name="MaterialsDetails" component={MaterialsDetails} />
    </Stack.Navigator>
  );
}

// Tabs principales
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          marginTop: 1,
          borderTopColor: "black",
          backgroundColor: "#F9F7F3",
          borderTopWidth: 2,
          paddingTop: 5,
          elevation: 10,
          marginLeft: -5,
        },
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          let iconName;

          if (route.name === "Home") {
            IconComponent = Feather;
            iconName = "home";
          } else if (route.name === "MaterialsStack") {
            IconComponent = Octicons;
            iconName = "checklist";
          } else if (route.name === "Sales") {
            IconComponent = MaterialIcons;
            iconName = "local-offer";
          } else if (route.name === "StockStack") {
            IconComponent = MaterialIcons;
            iconName = "inventory";
          }

          if (focused) {
            return (
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "#A78A5E",
                  paddingHorizontal: 11,
                  paddingVertical: 1,
                  borderRadius: 15,
                  width: 100,
                  height: 35,
                  alignItems: "center",
                }}
              >
                <IconComponent name={iconName} size={22} color="white" />
                <Text style={{ color: "white", marginLeft: 6 }}>
                  {route.name === "MaterialsStack"
                    ? "Materials"
                    : route.name === "StockStack"
                    ? "Stock"
                    : route.name}
                </Text>
              </View>
            );
          }

          return <IconComponent name={iconName} size={22} color="black" />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MaterialsStack" component={MaterialsStack} />
      <Tab.Screen name="Sales" component={Sales} />
      <Tab.Screen name="StockStack" component={StockStack} />
    </Tab.Navigator>
  );
}

// Stack para Login
function LoginStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
      <Stack.Screen
        name="CodeVerificationScreen"
        component={CodeVerificationScreen}
      />
    </Stack.Navigator>
  );
}

// Navegador principal
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Flujo de Login primero */}
        <Stack.Screen name="LoginStack" component={LoginStack} />
        {/* Tabs principales después de login */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
