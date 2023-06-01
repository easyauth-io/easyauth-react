import React from "react";
import { useAuth } from "react-oidc-context";

export const useEasyauth = () => {
  const auth = useAuth();
  return auth;
};
