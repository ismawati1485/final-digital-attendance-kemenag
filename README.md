
# Sistem Manajemen Rapat

Aplikasi web modern untuk mengelola rapat, absensi peserta, dan laporan dengan fitur tanda tangan digital.

## 🚀 Fitur Utama

### 📅 Manajemen Rapat
- Buat, edit, dan hapus rapat
- Jadwal rapat dengan waktu dan lokasi
- Status rapat (Terjadwal, Berlangsung, Selesai, Dibatalkan)
- Catatan dan deskripsi rapat

### ✅ Sistem Absensi
- Absensi real-time dengan tanda tangan digital
- Pencatatan keterlambatan otomatis
- Search peserta dari database karyawan
- Form absensi responsif untuk berbagai device

### 📊 Dashboard Admin
- Overview statistik rapat dan kehadiran
- Filter dan pencarian rapat
- Export data dan laporan
- Manajemen peserta rapat

### 🎨 Antarmuka Modern
- Desain responsif dengan Tailwind CSS
- Komponen UI konsisten dengan Shadcn/ui
- Gradient backgrounds dan animasi smooth
- Dark/Light mode support

## 🛠️ Teknologi

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + Shadcn/ui
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Backend**: Supabase (Database, Auth, Storage)

## 📦 Instalasi

### Prasyarat
- Node.js 18+ dan npm/yarn/pnpm/bun
- Git untuk version control

### Setup Local Development

```bash
# 1. Clone repository
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# 2. Install dependencies
npm install
# atau
yarn install
# atau
pnpm install
# atau  
bun install

# 3. Jalankan development server
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

Aplikasi akan berjalan di `http://localhost:8080`

```

## 📁 Struktur Project

```
src/
├── components/           # Komponen React
│   ├── ui/              # UI components (Shadcn/ui)
│   ├── AdminPanel.tsx   # Dashboard admin
│   ├── AttendanceForm.tsx # Form absensi
│   └── ...
├── pages/               # Halaman utama
│   ├── Index.tsx        # Landing page
│   ├── AdminDashboard.tsx
│   └── AttendancePage.tsx
├── content/             # Data statis
│   ├── employees.ts     # Data karyawan
│   ├── departments.ts   # Daftar departemen
│   └── texts.ts         # Teks aplikasi
├── hooks/               # Custom React hooks
├── lib/                 # Utilities
└── App.tsx             # Main app component
```

## 🔧 Development Workflow

### 1. Local Development
```bash
# Start development server
npm run dev

# Build untuk production
npm run build

# Preview build
npm run preview


```


## 📱 Fitur Aplikasi

### Landing Page (`/`)
- Overview aplikasi
- Quick access ke fitur utama
- Navigasi ke admin atau attendance

### Admin Dashboard (`/admin`)
- Manajemen rapat lengkap
- Statistik dan analytics
- CRUD operations
- Export/print laporan

### Attendance Page (`/attendance`)
- Form absensi real-time
- Signature capture
- Employee lookup
- Late tracking

### Detail Rapat (`/admin/meeting/:id`)
- Detail lengkap rapat
- Daftar peserta
- Status dan update

## 🎯 Penggunaan

### Untuk Admin
1. Akses `/admin` untuk dashboard
2. Buat rapat baru dengan form lengkap
3. Kelola peserta dan status rapat
4. Monitor attendance real-time
5. Generate laporan dan statistics

### Untuk Peserta
1. Akses `/attendance` saat rapat berlangsung
2. Isi data diri (atau search dari database)
3. Buat tanda tangan digital
4. Submit attendance

## 🔧 Kustomisasi

### Styling
- Edit `tailwind.config.ts` untuk custom theme
- Modify components di `src/components/ui/`
- Update gradient colors di CSS classes

### Data
- Update `src/content/employees.ts` untuk data karyawan
- Modify `src/content/jabatan.ts` untuk jabatan
- Edit `src/content/texts.ts` untuk localization



## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Supabase Connection Issues
- Verify environment variables
- Check RLS policies
- Review database schema
- Test connection di Supabase dashboard

### Performance Issues
- Optimize bundle size dengan lazy loading
- Implement virtual scrolling untuk large lists
- Add proper loading states
- Use React.memo untuk expensive components

## 📚 Resources


- [Supabase Integration Guide](./SUPABASE_INTEGRATION.md)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## 📄 License

MIT License - lihat `LICENSE` file untuk detail.
