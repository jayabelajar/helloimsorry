# HelloImSorry

HelloImSorry adalah dinding pesan anonim untuk menyampaikan permintaan maaf, ucapan terima kasih, atau pesan cinta singkat kepada siapa pun.

## Tech stack

- [Next.js 16 (App Router)](https://nextjs.org/docs) dengan React 19
- Supabase REST API (tanpa `supabase-js` di frontend publik)
- Tailwind CSS 4 untuk styling

## Menjalankan lokal

```bash
npm install
npm run dev
```

Kemudian buka `http://localhost:3000`.

## Environment variables

Salin `.env.local` dan isi nilai berikut:

| Nama                        | Scope (Vercel)              | Keterangan                                                   |
| --------------------------- | --------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`      | Production + Preview        | URL publik aplikasi, mis. `https://helloimsorry.vercel.app`. |
| `NEXT_PUBLIC_SUPABASE_URL`  | Production + Preview + Dev  | URL project Supabase.                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production + Preview + Dev | Anon/public API key Supabase.                                |
| `SUPABASE_SERVICE_ROLE_KEY` | Production + Preview        | Service role key Supabase (jaga agar tetap rahasia).         |

## Deploy ke Vercel

1. Push repository ini ke GitHub/GitLab.
2. Buat project baru di [Vercel](https://vercel.com/new) dan hubungkan repo.
3. Tambahkan environment variables seperti tabel di atas melalui Project Settings → Environment Variables.
4. Deploy; Vercel otomatis menjalankan `npm run build` dan mem-publish situs.

## Struktur SEO

Project ini sudah menambahkan:

- Metadata standar (title, description, keywords) + Open Graph & Twitter Card.
- Structured data (`WebSite` schema) dan file `sitemap.xml` / `robots.txt` otomatis.
- Canonical URL berdasarkan `NEXT_PUBLIC_SITE_URL`.

Pastikan variabel `NEXT_PUBLIC_SITE_URL` diisi agar metadata dan sitemap benar saat produksi.
