import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import loginPic from '../../../../assets/login1.png'; 

export default function PhoneLoginUI({ phone, setPhone, handleContinue }) {
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <Image
        source={loginPic}
        style={{ width, height: 370, resizeMode: 'cover' }}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Iniciar ddSesión</Text>
        <Text style={styles.label}>Número de teléfono</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.info}>
          Recibirás un mensaje SMS con un código de verificación.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F7F3', padding: 0 },
  content: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Lora',
    fontWeight: 'bold',
    marginBottom: 0,
  },
  label: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 40 },
  input: {
    borderWidth: 2,
    textAlign: 'center',
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 20,
    width: '40%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  info: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
  button: {
    backgroundColor: '#A78A5E',
    padding: 12,
    borderRadius: 6,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
