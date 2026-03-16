import { useState } from "react";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);

  const getApproxLocationFromIP = async () => {
    setLoading(true);
    setMessage("Mengambil lokasi perkiraan dari IP...");
    setData(null);

    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("Gagal mengambil data IP");

      const json = await res.json();

      const result = {
        source: "IP-based approximate location",
        ip: json.ip || "-",
        city: json.city || "-",
        region: json.region || "-",
        country: json.country_name || "-",
        postal: json.postal || "-",
        latitude: json.latitude || "-",
        longitude: json.longitude || "-",
        timezone: json.timezone || "-",
        isp: json.org || "-",
      };

      setData(result);
      setMessage("Lokasi perkiraan berhasil diambil.");
    } catch (err) {
      setMessage(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const getPreciseLocationFromBrowser = () => {
    if (!navigator.geolocation) {
      setMessage("Browser ini tidak mendukung geolocation.");
      return;
    }

    setLoading(true);
    setMessage("Meminta izin lokasi GPS/browser...");
    setData(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData({
          source: "Browser geolocation",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: `${position.coords.accuracy} meter`,
        });
        setMessage("Lokasi browser berhasil diambil.");
        setLoading(false);
      },
      (error) => {
        let msg = "Gagal mengambil lokasi browser.";
        if (error.code === 1) msg = "Izin lokasi ditolak oleh pengguna.";
        if (error.code === 2) msg = "Lokasi tidak tersedia.";
        if (error.code === 3) msg = "Permintaan lokasi timeout.";
        setMessage(msg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Location Check-in</h1>
        <p className="subtitle">
          Halaman ini hanya mengambil lokasi setelah pengguna memberi izin.
        </p>

        <div className="notice">
          <strong>Catatan:</strong> Lokasi berbasis IP hanya perkiraan.
          Lokasi browser/GPS membutuhkan persetujuan pengguna.
        </div>

        <div className="actions">
          <button onClick={getApproxLocationFromIP} disabled={loading}>
            Ambil lokasi perkiraan (IP)
          </button>
          <button onClick={getPreciseLocationFromBrowser} disabled={loading}>
            Ambil lokasi presisi (izin browser)
          </button>
        </div>

        {message && <p className="message">{message}</p>}

        {data && (
          <div className="result">
            <h2>Hasil</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}