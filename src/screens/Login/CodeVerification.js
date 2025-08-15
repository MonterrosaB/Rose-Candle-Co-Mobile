// CodeVerificationScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function CodeVerificationScreen({ route }) {
  const { phone } = route.params;
  const [code, setCode] = useState("");

  const handleVerify = () => {
    if (!code) return alert("Ingrese el código");
    // Aquí verificas el código con tu API
    alert(`Código verificado para el número: ${phone}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.label}>Código</Text>
      <TextInput
        style={styles.codeInput}
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        maxLength={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9F7F3", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 20 },
  codeInput: { borderBottomWidth: 2, borderColor: "#333", fontSize: 32, textAlign: "center", letterSpacing: 20, marginBottom: 30, width: "60%" },
  button: { backgroundColor: "#A78A5E", padding: 12, borderRadius: 6, width: "60%", alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
