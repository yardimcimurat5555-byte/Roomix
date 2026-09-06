"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GirisPage() {
  const supabase = createClient();

  const [kayitModu, setKayitModu] = useState(false);
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");

  async function formGonder(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true);
    setMesaj("");

    if (kayitModu) {
      const { error } = await supabase.auth.signUp({
        email,
        password: sifre,
      });

      if (error) {
        setMesaj(error.message);
      } else {
        setMesaj(
          "Kayıt başarılı! E-posta adresini kontrol et ve hesabını doğrula."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: sifre,
      });

      if (error) {
        setMesaj("E-posta veya şifre hatalı.");
      } else {
        window.location.href = "/";
      }
    }

    setYukleniyor(false);
  }


  return (
    <main className="min-h-screen bg-[#08080c] text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a
            href="/"
            className="text-4xl font-black tracking-tight"
          >
            <span className="text-white">Room</span>
            <span className="text-pink-500">ix</span>
          </a>

          <h1 className="mt-8 text-3xl font-bold">
            {kayitModu ? "Roomix'e katıl" : "Tekrar hoş geldin"}
          </h1>

          <p className="mt-3 text-gray-400">
            {kayitModu
              ? "Hesabını oluştur ve odanı kurmaya başla."
              : "Roomix hesabına giriş yap."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <form onSubmit={formGonder} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                E-posta
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Şifre
              </label>

              <input
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="En az 6 karakter"
                minLength={6}
                required
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-500"
              />
            </div>

            {mesaj && (
              <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-200">
                {mesaj}
              </div>
            )}

            <button
              type="submit"
              disabled={yukleniyor}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3.5 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {yukleniyor
                ? "Lütfen bekle..."
                : kayitModu
                ? "Ücretsiz Kayıt Ol"
                : "Giriş Yap"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setKayitModu(!kayitModu);
              setMesaj("");
            }}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-gray-200 transition hover:bg-white/10"
          >
            {kayitModu
              ? "Zaten hesabım var → Giriş Yap"
              : "Hesabım yok → Kayıt Ol"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          Roomix'e devam ederek kullanım şartlarını kabul etmiş olursun.
        </p>
      </div>
    </main>
  );
}
