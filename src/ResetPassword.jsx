import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession();

      if (mounted) {
        setHasRecoverySession(Boolean(data.session));
        setCheckingLink(false);
      }
    };

    checkRecoverySession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(true);
        setCheckingLink(false);
        setError("");
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Yeni şifreniz en az 8 karakter olmalıdır.");
      return;
    }

    if (password !== passwordAgain) {
      setError("Yazdığınız şifreler birbiriyle eşleşmiyor.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(`Şifre güncellenemedi: ${updateError.message}`);
      return;
    }

    setMessage("Şifreniz başarıyla yenilendi. Giriş ekranına yönlendiriliyorsunuz.");
    window.setTimeout(() => navigate("/admin", { replace: true }), 1800);
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-box">
        <div className="reset-brand-small">KIBELE</div>
        <h1>JEWELRY</h1>
        <div className="reset-brand-location">CAPPADOCIA</div>
        <div className="reset-divider" />
        <h2>Yeni Şifre Belirleyin</h2>

        {checkingLink ? (
          <p className="reset-info">Bağlantı kontrol ediliyor...</p>
        ) : !hasRecoverySession ? (
          <>
            <div className="reset-error">
              Bu şifre yenileme bağlantısı geçersiz veya süresi dolmuş. Admin giriş
              ekranından yeni bir bağlantı isteyin.
            </div>
            <button className="reset-secondary" onClick={() => navigate("/admin")}>ADMIN GİRİŞİNE DÖN</button>
          </>
        ) : (
          <form onSubmit={handleUpdatePassword}>
            <label>YENİ ŞİFRE</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label>YENİ ŞİFRE TEKRAR</label>
            <input
              type="password"
              value={passwordAgain}
              onChange={(event) => setPasswordAgain(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            {error && <div className="reset-error">{error}</div>}
            {message && <div className="reset-success">{message}</div>}

            <button className="reset-primary" type="submit" disabled={loading || Boolean(message)}>
              {loading ? "GÜNCELLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .reset-password-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 30px; box-sizing: border-box; background: #f5f3ee; font-family: Arial, Helvetica, sans-serif; }
        .reset-password-box { width: 100%; max-width: 460px; padding: 55px 50px 45px; box-sizing: border-box; background: #fff; box-shadow: 0 20px 60px rgba(0,0,0,.07); text-align: center; }
        .reset-brand-small { font-size: 10px; letter-spacing: 6px; margin-left: 6px; }
        .reset-password-box h1 { margin: 7px 0 5px 7px; font: 400 34px Georgia, serif; letter-spacing: 7px; }
        .reset-brand-location { font-size: 8px; letter-spacing: 5px; margin-left: 5px; opacity: .55; }
        .reset-divider { width: 35px; height: 1px; margin: 35px auto 30px; background: #111; }
        .reset-password-box h2 { margin: 0 0 30px; font: 400 23px Georgia, serif; }
        .reset-password-box label { display: block; margin: 0 0 9px; text-align: left; font-size: 9px; font-weight: 600; letter-spacing: 1.7px; }
        .reset-password-box input { width: 100%; margin-bottom: 22px; padding: 15px 14px; box-sizing: border-box; border: 1px solid #dedede; outline: none; font-size: 13px; }
        .reset-password-box input:focus { border-color: #111; }
        .reset-error, .reset-success { margin-bottom: 18px; padding: 12px; font-size: 11px; line-height: 1.5; }
        .reset-error { border: 1px solid #efd2d2; background: #fff1f1; color: #a33; }
        .reset-success { border: 1px solid #cfe4d2; background: #f1f8f2; color: #35613b; }
        .reset-info { color: #777; font-size: 12px; }
        .reset-primary, .reset-secondary { width: 100%; padding: 16px 20px; cursor: pointer; font-size: 10px; font-weight: 600; letter-spacing: 2px; }
        .reset-primary { border: 1px solid #111; background: #111; color: #fff; }
        .reset-secondary { border: 1px solid #111; background: #fff; color: #111; }
        .reset-primary:disabled { opacity: .55; cursor: wait; }
        @media (max-width: 600px) { .reset-password-page { padding: 15px; } .reset-password-box { padding: 45px 25px 35px; } }
      `}</style>
    </div>
  );
}