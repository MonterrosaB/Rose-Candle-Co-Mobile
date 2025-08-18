import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import loginPic from "../../../../assets/login1.png";

export default function UserLoginUI({
  username,
  setUsername,
  password,
  setPassword,
  loading,
  handleLogin,
  goToRecovery,
  goBack,
}) {
  const { width } = Dimensions.get("window");

  const onSubmit = async () => {
    const result = await handleLogin();
    if (!result.ok) {
      Alert.alert("Error", result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={loginPic} style={{ width, height: 320, resizeMode: "cover" }} />

      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Nombre de usuario"
            autoCapitalize="none"
            style={styles.input}
            returnKeyType="next"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="********"
            secureTextEntry
            style={styles.input}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={styles.forgot} onPress={goToRecovery}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continuar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.back} onPress={goBack}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0ECE6" },
  card: {
    marginTop: 12,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#F7F5EE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16, color: "#3e3a2f" },
  inputGroup: { width: "100%", marginBottom: 12, alignItems: "flex-start" },
  label: { fontSize: 14, color: "#5b5846", marginBottom: 6 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1cdbf",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  forgot: { alignSelf: "flex-end", marginTop: 4, marginBottom: 12 },
  forgotText: { color: "#6b6b6b", fontSize: 13 },
  button: {
    marginTop: 6,
    width: "100%",
    backgroundColor: "#A78A5E",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  back: { marginTop: 12 },
  backText: { color: "#7d7d7d" },
});
