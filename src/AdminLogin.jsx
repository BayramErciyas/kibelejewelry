import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">

        <div className="admin-brand">
          <div className="admin-brand-small">
            KIBELE
          </div>

          <h1>JEWELRY</h1>

          <div className="admin-brand-location">
            CAPPADOCIA
          </div>
        </div>

        <div className="admin-divider" />

        <h2>Yönetim Paneli</h2>

        <p className="admin-description">
          Ürünlerinizi ve mağaza içeriğinizi yönetmek için
          giriş yapın.
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-field">
            <label>E-POSTA</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-field">
            <label>ŞİFRE</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifreniz"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
          </button>

        </form>

        <button
          className="admin-back"
          onClick={() => navigate("/")}
        >
          ← MAĞAZAYA DÖN
        </button>

      </div>

      <style>{`

        .admin-login-page {
          min-height: 100vh;
          background: #f5f3ee;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 30px;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .admin-login-box {
          width: 100%;
          max-width: 460px;

          background: #ffffff;

          padding:
            55px
            50px
            45px;

          box-shadow:
            0 20px 60px
            rgba(0, 0, 0, 0.07);
        }

        .admin-brand {
          text-align: center;
          color: #111;
        }

        .admin-brand-small {
          font-size: 10px;
          letter-spacing: 6px;
          margin-left: 6px;
        }

        .admin-brand h1 {
          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-size: 34px;
          font-weight: 400;

          letter-spacing: 7px;

          margin:
            7px 0
            5px 7px;
        }

        .admin-brand-location {
          font-size: 8px;
          letter-spacing: 5px;
          margin-left: 5px;
          opacity: 0.55;
        }

        .admin-divider {
          width: 35px;
          height: 1px;

          background: #111;

          margin:
            35px auto
            30px;
        }

        .admin-login-box h2 {
          text-align: center;

          font-family:
            Georgia,
            "Times New Roman",
            serif;

          font-weight: 400;
          font-size: 23px;

          margin:
            0 0
            12px;
        }

        .admin-description {
          max-width: 320px;

          margin:
            0 auto
            35px;

          text-align: center;

          font-size: 12px;
          line-height: 1.7;

          color: #777;
        }

        .admin-field {
          margin-bottom: 22px;
        }

        .admin-field label {
          display: block;

          font-size: 9px;
          font-weight: 600;

          letter-spacing: 1.7px;

          margin-bottom: 9px;
        }

        .admin-field input {
          width: 100%;

          border: 1px solid #dedede;

          background: #fff;

          padding:
            15px
            14px;

          font-size: 13px;

          outline: none;

          box-sizing: border-box;

          transition:
            border-color
            0.25s ease;
        }

        .admin-field input:focus {
          border-color: #111;
        }

        .admin-error {
          background: #fff1f1;

          border:
            1px solid
            #efd2d2;

          padding: 12px;

          margin-bottom: 18px;

          font-size: 11px;

          text-align: center;

          color: #a33;
        }

        .admin-login-button {
          width: 100%;

          background: #111;
          color: #fff;

          border: 1px solid #111;

          padding:
            16px
            20px;

          margin-top: 5px;

          font-size: 10px;
          font-weight: 600;

          letter-spacing: 2px;

          cursor: pointer;

          transition:
            all
            0.25s ease;
        }

        .admin-login-button:hover {
          background: #fff;
          color: #111;
        }

        .admin-login-button:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .admin-back {
          width: 100%;

          border: none;
          background: transparent;

          margin-top: 25px;

          font-size: 9px;

          letter-spacing: 1.5px;

          cursor: pointer;

          color: #777;
        }

        .admin-back:hover {
          color: #111;
        }

        @media (max-width: 600px) {

          .admin-login-page {
            padding: 15px;
          }

          .admin-login-box {
            padding:
              45px
              25px
              35px;
          }

          .admin-brand h1 {
            font-size: 28px;
          }

        }

      `}</style>
    </div>
  );
}