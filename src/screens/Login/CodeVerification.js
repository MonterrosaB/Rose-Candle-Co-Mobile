import React from 'react';
import usePhoneAuth from './hooks/usePhoneAuth';
import CodeVerificationUI from './components/CodeVerificationUI';


export default function CodeVerification() {
const props = usePhoneAuth();
return <CodeVerificationUI {...props} />;
}