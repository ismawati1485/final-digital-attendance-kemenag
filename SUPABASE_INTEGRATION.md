
# Panduan Integrasi Supabase - Sistem Manajemen Rapat

## Deskripsi Project
Sistem Manajemen Rapat adalah aplikasi web untuk mengelola rapat, absensi peserta, dan laporan rapat dengan fitur tanda tangan digital.

## Teknologi yang Digunakan
- **Frontend**: React + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **State Management**: TanStack Query

## Langkah Integrasi Supabase

### 1. Aktivasi Integrasi Lovable-Supabase
1. Klik tombol hijau **Supabase** di kanan atas interface Lovable
2. Pilih **"Connect to Supabase"**
3. Buat project Supabase baru atau hubungkan yang sudah ada
4. Salin Project URL dan Anon Key ke Lovable

### 2. Setup Database Schema

Setelah integrasi aktif, buat tabel-tabel berikut di Supabase:

#### Tabel `meetings`
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location VARCHAR(255),
  leader VARCHAR(255),
  description TEXT,
  notes TEXT,
  max_participants INTEGER DEFAULT 50,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabel `attendances`
```sql
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  signature_data TEXT,
  is_late BOOLEAN DEFAULT FALSE,
  late_minutes INTEGER DEFAULT 0,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabel `employees`
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  department VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  position VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Row Level Security (RLS) Policies

Aktifkan RLS dan buat policies:

```sql
-- Enable RLS
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Public read access untuk meetings
CREATE POLICY "Public can view meetings" ON meetings
  FOR SELECT USING (true);

-- Public insert untuk attendances
CREATE POLICY "Public can insert attendance" ON attendances
  FOR INSERT WITH CHECK (true);

-- Public read untuk employees
CREATE POLICY "Public can view employees" ON employees
  FOR SELECT USING (true);
```

### 4. Storage Bucket (Opsional)
Untuk menyimpan file attachment rapat:

```sql
-- Buat bucket untuk meeting attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('meeting-attachments', 'meeting-attachments', true);

-- Policy untuk upload files
CREATE POLICY "Public can upload meeting attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'meeting-attachments');
```

## Environment Variables

Setelah integrasi, variabel ini akan otomatis tersedia:
- `VITE_SUPABASE_URL`: URL project Supabase
- `VITE_SUPABASE_ANON_KEY`: Anonymous key Supabase

## Fitur yang Akan Tersedia Setelah Integrasi

### 1. Autentikasi (Opsional)
- Login admin untuk mengelola rapat
- Role-based access control

### 2. Database Operations
- CRUD operations untuk meetings
- Real-time attendance tracking
- Employee management

### 3. File Storage
- Upload attachment rapat
- Simpan signature sebagai image

### 4. Real-time Features
- Live attendance counter
- Real-time meeting status updates

## Migrasi dari Local Development

### Jika Anda Melakukan Development di Local:

1. **Backup Data Local**
   ```bash
   # Export data dari localStorage atau state management
   # Simpan dalam format JSON
   ```

2. **Sync ke Supabase**
   - Gunakan Supabase CLI atau dashboard
   - Import data ke tabel yang sesuai

3. **Update Code**
   - Ganti mock data dengan Supabase queries
   - Implementasikan real-time subscriptions

### Script Migration (Setelah Integrasi)

```javascript
// Contoh migration script
const migrateMeetingsToSupabase = async (localMeetings) => {
  const { data, error } = await supabase
    .from('meetings')
    .insert(localMeetings);
  
  if (error) console.error('Migration error:', error);
  else console.log('Migration success:', data);
};
```

## Testing Setelah Integrasi

1. **Test Connection**
   - Pastikan Supabase client terhubung
   - Cek database queries berfungsi

2. **Test CRUD Operations**
   - Create meeting baru
   - Read daftar meetings
   - Update meeting details
   - Delete meeting

3. **Test Real-time Features**
   - Attendance real-time updates
   - Meeting status changes

## Troubleshooting

### Error Connection
- Periksa Project URL dan Anon Key
- Pastikan RLS policies sudah benar
- Cek network connectivity

### Database Errors
- Verify table schema
- Check foreign key constraints
- Review RLS policies

### Migration Issues
- Backup data sebelum migration
- Test dengan data sample
- Monitor error logs

## Next Steps

Setelah integrasi Supabase aktif:
1. Implementasikan Supabase client di components
2. Replace mock data dengan real database queries  
3. Add real-time subscriptions
4. Implement file upload untuk attachments
5. Add authentication jika diperlukan

## Support

Jika mengalami kesulitan:
- Cek Supabase documentation
- Review Lovable integration docs
- Test dengan Supabase dashboard langsung

---

**Note**: File ini akan diupdate sesuai dengan progress integrasi dan development yang dilakukan.
