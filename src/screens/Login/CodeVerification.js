// CodeVerificationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import loginPic from "../../../assets/login.png";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "./AuthContext";


export default function CodeVerification({ route }) {
  const { confirmation } = useAuth();
  const navigation = useNavigation();
  const [code, setCode] = useState("");

  const confirmCode = async () => {
     try {
      await confirmation.confirm(code); // verifica el código
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }], // ✅ te manda cabal a MainTabs
      });
    } catch (error) {
      console.log(error);
      alert("Código incorrecto o expirado");
    }
  };

  // Obtener ancho de la pantalla
  const { width } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Image
        source={loginPic}
        style={{ width, height: 370, resizeMode: "cover" }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <Text style={styles.label}>Código</Text>
        <TextInput
          style={styles.codeInput}
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          maxLength={6}
        />
        <TouchableOpacity style={styles.button} onPress={confirmCode}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F7F3",
    padding: 0,
  },
  content: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 40,
    fontFamily: "Lora",
    fontWeight: "bold",
    marginBottom: 0,
  },
  label: { 
    fontSize: 20,
     fontWeight: "bold",
      marginBottom: 10,
       marginTop: 40 
      },
  codeInput: {
    borderBottomWidth: 2,
    borderColor: "#333",
    fontSize: 32,
    textAlign: "center",
    letterSpacing: 20,
    marginBottom: 30,
    width: "60%",
  },
  button: {
    backgroundColor: "#A78A5E",
    padding: 12,
    borderRadius: 6,
    width: "60%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
