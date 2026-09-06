"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [isim, setIsim] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [fotoYukleniyor, setFotoYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState("");

  useEffect(() => {
    async function yukle() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/giris";
        return;
      }

      setEmail(data.user.email ?? "");
      setIsim(data.user.user_metadata?.display_name ?? data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? "");
      setAvatarUrl(data.user.user_metadata?.avatar_url ?? "");
      setYukleniyor(false);
    }

    yukle();
  }, []);

  async function kaydet() {
    setKaydediliyor(true);
    setMesaj("");

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: isim.trim(),
        avatar_url: avatarUrl,
      },
    });

    if (error) {
      setMesaj("Profil güncellenirken bir hata oluştu.");
    } else {
      setMesaj("Profil bilgilerin kaydedildi. ✓");
    }

    setKaydediliyor(false);
  }

  async function fotoYukle(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];

    if (!dosya) return;

    setFotoYukleniyor(true);
    setMesaj("");

    if (!dosya.type.startsWith("image/")) {
      setMesaj("Lütfen bir resim dosyası seç.");
      setFotoYukleniyor(false);
      return;
    }

    if (dosya.size > 5 * 1024 * 1024) {
      setMesaj("Fotoğraf en fazla 5 MB olabilir.");
      setFotoYukleniyor(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      window.location.href = "/giris";
      return;
    }

    const userId = userData.user.id;

    const uzanti = dosya.name.split(".").pop()?.toLowerCase() || "jpg";
    const dosyaAdi = `${userId}/${Date.now()}.${uzanti}`;

    const { error: yuklemeHatasi } = await supabase.storage
      .from("avatars")
      .upload(dosyaAdi, dosya, {
        cacheControl: "3600",
        upsert: false,
      });

    if (yuklemeHatasi) {
      setMesaj("Fotoğraf yüklenemedi. Lütfen tekrar dene.");
      setFotoYukleniyor(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(dosyaAdi);

    const yeniAvatarUrl = publicData.publicUrl;

    const { error: profilHatasi } = await supabase.auth.updateUser({
      data: {
        avatar_url: yeniAvatarUrl,
      },
    });

    if (profilHatasi) {
      setMesaj("Fotoğraf yüklendi fakat profil güncellenemedi.");
    } else {
      setAvatarUrl(yeniAvatarUrl);
      setMesaj("Profil fotoğrafın güncellendi. ✓");
    }

    setFotoYukleniyor(false);
    e.target.value = "";
  }

  if (yukleniyor) {
    return (
      <main className="min-h-screen bg-[#070914] text-white flex items-center justify-center">
        <div className="text-white/50">Profil yükleniyor...</div>
      </main>
    );
  }

  const harf = (isim || email || "R").charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#070914] px-5 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          ← Ana sayfaya dön
        </a>

        <div className="mt-8 text-center">
          <div className="relative mx-auto h-28 w-28">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 text-4xl font-black shadow-xl shadow-pink-500/20">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profil fotoğrafı"
                  className="h-full w-full object-cover"
                />
              ) : (
                harf
              )}
            </div>

            <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-[#070914] bg-gradient-to-r from-pink-500 to-fuchsia-600 text-lg shadow-lg">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={fotoYukle}
                disabled={fotoYukleniyor}
                className="hidden"
              />
            </label>
          </div>

          <h1 className="mt-5 text-3xl font-black">Profilim</h1>

          <p className="mt-2 text-white/45">
            Roomix profil bilgilerini buradan yönetebilirsin.
          </p>

          <p className="mt-3 text-xs text-white/30">
            Fotoğraf değiştirmek için kamera simgesine dokun.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
          <div>
            <label className="mb-2 block text-sm font-semibold text-white/70">
              Profil adı
            </label>

            <input
              type="text"
              value={isim}
              onChange={(e) => setIsim(e.target.value)}
              placeholder="Profil adını yaz"
              maxLength={40}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-pink-500"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-white/70">
              E-posta
            </label>

            <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/60">
              {email}
            </div>

            <p className="mt-2 text-xs text-white/30">
              E-posta adresin giriş hesabın olarak kullanılıyor.
            </p>
          </div>

          {mesaj && (
            <div className="mt-5 rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-200">
              {mesaj}
            </div>
          )}

          <button
            onClick={kaydet}
            disabled={kaydediliyor}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-4 py-3.5 font-bold shadow-lg shadow-pink-500/20 transition hover:opacity-90 disabled:opacity-50"
          >
            {kaydediliyor ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <h2 className="font-bold">Hesap</h2>

          <p className="mt-2 text-sm text-white/40">
            Oda oluşturma, arkadaşlar, bildirimler, abonelik ve diğer hesap
            seçeneklerini sonraki adımlarda buraya bağlayacağız.
          </p>
        </div>
      </div>
    </main>
  );
}
