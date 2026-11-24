import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../firebase";

export const setupRecaptcha = (containerId = "recaptcha-container") => {
  if (typeof window === "undefined") return null;

  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // ignore cleanup errors
    }
    window.recaptchaVerifier = null;
  }

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
  });

  return window.recaptchaVerifier;
};

export const sendRealOtp = async (
  phone10Digits,
  containerId = "recaptcha-container",
) => {
  const cleanPhone = String(phone10Digits || "")
    .replace(/\D/g, "")
    .slice(-10);
  if (cleanPhone.length !== 10) {
    throw new Error("Kripya sahi 10-digit mobile number daalein.");
  }

  const appVerifier = setupRecaptcha(containerId);
  const fullPhone = `+91${cleanPhone}`;
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    fullPhone,
    appVerifier,
  );
  return confirmationResult;
};

export const verifyRealOtp = async (confirmationResult, otpCode) => {
  if (!confirmationResult) {
    throw new Error("Pehle OTP bhejein.");
  }
  const cleanOtp = String(otpCode || "").trim();
  const credential = await confirmationResult.confirm(cleanOtp);
  return credential.user;
};
