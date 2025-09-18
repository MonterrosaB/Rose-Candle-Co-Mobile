import { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

export default function usePhoneAuth() {
  const [phone, setPhone] = useState('+');
  const [code, setCode] = useState('');
  const recaptchaVerifier = useRef(null); // ya no se usa, pero lo dejamos por compatibilidad con la UI
  const { setConfirmation, confirmation } = useAuth();
  const navigation = useNavigation();

  const handleContinue = async () => {
    if (!phone.startsWith('+')) {
      alert('Incluye el código de país, ej: +50377778888');
      return;
    }

    try {
      // Simulación: normalmente aquí iría la API para enviar el SMS
      console.log(`Simulando envío de SMS a ${phone}`);
      setConfirmation({ fake: true }); // marcamos como "confirmación iniciada"
      navigation.navigate('CodeVerification');
    } catch (err) {
      console.log('sendSMS error', err);
      alert('No se pudo enviar el SMS. Revisa el número o intenta más tarde.');
    }
  };

  const confirmCode = async () => {
    if (!confirmation) {
      alert('No hay una verificación en curso. Vuelve a intentar');
      return;
    }

    try {
      // Simulación: normalmente aquí verificarías el código recibido
      if (code.length === 6) {
        console.log(`Código ${code} verificado correctamente`);
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      } else {
        throw new Error('Código inválido');
      }
    } catch (error) {
      console.log('confirmCode error', error);
      alert('Código incorrecto o expirado');
    }
  };

  const onChangePhone = (text) => {
    if (!text.startsWith('+')) {
      setPhone('+' + text.replace(/^\+/, ''));
    } else {
      setPhone(text);
    }
  };

  return {
    phone,
    setPhone: onChangePhone,
    recaptchaVerifier, // no hace nada, pero no rompe la UI existente
    handleContinue,
    code,
    setCode,
    confirmCode,
    confirmation,
  };
}
