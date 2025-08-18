import { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../../../firebaseConfig';
import { useAuth } from '../../../context/AuthContext';

export default function usePhoneAuth() {
  const [phone, setPhone] = useState('+');
  const [code, setCode] = useState('');
  const recaptchaVerifier = useRef(null);
  const { setConfirmation, confirmation } = useAuth();
  const navigation = useNavigation();

  const handleContinue = async () => {
    if (!phone.startsWith('+')) {
      alert('Incluye el código de país, ej: +50377778888');
      return;
    }

    try {
      const result = await firebase
        .auth()
        .signInWithPhoneNumber(phone, recaptchaVerifier.current);

      setConfirmation(result);
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
      await confirmation.confirm(code);
      // si quieres, podrías setear user en el contexto via onAuthStateChanged
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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
    recaptchaVerifier,
    handleContinue,
    code,
    setCode,
    confirmCode,
    confirmation,
  };
}