import React from "react";
import { usePasswordRecovery } from "./hooks/usePasswordRecovery";
import { PasswordRecoveryUI } from "./components/PasswordRecoveryUI";

const RecoveryPassword = () => {
  const API = "https://rose-candle-co.onrender.com/api"; // tu endpoint
  const props = usePasswordRecovery(API);
  return <PasswordRecoveryUI {...props} />;
};

export default RecoveryPassword;
