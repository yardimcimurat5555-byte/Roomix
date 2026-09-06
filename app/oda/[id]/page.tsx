"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Room = {
  id: string;
  name: string;
  description: string;
  is_public: boolean;
};

export default function OdaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createClient();

  const [oda, setOda] = useState<Room | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [mesaj, setMesaj] = useState("");
  const [kopyalandi, setKopyalandi] = useState(false);

  useEffect(() => {
    async function yukle() {
      const { id } = await params;

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/giris";
        return;
      }

      const { data, error } = await supabase
        .from("rooms")
        .select("id, name, description, is_public")
        .eq("id", id)
        .single();

      if (error || !data) {
        setMesaj("Oda bulunamadı veya bu odaya erişimin yok.");
        setYukleniyor(false);
        return;
      }

      setOda(data);
      setYukleniyor(false);
    }

    yukle();
  }, []);

  if (yukleniyor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070914] text-white">
        <div className="text-white/50">Oda yükleniyor...</div>
      </main>
    );
  }

  async function davetLinkiniKopyala() {
    const link = `${window.location.origin}/oda/${oda?.id}`;

    try {
      await navigator.clipboard.writeText(link);
      setKopyalandi(true);

      setTimeout(() => {
        setKopyalandi(false);
      }, 2000);
    } catch {
      setMesaj("Davet linki kopyalanamadı.");
    }
  }

  if (!oda) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070914] px-5 text-white">
        <div className="text-center">
          <div className="text-5xl">😕</div>
          <h1 className="mt-5 text-2xl font-black">Oda bulunamadı</h1>
          <p className="mt-2 text-white/45">{mesaj}</p>

          <a
            href="/"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-3 font-bold"
          >
            ← Ana sayfaya dön
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070914] px-5 py-8 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Ana sayfaya dön
        </a>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl">
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm text-pink-400">
                  {oda.is_public ? "🌍 Herkese açık oda" : "🔒 Özel oda"}
                </div>

                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  {oda.name}
                </h1>

                {oda.description && (
                  <p className="mt-3 text-white/45">{oda.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={davetLinkiniKopyala}
                  className="rounded-2xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm font-bold text-pink-200 transition hover:bg-pink-500/20"
                >
                  {kopyalandi ? "✓ Link Kopyalandı" : "🔗 Davet Linkini Kopyala"}
                </button>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                  <div className="text-2xl">👥</div>
                  <div className="mt-1 text-xs text-white/40">Oda</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-black/20">
              <div className="text-center">
                <div className="text-6xl">🎬</div>
                <h2 className="mt-5 text-2xl font-black">
                  Roomix odan hazır!
                </h2>
                <p className="mt-2 max-w-md text-white/40">
                  Bir sonraki adımda bu alana sohbet, sesli/görüntülü görüşme
                  ve birlikte izleme özelliklerini ekleyeceğiz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
