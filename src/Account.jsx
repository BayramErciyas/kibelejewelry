import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "./App";
import { supabase } from "./supabaseClient";

const EMPTY_CODE = ["", "", "", "", "", ""];
const PENDING_VERIFICATION_KEY = "kibele-pending-verification";

const ACCOUNT_COPY = {
  TR: {
    title: "Hesabım",
    intro:
      "Kibele dünyanıza giriş yapın; siparişlerinizi, hesap bilgilerinizi ve size özel deneyimleri tek yerde yönetin.",
    loginTab: "GİRİŞ YAP",
    registerTab: "HESAP OLUŞTUR",
    loginTitle: "Tekrar hoş geldiniz",
    loginIntro: "Kayıtlı e-posta adresiniz ve şifrenizle hesabınıza giriş yapın.",
    registerTitle: "Kibele hesabınızı oluşturun",
    registerIntro:
      "Hesabınızı oluşturun ve Kibele Jewelry deneyiminizi kişiselleştirin.",
    benefitOne: "Siparişlerinizi ve teslimat sürecini takip edin",
    benefitTwo: "Hesap bilgilerinizi güvenle yönetin",
    benefitThree: "Yeni koleksiyonlara ve özel deneyimlere ulaşın",
    fullName: "AD SOYAD",
    email: "E-POSTA ADRESİ",
    password: "ŞİFRE",
    confirmPassword: "ŞİFREYİ TEKRAR YAZIN",
    passwordHint: "En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam kullanın.",
    showPassword: "GÖSTER",
    hidePassword: "GİZLE",
    loginButton: "HESABIMA GİRİŞ YAP",
    registerButton: "HESABIMI OLUŞTUR",
    forgotPassword: "Şifrenizi mi unuttunuz?",
    missingEmail: "Önce e-posta adresinizi yazın.",
    resetSent: "Şifre yenileme bağlantısı e-posta adresinize gönderildi.",
    accountCreated: "Hesabınız oluşturuldu ve giriş yapıldı.",
    invalidCredentials: "E-posta adresi veya şifre hatalı.",
    emailNotConfirmed: "Giriş yapmadan önce e-posta adresinizi doğrulayın.",
    alreadyRegistered: "Bu e-posta adresiyle daha önce hesap oluşturulmuş.",
    weakPassword:
      "Şifreniz en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermelidir.",
    passwordMismatch: "Yazdığınız şifreler birbiriyle eşleşmiyor.",
    requiredName: "Lütfen adınızı ve soyadınızı yazın.",
    genericError: "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
    rateLimit: "Çok fazla deneme yapıldı. Lütfen kısa bir süre sonra tekrar deneyin.",
    loading: "HESABINIZ YÜKLENİYOR...",
    verificationKicker: "GÜVENLİ HESAP DOĞRULAMA",
    verificationTitle: "E-postanızı doğrulayın",
    verificationIntro: "Altı haneli doğrulama kodunu şu adrese gönderdik:",
    verificationCode: "DOĞRULAMA KODU",
    verificationHint: "E-posta birkaç dakika içinde gelmezse spam klasörünüzü kontrol edin.",
    verifyButton: "KODU DOĞRULA",
    codeSent: "Doğrulama kodunuz e-posta adresinize gönderildi.",
    codeRequired: "Lütfen altı haneli doğrulama kodunu eksiksiz yazın.",
    invalidCode: "Kod hatalı veya süresi dolmuş. Yeni bir kod isteyebilirsiniz.",
    verified: "E-posta adresiniz doğrulandı. Hesabınıza giriş yapıldı.",
    resendCode: "YENİ KOD GÖNDER",
    resendIn: "YENİ KOD",
    seconds: "SN",
    codeResent: "Yeni doğrulama kodu gönderildi.",
    changeEmail: "E-posta adresini değiştir",
    welcome: "Hoş geldiniz",
    accountInfo: "HESAP BİLGİLERİ",
    memberSince: "ÜYELİK TARİHİ",
    orders: "SİPARİŞLERİM",
    noOrders: "Henüz hesabınıza bağlı bir sipariş bulunmuyor.",
    shopNow: "TAKILARI KEŞFET",
    logout: "ÇIKIŞ YAP",
    customer: "Kibele Müşterisi",
    verifiedEmail: "DOĞRULANMIŞ E-POSTA",
    newPasswordTitle: "Yeni şifrenizi belirleyin",
    newPassword: "YENİ ŞİFRE",
    savePassword: "ŞİFREYİ KAYDET",
    passwordUpdated: "Şifreniz başarıyla güncellendi.",
  },
  EN: {
    title: "My Account",
    intro:
      "Enter your Kibele world and manage your orders, account details and personal experiences in one place.",
    loginTab: "SIGN IN",
    registerTab: "CREATE ACCOUNT",
    loginTitle: "Welcome back",
    loginIntro: "Sign in with your registered email address and password.",
    registerTitle: "Create your Kibele account",
    registerIntro: "Create an account and personalise your Kibele Jewelry experience.",
    benefitOne: "Follow your orders and delivery progress",
    benefitTwo: "Manage your account details securely",
    benefitThree: "Discover new collections and private experiences",
    fullName: "FULL NAME",
    email: "EMAIL ADDRESS",
    password: "PASSWORD",
    confirmPassword: "CONFIRM PASSWORD",
    passwordHint: "Use at least 8 characters with an uppercase letter, lowercase letter and number.",
    showPassword: "SHOW",
    hidePassword: "HIDE",
    loginButton: "SIGN IN TO MY ACCOUNT",
    registerButton: "CREATE MY ACCOUNT",
    forgotPassword: "Forgot your password?",
    missingEmail: "Enter your email address first.",
    resetSent: "A password reset link has been sent to your email.",
    accountCreated: "Your account was created and you are now signed in.",
    invalidCredentials: "The email address or password is incorrect.",
    emailNotConfirmed: "Verify your email address before signing in.",
    alreadyRegistered: "An account already exists with this email address.",
    weakPassword:
      "Your password must be at least 8 characters and contain uppercase, lowercase and a number.",
    passwordMismatch: "The passwords you entered do not match.",
    requiredName: "Please enter your full name.",
    genericError: "The operation could not be completed. Please try again.",
    rateLimit: "Too many attempts. Please wait a moment and try again.",
    loading: "LOADING YOUR ACCOUNT...",
    verificationKicker: "SECURE ACCOUNT VERIFICATION",
    verificationTitle: "Verify your email",
    verificationIntro: "We sent a six-digit verification code to:",
    verificationCode: "VERIFICATION CODE",
    verificationHint: "If the email does not arrive within a few minutes, check your spam folder.",
    verifyButton: "VERIFY CODE",
    codeSent: "Your verification code has been sent by email.",
    codeRequired: "Enter the complete six-digit verification code.",
    invalidCode: "The code is incorrect or has expired. You can request a new code.",
    verified: "Your email address has been verified. You are now signed in.",
    resendCode: "SEND A NEW CODE",
    resendIn: "NEW CODE",
    seconds: "SEC",
    codeResent: "A new verification code has been sent.",
    changeEmail: "Change email address",
    welcome: "Welcome",
    accountInfo: "ACCOUNT DETAILS",
    memberSince: "MEMBER SINCE",
    orders: "MY ORDERS",
    noOrders: "There are no orders linked to your account yet.",
    shopNow: "DISCOVER JEWELLERY",
    logout: "SIGN OUT",
    customer: "Kibele Customer",
    verifiedEmail: "VERIFIED EMAIL",
    newPasswordTitle: "Choose your new password",
    newPassword: "NEW PASSWORD",
    savePassword: "SAVE PASSWORD",
    passwordUpdated: "Your password has been updated successfully.",
  },
  ZH: {
    title: "我的账户",
    intro: "进入您的 Kibele 专属空间，在一个页面管理订单、账户信息与专属体验。",
    loginTab: "登录",
    registerTab: "创建账户",
    loginTitle: "欢迎回来",
    loginIntro: "使用您注册的电子邮箱和密码登录。",
    registerTitle: "创建您的 Kibele 账户",
    registerIntro: "创建账户，开启个性化 Kibele Jewelry 体验。",
    benefitOne: "查看订单与配送进度",
    benefitTwo: "安全管理账户信息",
    benefitThree: "探索新系列与专属体验",
    fullName: "姓名",
    email: "电子邮箱",
    password: "密码",
    confirmPassword: "再次输入密码",
    passwordHint: "至少 8 个字符，并包含大写字母、小写字母和数字。",
    showPassword: "显示",
    hidePassword: "隐藏",
    loginButton: "登录我的账户",
    registerButton: "创建我的账户",
    forgotPassword: "忘记密码？",
    missingEmail: "请先输入电子邮箱。",
    resetSent: "密码重置链接已发送至您的邮箱。",
    accountCreated: "账户已创建并成功登录。",
    invalidCredentials: "电子邮箱或密码不正确。",
    emailNotConfirmed: "请先验证电子邮箱，然后再登录。",
    alreadyRegistered: "该电子邮箱已注册账户。",
    weakPassword: "密码至少需要 8 个字符，并包含大写字母、小写字母和数字。",
    passwordMismatch: "两次输入的密码不一致。",
    requiredName: "请输入您的姓名。",
    genericError: "无法完成操作，请重试。",
    rateLimit: "尝试次数过多，请稍后再试。",
    loading: "正在加载账户...",
    verificationKicker: "安全账户验证",
    verificationTitle: "验证您的电子邮箱",
    verificationIntro: "我们已将六位验证码发送至：",
    verificationCode: "验证码",
    verificationHint: "如果几分钟内未收到邮件，请检查垃圾邮件文件夹。",
    verifyButton: "验证代码",
    codeSent: "验证码已发送至您的邮箱。",
    codeRequired: "请输入完整的六位验证码。",
    invalidCode: "验证码错误或已过期，您可以申请新的验证码。",
    verified: "电子邮箱验证成功，您已登录。",
    resendCode: "发送新验证码",
    resendIn: "新验证码",
    seconds: "秒",
    codeResent: "新的验证码已发送。",
    changeEmail: "更换电子邮箱",
    welcome: "欢迎",
    accountInfo: "账户信息",
    memberSince: "注册日期",
    orders: "我的订单",
    noOrders: "您的账户暂无关联订单。",
    shopNow: "探索珠宝",
    logout: "退出登录",
    customer: "Kibele 客户",
    verifiedEmail: "已验证邮箱",
    newPasswordTitle: "设置新密码",
    newPassword: "新密码",
    savePassword: "保存密码",
    passwordUpdated: "您的密码已成功更新。",
  },
  ES: {
    title: "Mi cuenta",
    intro:
      "Entra en tu universo Kibele y gestiona tus pedidos, tus datos y tus experiencias personales en un solo lugar.",
    loginTab: "INICIAR SESIÓN",
    registerTab: "CREAR CUENTA",
    loginTitle: "Te damos la bienvenida de nuevo",
    loginIntro: "Inicia sesión con tu correo electrónico registrado y tu contraseña.",
    registerTitle: "Crea tu cuenta Kibele",
    registerIntro: "Crea una cuenta y personaliza tu experiencia Kibele Jewelry.",
    benefitOne: "Consulta tus pedidos y el estado de entrega",
    benefitTwo: "Gestiona tus datos de forma segura",
    benefitThree: "Descubre nuevas colecciones y experiencias privadas",
    fullName: "NOMBRE COMPLETO",
    email: "CORREO ELECTRÓNICO",
    password: "CONTRASEÑA",
    confirmPassword: "CONFIRMAR CONTRASEÑA",
    passwordHint: "Usa al menos 8 caracteres con mayúscula, minúscula y un número.",
    showPassword: "MOSTRAR",
    hidePassword: "OCULTAR",
    loginButton: "INICIAR SESIÓN EN MI CUENTA",
    registerButton: "CREAR MI CUENTA",
    forgotPassword: "¿Has olvidado tu contraseña?",
    missingEmail: "Introduce primero tu correo electrónico.",
    resetSent: "Se ha enviado un enlace para restablecer la contraseña.",
    accountCreated: "Tu cuenta se ha creado y has iniciado sesión.",
    invalidCredentials: "El correo electrónico o la contraseña son incorrectos.",
    emailNotConfirmed: "Verifica tu correo electrónico antes de iniciar sesión.",
    alreadyRegistered: "Ya existe una cuenta con este correo electrónico.",
    weakPassword:
      "La contraseña debe tener al menos 8 caracteres e incluir mayúscula, minúscula y un número.",
    passwordMismatch: "Las contraseñas no coinciden.",
    requiredName: "Introduce tu nombre completo.",
    genericError: "No se pudo completar la operación. Inténtalo de nuevo.",
    rateLimit: "Demasiados intentos. Espera un momento y vuelve a intentarlo.",
    loading: "CARGANDO TU CUENTA...",
    verificationKicker: "VERIFICACIÓN SEGURA DE CUENTA",
    verificationTitle: "Verifica tu correo",
    verificationIntro: "Hemos enviado un código de seis dígitos a:",
    verificationCode: "CÓDIGO DE VERIFICACIÓN",
    verificationHint: "Si no llega en unos minutos, revisa la carpeta de correo no deseado.",
    verifyButton: "VERIFICAR CÓDIGO",
    codeSent: "El código de verificación se ha enviado por correo.",
    codeRequired: "Introduce el código completo de seis dígitos.",
    invalidCode: "El código es incorrecto o ha caducado. Puedes solicitar uno nuevo.",
    verified: "Tu correo ha sido verificado. Has iniciado sesión.",
    resendCode: "ENVIAR UN CÓDIGO NUEVO",
    resendIn: "NUEVO CÓDIGO",
    seconds: "S",
    codeResent: "Se ha enviado un nuevo código de verificación.",
    changeEmail: "Cambiar correo electrónico",
    welcome: "Te damos la bienvenida",
    accountInfo: "DATOS DE LA CUENTA",
    memberSince: "MIEMBRO DESDE",
    orders: "MIS PEDIDOS",
    noOrders: "Todavía no hay pedidos vinculados a tu cuenta.",
    shopNow: "DESCUBRIR JOYERÍA",
    logout: "CERRAR SESIÓN",
    customer: "Cliente de Kibele",
    verifiedEmail: "CORREO VERIFICADO",
    newPasswordTitle: "Elige tu nueva contraseña",
    newPassword: "NUEVA CONTRASEÑA",
    savePassword: "GUARDAR CONTRASEÑA",
    passwordUpdated: "Tu contraseña se ha actualizado correctamente.",
  },
};

const localeByLanguage = {
  TR: "tr-TR",
  EN: "en-GB",
  ZH: "zh-CN",
  ES: "es-ES",
};

const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

const getFriendlyError = (error, copy, scope = "general") => {
  const message = String(error?.message || "").toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return copy.invalidCredentials;
  }

  if (message.includes("email not confirmed")) {
    return copy.emailNotConfirmed;
  }

  if (
    message.includes("already registered") ||
    message.includes("already exists") ||
    message.includes("user already registered")
  ) {
    return copy.alreadyRegistered;
  }

  if (
    message.includes("rate limit") ||
    message.includes("too many requests") ||
    message.includes("security purposes")
  ) {
    return copy.rateLimit;
  }

  if (
    scope === "verify" &&
    (message.includes("token") ||
      message.includes("otp") ||
      message.includes("expired"))
  ) {
    return copy.invalidCode;
  }

  if (message.includes("password")) {
    return copy.weakPassword;
  }

  return copy.genericError;
};

const readPendingVerification = () => {
  try {
    const raw = window.sessionStorage.getItem(PENDING_VERIFICATION_KEY);
    if (!raw) return "";

    const parsed = JSON.parse(raw);
    const stillValid =
      parsed?.email &&
      parsed?.createdAt &&
      Date.now() - Number(parsed.createdAt) < 24 * 60 * 60 * 1000;

    if (!stillValid) {
      window.sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
      return "";
    }

    return String(parsed.email);
  } catch {
    return "";
  }
};

export default function Account() {
  const { lang } = useContext(LanguageContext);
  const copy = ACCOUNT_COPY[lang] || ACCOUNT_COPY.TR;
  const codeInputRefs = useRef([]);

  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [mobileMode, setMobileMode] = useState("login");
  const [authView, setAuthView] = useState("forms");
  const [fullName, setFullName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState(EMPTY_CODE);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [messageScope, setMessageScope] = useState("");

  useEffect(() => {
    let active = true;

    const recoveryInUrl =
      window.location.hash.includes("type=recovery") ||
      new URLSearchParams(window.location.search).get("type") === "recovery";

    if (recoveryInUrl) setRecoveryMode(true);

    const storedPendingEmail = readPendingVerification();
    if (storedPendingEmail) {
      setPendingEmail(storedPendingEmail);
      setRegisterEmail(storedPendingEmail);
      setAuthView("verify");
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session || null);
        setSessionLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setSessionLoading(false);
        setMessage(copy.genericError);
        setMessageType("error");
        setMessageScope("global");
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession || null);
      setSessionLoading(false);

      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [copy.genericError]);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (authView !== "verify") return;

    const focusTimer = window.setTimeout(() => {
      codeInputRefs.current[0]?.focus();
    }, 120);

    return () => window.clearTimeout(focusTimer);
  }, [authView]);

  const showMessage = (text, type = "success", scope = "global") => {
    setMessage(text);
    setMessageType(type);
    setMessageScope(scope);
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
    setMessageScope("");
  };

  const messageFor = (scope) =>
    message && (messageScope === scope || messageScope === "global") ? (
      <div className={`account-message ${messageType}`} role="status">
        {message}
      </div>
    ) : null;

  const rememberPendingVerification = (targetEmail) => {
    try {
      window.sessionStorage.setItem(
        PENDING_VERIFICATION_KEY,
        JSON.stringify({ email: targetEmail, createdAt: Date.now() })
      );
    } catch {
      // The verification view still works if browser storage is unavailable.
    }
  };

  const clearPendingVerification = () => {
    try {
      window.sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
    } catch {
      // Nothing else is required if browser storage is unavailable.
    }
    setPendingEmail("");
    setVerificationCode([...EMPTY_CODE]);
  };

  const openVerification = (targetEmail, startCooldown = true) => {
    const normalizedEmail = targetEmail.trim();
    setPendingEmail(normalizedEmail);
    setRegisterEmail(normalizedEmail);
    setVerificationCode([...EMPTY_CODE]);
    setAuthView("verify");
    setResendSeconds(startCooldown ? 60 : 0);
    rememberPendingVerification(normalizedEmail);
    showMessage(copy.codeSent, "success", "verify");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    clearMessage();

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (error) throw error;
      setLoginPassword("");
    } catch (error) {
      if (
        String(error?.message || "")
          .toLowerCase()
          .includes("email not confirmed")
      ) {
        openVerification(loginEmail, false);
        showMessage(copy.emailNotConfirmed, "error", "verify");
      } else {
        showMessage(getFriendlyError(error, copy), "error", "login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    clearMessage();

    if (!fullName.trim()) {
      showMessage(copy.requiredName, "error", "register");
      return;
    }

    if (!isStrongPassword(registerPassword)) {
      showMessage(copy.weakPassword, "error", "register");
      return;
    }

    if (registerPassword !== confirmPassword) {
      showMessage(copy.passwordMismatch, "error", "register");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase.auth.signUp({
        email: registerEmail.trim(),
        password: registerPassword,
        options: {
          data: {
            full_name: fullName.trim(),
            language: lang,
          },
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) throw error;

      setRegisterPassword("");
      setConfirmPassword("");

      if (data.session) {
        clearPendingVerification();
        setSession(data.session);
        showMessage(copy.accountCreated);
      } else {
        openVerification(registerEmail);
      }
    } catch (error) {
      showMessage(getFriendlyError(error, copy), "error", "register");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCodeChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextCode = [...verificationCode];
    nextCode[index] = digit;
    setVerificationCode(nextCode);
    clearMessage();

    if (digit && index < nextCode.length - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !verificationCode[index] &&
      index > 0
    ) {
      codeInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < verificationCode.length - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (event) => {
    event.preventDefault();
    const digits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");

    if (!digits.length) return;

    const nextCode = [...EMPTY_CODE];
    digits.forEach((digit, index) => {
      nextCode[index] = digit;
    });
    setVerificationCode(nextCode);
    clearMessage();
    codeInputRefs.current[Math.min(digits.length, 6) - 1]?.focus();
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    clearMessage();

    const token = verificationCode.join("");
    if (token.length !== 6) {
      showMessage(copy.codeRequired, "error", "verify");
      return;
    }

    if (!pendingEmail) {
      showMessage(copy.missingEmail, "error", "verify");
      setAuthView("forms");
      setMobileMode("register");
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token,
        type: "signup",
      });

      if (error) throw error;

      clearPendingVerification();
      setAuthView("forms");
      setSession(data.session || null);
      showMessage(copy.verified);
    } catch (error) {
      setVerificationCode([...EMPTY_CODE]);
      codeInputRefs.current[0]?.focus();
      showMessage(getFriendlyError(error, copy, "verify"), "error", "verify");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendSeconds > 0 || submitting) return;

    if (!pendingEmail) {
      showMessage(copy.missingEmail, "error", "verify");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: pendingEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/account`,
        },
      });

      if (error) throw error;
      setVerificationCode([...EMPTY_CODE]);
      setResendSeconds(60);
      showMessage(copy.codeResent, "success", "verify");
      codeInputRefs.current[0]?.focus();
    } catch (error) {
      showMessage(getFriendlyError(error, copy, "verify"), "error", "verify");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeEmail = () => {
    const previousEmail = pendingEmail;
    clearPendingVerification();
    clearMessage();
    setRegisterEmail(previousEmail);
    setAuthView("forms");
    setMobileMode("register");
  };

  const handleForgotPassword = async () => {
    clearMessage();

    if (!loginEmail.trim()) {
      showMessage(copy.missingEmail, "error", "login");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(
        loginEmail.trim(),
        { redirectTo: `${window.location.origin}/account?type=recovery` }
      );

      if (error) throw error;
      showMessage(copy.resetSent, "success", "login");
    } catch (error) {
      showMessage(getFriendlyError(error, copy), "error", "login");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();

    if (!isStrongPassword(newPassword)) {
      showMessage(copy.weakPassword, "error", "recovery");
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setNewPassword("");
      setRecoveryMode(false);
      showMessage(copy.passwordUpdated);
    } catch (error) {
      showMessage(getFriendlyError(error, copy), "error", "recovery");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    await supabase.auth.signOut();
    setSubmitting(false);
    setMobileMode("login");
    setAuthView("forms");
    clearMessage();
  };

  if (sessionLoading) {
    return <div className="account-loading">{copy.loading}</div>;
  }

  if (session && recoveryMode) {
    return (
      <section className="account-page account-centered-page">
        <div className="account-recovery-card">
          <h1>{copy.newPasswordTitle}</h1>

          <form onSubmit={handlePasswordUpdate} className="account-form">
            <label>
              <span>{copy.newPassword}</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
              <small>{copy.passwordHint}</small>
            </label>

            {messageFor("recovery")}

            <button className="account-primary-button" type="submit" disabled={submitting}>
              {copy.savePassword}
            </button>
          </form>
        </div>
        <AccountStyles />
      </section>
    );
  }

  if (session) {
    const user = session.user;
    const displayName = user.user_metadata?.full_name || copy.customer;
    const memberSince = user.created_at
      ? new Intl.DateTimeFormat(localeByLanguage[lang] || "tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(user.created_at))
      : "—";

    return (
      <section className="account-page account-dashboard-page">
        <div className="account-dashboard-shell">
          <div className="account-dashboard-header">
            <div>
              <h1>
                {copy.welcome},<br />
                {displayName}
              </h1>
            </div>

            <button
              type="button"
              className="account-outline-button account-logout"
              onClick={handleLogout}
              disabled={submitting}
            >
              {copy.logout}
            </button>
          </div>

          {messageFor("dashboard")}

          <div className="account-dashboard-grid">
            <article className="account-info-card">
              <h2>{copy.accountInfo}</h2>
              <dl>
                <div>
                  <dt>{copy.fullName}</dt>
                  <dd>{displayName}</dd>
                </div>
                <div>
                  <dt>{copy.verifiedEmail}</dt>
                  <dd>
                    {user.email}
                    <span className="account-verified-mark" aria-label={copy.verifiedEmail}>
                      ✓
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>{copy.memberSince}</dt>
                  <dd>{memberSince}</dd>
                </div>
              </dl>
            </article>

            <article className="account-orders-card">
              <div>
                <span className="account-card-number">01</span>
                <h2>{copy.orders}</h2>
                <p>{copy.noOrders}</p>
              </div>
              <Link to="/jewellery" className="account-discover-link">
                {copy.shopNow} <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>
        </div>
        <AccountStyles />
      </section>
    );
  }

  if (authView === "verify") {
    return (
      <section className="account-page account-centered-page account-verification-page">
        <div className="account-verification-card">
          <span className="account-kicker">{copy.verificationKicker}</span>
          <h1>{copy.verificationTitle}</h1>
          <p className="account-verification-intro">
            {copy.verificationIntro}
            <strong>{pendingEmail}</strong>
          </p>

          <form onSubmit={handleVerifyCode} className="account-verification-form">
            <span className="account-field-title">{copy.verificationCode}</span>
            <div className="account-code-inputs" onPaste={handleCodePaste}>
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    codeInputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleCodeChange(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  aria-label={`${copy.verificationCode} ${index + 1}`}
                />
              ))}
            </div>

            <small className="account-verification-hint">{copy.verificationHint}</small>

            {messageFor("verify")}

            <button className="account-primary-button" type="submit" disabled={submitting}>
              {copy.verifyButton}
            </button>
          </form>

          <div className="account-verification-actions">
            <button
              type="button"
              className="account-text-button"
              onClick={handleResendCode}
              disabled={submitting || resendSeconds > 0}
            >
              {resendSeconds > 0
                ? `${copy.resendIn} (${resendSeconds} ${copy.seconds})`
                : copy.resendCode}
            </button>
            <button type="button" className="account-text-button" onClick={handleChangeEmail}>
              {copy.changeEmail}
            </button>
          </div>
        </div>
        <AccountStyles />
      </section>
    );
  }

  return (
    <section className="account-page account-auth-page">
      <div className="account-page-header">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
      </div>

      <div className="account-mobile-tabs" role="tablist">
        <button
          type="button"
          className={mobileMode === "login" ? "active" : ""}
          onClick={() => {
            setMobileMode("login");
            clearMessage();
          }}
          role="tab"
          aria-selected={mobileMode === "login"}
        >
          {copy.loginTab}
        </button>
        <button
          type="button"
          className={mobileMode === "register" ? "active" : ""}
          onClick={() => {
            setMobileMode("register");
            clearMessage();
          }}
          role="tab"
          aria-selected={mobileMode === "register"}
        >
          {copy.registerTab}
        </button>
      </div>

      <div className="account-auth-grid">
        <article
          className={`account-auth-panel account-login-panel ${
            mobileMode !== "login" ? "account-mobile-hidden" : ""
          }`}
        >
          <div className="account-panel-heading">
            <span>01</span>
            <h2>{copy.loginTitle}</h2>
            <p>{copy.loginIntro}</p>
          </div>

          <form onSubmit={handleLogin} className="account-form">
            <label>
              <span>{copy.email}</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>{copy.password}</span>
              <div className="account-password-field">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((current) => !current)}
                >
                  {showLoginPassword ? copy.hidePassword : copy.showPassword}
                </button>
              </div>
            </label>

            <button
              type="button"
              className="account-forgot"
              onClick={handleForgotPassword}
              disabled={submitting}
            >
              {copy.forgotPassword}
            </button>

            {messageFor("login")}

            <button className="account-primary-button" type="submit" disabled={submitting}>
              {copy.loginButton}
            </button>
          </form>
        </article>

        <article
          className={`account-auth-panel account-register-panel ${
            mobileMode !== "register" ? "account-mobile-hidden" : ""
          }`}
        >
          <div className="account-panel-heading">
            <span>02</span>
            <h2>{copy.registerTitle}</h2>
            <p>{copy.registerIntro}</p>
          </div>

          <ul className="account-benefits">
            {[copy.benefitOne, copy.benefitTwo, copy.benefitThree].map((benefit) => (
              <li key={benefit}>
                <span aria-hidden="true">◇</span>
                {benefit}
              </li>
            ))}
          </ul>

          <form onSubmit={handleRegister} className="account-form">
            <label>
              <span>{copy.fullName}</span>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
            </label>

            <label>
              <span>{copy.email}</span>
              <input
                type="email"
                value={registerEmail}
                onChange={(event) => setRegisterEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>{copy.password}</span>
              <div className="account-password-field">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((current) => !current)}
                >
                  {showRegisterPassword ? copy.hidePassword : copy.showPassword}
                </button>
              </div>
              <small>{copy.passwordHint}</small>
            </label>

            <label>
              <span>{copy.confirmPassword}</span>
              <input
                type={showRegisterPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>

            {messageFor("register")}

            <button className="account-primary-button" type="submit" disabled={submitting}>
              {copy.registerButton}
            </button>
          </form>
        </article>
      </div>
      <AccountStyles />
    </section>
  );
}

function AccountStyles() {
  return (
    <style>{`
      .account-page {
        --account-ink: #171715;
        --account-muted: #706e69;
        --account-line: #dcd8d0;
        --account-ivory: #f4f1eb;
        --account-accent: #315b50;
        width: 100%;
        min-height: calc(100vh - 175px);
        color: var(--account-ink);
        background: #fff;
      }

      .account-loading {
        min-height: 55vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        letter-spacing: 2.4px;
      }

      .account-auth-page {
        padding: 58px 18px 110px;
      }

      .account-page-header {
        width: min(660px, 100%);
        margin: 0 auto 38px;
        text-align: center;
      }

      .account-kicker {
        display: block;
        margin-bottom: 14px;
        color: var(--account-muted);
        font-size: 8px;
        font-weight: 600;
        letter-spacing: 2.5px;
      }

      .account-page-header h1,
      .account-verification-card h1,
      .account-recovery-card h1,
      .account-dashboard-header h1 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 400;
        line-height: 1.06;
        letter-spacing: -.8px;
      }

      .account-page-header h1 {
        font-size: clamp(42px, 5vw, 58px);
      }

      .account-page-header p {
        max-width: 650px;
        margin: 22px auto 0;
        color: var(--account-muted);
        font-size: 12px;
        line-height: 1.85;
      }

      .account-auth-grid {
        width: min(560px, 100%);
        margin: 0 auto;
        display: block;
        border: 1px solid var(--account-line);
        border-top: 0;
      }

      .account-auth-panel {
        padding: clamp(36px, 4vw, 52px);
      }

      .account-login-panel {
        background: #fff;
      }

      .account-register-panel {
        border-left: 0;
        background: #fff;
      }

      .account-panel-heading {
        margin-bottom: 34px;
      }

      .account-panel-heading > span {
        display: block;
        margin-bottom: 18px;
        color: var(--account-muted);
        font-size: 8px;
        letter-spacing: 1.8px;
      }

      .account-panel-heading h2 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(27px, 3vw, 38px);
        font-weight: 400;
        line-height: 1.18;
      }

      .account-panel-heading p {
        max-width: 430px;
        margin: 17px 0 0;
        color: var(--account-muted);
        font-size: 11px;
        line-height: 1.75;
      }

      .account-benefits {
        margin: -2px 0 34px;
        padding: 0;
        list-style: none;
      }

      .account-benefits li {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid rgba(23, 23, 21, .1);
        font-size: 10px;
        line-height: 1.5;
      }

      .account-benefits li > span {
        color: var(--account-accent);
        font-size: 14px;
      }

      .account-form {
        display: flex;
        flex-direction: column;
        gap: 21px;
      }

      .account-form label {
        display: flex;
        flex-direction: column;
        gap: 9px;
      }

      .account-form label > span,
      .account-field-title {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 1.5px;
      }

      .account-form input {
        width: 100%;
        height: 54px;
        border: 1px solid #cfcac1;
        border-radius: 0;
        outline: 0;
        padding: 0 15px;
        background: rgba(255, 255, 255, .88);
        color: var(--account-ink);
        font: inherit;
        font-size: 13px;
        transition: border-color .2s ease, box-shadow .2s ease;
      }

      .account-form input:focus,
      .account-code-inputs input:focus {
        border-color: var(--account-ink);
        box-shadow: 0 0 0 1px var(--account-ink);
      }

      .account-form small {
        color: var(--account-muted);
        font-size: 8px;
        line-height: 1.55;
      }

      .account-password-field {
        position: relative;
      }

      .account-password-field input {
        padding-right: 78px;
      }

      .account-password-field button {
        position: absolute;
        top: 50%;
        right: 14px;
        transform: translateY(-50%);
        border: 0;
        background: transparent;
        padding: 8px 0;
        font-size: 7px;
        font-weight: 700;
        letter-spacing: 1.1px;
        cursor: pointer;
      }

      .account-forgot,
      .account-text-button {
        border: 0;
        background: transparent;
        padding: 0;
        color: var(--account-ink);
        font-size: 9px;
        cursor: pointer;
        text-decoration: none !important;
      }

      .account-forgot {
        align-self: flex-end;
        margin-top: -10px;
      }

      .account-primary-button,
      .account-outline-button {
        min-height: 54px;
        border: 1px solid var(--account-ink);
        border-radius: 0;
        padding: 0 20px;
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 1.7px;
        cursor: pointer;
        transition: background .2s ease, color .2s ease;
      }

      .account-primary-button {
        background: var(--account-ink);
        color: #fff !important;
      }

      .account-primary-button:hover:not(:disabled) {
        background: var(--account-accent);
        border-color: var(--account-accent);
      }

      .account-outline-button {
        background: #fff;
        color: var(--account-ink);
      }

      .account-outline-button:hover:not(:disabled) {
        background: var(--account-ink);
        color: #fff;
      }

      .account-primary-button:disabled,
      .account-outline-button:disabled,
      .account-form button:disabled,
      .account-text-button:disabled {
        opacity: .45;
        cursor: wait;
      }

      .account-message {
        padding: 13px 15px;
        border: 1px solid #cddbd5;
        background: #f1f7f4;
        color: #244c42;
        font-size: 10px;
        line-height: 1.6;
      }

      .account-message.error {
        border-color: #e0caca;
        background: #fff5f4;
        color: #8a2f2a !important;
      }

      .account-mobile-tabs {
        width: min(560px, 100%);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        border: 1px solid var(--account-line);
      }

      .account-mobile-tabs button {
        min-height: 50px;
        border: 0;
        background: #fff;
        color: var(--account-muted);
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 1.3px;
        cursor: pointer;
      }

      .account-mobile-tabs button + button {
        border-left: 1px solid var(--account-line);
      }

      .account-mobile-tabs button.active {
        background: var(--account-ink);
        color: #fff !important;
      }

      .account-mobile-hidden {
        display: none;
      }

      .account-centered-page {
        display: grid;
        place-items: center;
        padding: 74px 18px 110px;
        background: var(--account-ivory);
      }

      .account-verification-card,
      .account-recovery-card {
        width: min(610px, 100%);
        padding: clamp(36px, 6vw, 70px);
        border: 1px solid var(--account-line);
        background: #fff;
        text-align: center;
        box-shadow: 0 24px 70px rgba(35, 31, 24, .07);
      }

      .account-verification-card h1,
      .account-recovery-card h1 {
        font-size: clamp(36px, 5vw, 53px);
      }

      .account-verification-intro {
        margin: 21px auto 35px;
        color: var(--account-muted);
        font-size: 11px;
        line-height: 1.8;
      }

      .account-verification-intro strong {
        display: block;
        margin-top: 3px;
        color: var(--account-ink);
        font-weight: 600;
        overflow-wrap: anywhere;
      }

      .account-verification-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .account-code-inputs {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 10px;
      }

      .account-code-inputs input {
        width: 100%;
        aspect-ratio: 1 / 1.08;
        border: 1px solid #cfcac1;
        border-radius: 0;
        outline: 0;
        background: #fff;
        color: var(--account-ink);
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(22px, 5vw, 31px);
        text-align: center;
      }

      .account-verification-hint {
        color: var(--account-muted);
        font-size: 8px;
        line-height: 1.6;
      }

      .account-verification-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        margin-top: 25px;
      }

      .account-verification-actions .account-text-button {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .account-recovery-card h1 {
        margin-bottom: 38px;
      }

      .account-recovery-card .account-form {
        text-align: left;
      }

      .account-dashboard-page {
        padding: 78px 7% 115px;
      }

      .account-dashboard-shell {
        width: min(1180px, 100%);
        margin: 0 auto;
      }

      .account-dashboard-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
        margin-bottom: 58px;
        padding-bottom: 42px;
        border-bottom: 1px solid var(--account-line);
      }

      .account-dashboard-header h1 {
        font-size: clamp(38px, 5vw, 64px);
      }

      .account-logout {
        min-width: 145px;
      }

      .account-dashboard-shell > .account-message {
        margin: -28px 0 32px;
      }

      .account-dashboard-grid {
        display: grid;
        grid-template-columns: .9fr 1.15fr;
        gap: 22px;
      }

      .account-info-card,
      .account-orders-card {
        min-height: 340px;
        padding: clamp(30px, 4vw, 48px);
        border: 1px solid var(--account-line);
      }

      .account-info-card {
        background: var(--account-ivory);
      }

      .account-info-card h2,
      .account-orders-card h2 {
        margin: 0 0 30px;
        font-size: 9px;
        letter-spacing: 2px;
      }

      .account-info-card dl {
        margin: 0;
      }

      .account-info-card dl > div {
        padding: 16px 0;
        border-bottom: 1px solid rgba(23, 23, 21, .12);
      }

      .account-info-card dt {
        margin-bottom: 7px;
        color: var(--account-muted);
        font-size: 7px;
        letter-spacing: 1.4px;
      }

      .account-info-card dd {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 12px;
        overflow-wrap: anywhere;
      }

      .account-verified-mark {
        display: inline-grid;
        place-items: center;
        flex: 0 0 auto;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--account-accent);
        color: #fff;
        font-size: 9px;
      }

      .account-orders-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #fff;
      }

      .account-card-number {
        display: block;
        margin-bottom: 22px;
        color: var(--account-muted);
        font-size: 8px;
        letter-spacing: 1.5px;
      }

      .account-orders-card p {
        max-width: 390px;
        margin: 0;
        color: var(--account-muted);
        font-size: 12px;
        line-height: 1.75;
      }

      .account-discover-link {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        width: fit-content;
        border: 0;
        color: var(--account-ink);
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 1.5px;
        text-decoration: none !important;
      }

      .account-discover-link span {
        font-size: 15px;
        font-weight: 400;
      }

      @media (max-width: 820px) {
        .account-auth-page {
          padding: 45px 18px 78px;
        }

        .account-page-header {
          margin-bottom: 34px;
        }

        .account-page-header h1 {
          font-size: 44px;
        }

        .account-page-header p {
          font-size: 11px;
        }

        .account-mobile-tabs {
          width: min(560px, 100%);
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--account-line);
          border-bottom: 0;
        }

        .account-mobile-tabs button {
          min-height: 47px;
          border: 0;
          background: #fff;
          color: var(--account-muted);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.3px;
        }

        .account-mobile-tabs button + button {
          border-left: 1px solid var(--account-line);
        }

        .account-mobile-tabs button.active {
          background: var(--account-ink);
          color: #fff;
        }

        .account-auth-grid {
          width: min(560px, 100%);
          display: block;
        }

        .account-auth-panel {
          padding: 34px 22px 40px;
        }

        .account-register-panel {
          border-left: 0;
        }

        .account-mobile-hidden {
          display: none;
        }

        .account-panel-heading h2 {
          font-size: 31px;
        }

        .account-centered-page {
          min-height: calc(100vh - 145px);
          padding: 42px 14px 70px;
        }

        .account-verification-card,
        .account-recovery-card {
          padding: 38px 19px 42px;
        }

        .account-verification-card h1,
        .account-recovery-card h1 {
          font-size: 37px;
        }

        .account-code-inputs {
          gap: 6px;
        }

        .account-verification-actions {
          flex-direction: column;
          gap: 14px;
        }

        .account-dashboard-page {
          padding: 50px 18px 80px;
        }

        .account-dashboard-header {
          align-items: flex-start;
          flex-direction: column;
          margin-bottom: 35px;
          padding-bottom: 32px;
        }

        .account-dashboard-header h1 {
          font-size: 40px;
        }

        .account-dashboard-grid {
          grid-template-columns: 1fr;
        }

        .account-info-card,
        .account-orders-card {
          min-height: 285px;
          padding: 28px 23px;
        }
      }
    `}</style>
  );
}