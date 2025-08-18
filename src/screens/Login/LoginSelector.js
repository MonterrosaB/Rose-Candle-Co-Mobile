import React from "react";
import { useNavigation } from "@react-navigation/native"; // Hook para navegación
import LoginSelectorUI from "./components/LoginSelectorUI"; // UI del selector de login

export default function LoginSelector() {
  const navigation = useNavigation(); // obtener la navegación

  return (
    <LoginSelectorUI
      // Función para ir a la pantalla de login por teléfono
      goToPhoneLogin={() => navigation.navigate("PhoneLogin")}

      // Función para ir a la pantalla de login por usuario
      goToUserLogin={() => navigation.navigate("UserLogin")}
    />
  );
}
