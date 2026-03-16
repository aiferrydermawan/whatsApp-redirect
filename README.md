## Location Check-in

Project ini akan:

- Mengambil lokasi pengunjung berdasarkan IP menggunakan `https://ipapi.co/json/`
- Menyimpan data tersebut ke tabel Supabase `location_logs`
- Menyimpan juga informasi dari URL path yang dikunjungi (mis. `/google`, `/youtube`)
- Setelah penyimpanan berhasil, mengarahkan pengunjung ke tujuan (Google, YouTube, dll.)

### Environment variables

Buat file `.env` di root project dengan isi:

```bash
VITE_SUPABASE_URL=URL_SUPABASE_ANDA
VITE_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA
```

### SQL: Membuat tabel Supabase

Jalankan SQL berikut di Supabase (menu **SQL** → **New query**) untuk membuat tabel `location_logs` yang sesuai dengan aplikasi ini:

```sql
create table if not exists public.location_logs (
  id            uuid primary key default gen_random_uuid(),
  source_path   text, -- contoh: "/google", "/youtube"
  source_slug   text, -- contoh: "google", "youtube", "root"
  ip            text,
  city          text,
  region        text,
  country       text,
  postal        text,
  latitude      text,
  longitude     text,
  timezone      text,
  isp           text,
  user_agent    text,
  visited_at    timestamptz default now()
);

-- Optional: index untuk mempercepat query berdasarkan waktu kunjungan
create index if not exists idx_location_logs_visited_at
  on public.location_logs (visited_at desc);

-- Jika tabel sudah terlanjur ada tanpa kolom source_path/source_slug,
-- jalankan perintah berikut sekali saja:
-- alter table public.location_logs add column if not exists source_path text;
-- alter table public.location_logs add column if not exists source_slug text;
```

Jika Anda ingin menambahkan kolom lain, sesuaikan juga payload insert di `src/App.jsx`.
