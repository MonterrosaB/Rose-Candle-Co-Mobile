import React from 'react';
import usePhoneAuth from './hooks/usePhoneAuth';
import PhoneLoginUI from './components/PhoneLoginUI';

export default function PhoneLoginScreen() {
  const props = usePhoneAuth();
  return <PhoneLoginUI {...props} />;
}