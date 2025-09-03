
export const texts = {
  attendance: {
    title: 'Form Absensi',
    subtitle: 'Silakan isi data kehadiran Anda',
    noActiveMeeting: 'Tidak Ada Rapat Aktif',
    noActiveMeetingDesc: 'Saat ini tidak ada rapat yang sedang berlangsung.',
    successTitle: 'Absensi Berhasil!',
    successDesc: 'Terima kasih telah mengisi absensi. Data Anda telah tersimpan.',
    lateMessage: 'Terlambat {minutes} menit',
    onTime: 'Tepat Waktu',
    processing: 'Memproses...',
    submitButton: 'Kirim Absensi',
    backButton: 'Kembali',
    autoReset: 'Form akan reset otomatis untuk peserta berikutnya...'
  },
  form: {
    nameLabel: 'Nama Lengkap *',
    namePlaceholder: 'Cari dan pilih nama Anda...',
    emailLabel: 'Email *',
    emailPlaceholder: 'nama@email.com',
    departmentLabel: 'Departemen/Divisi *',
    departmentPlaceholder: 'Pilih departemen Anda',
    phoneLabel: 'No. Telepon',
    phonePlaceholder: '08xxxxxxxxxx',
    signatureLabel: 'Tanda Tangan Digital *',
    signatureHint: 'Silakan tanda tangani di area di atas menggunakan mouse atau sentuhan',
    requiredFields: '* Field wajib diisi',
    searching: 'Mencari...',
    noResults: 'Tidak ditemukan hasil',
    clearSelection: 'Hapus pilihan'
  },
  meeting: {
    dateLabel: 'Tanggal',
    timeLabel: 'Waktu',
    locationLabel: 'Lokasi',
    leaderLabel: 'Pemimpin',
    notesTitle: 'Catatan:',
    attendanceData: 'Data Kehadiran',
    attendanceDesc: 'Lengkapi informasi pribadi dan tanda tangan untuk mencatat kehadiran Anda'
  },
  errors: {
    requiredFields: 'Mohon lengkapi semua field yang wajib diisi',
    signatureRequired: 'Mohon tanda tangani form absensi',
    searchError: 'Terjadi kesalahan saat mencari data'
  }
} as const;
