export interface Employee {
  id: string;
  name: string;
  email: string;
  jabatan: string;
  phone?: string;
}

// Sample employee data - dalam implementasi nyata, ini akan dari database
export const employees: Employee[] = [
  {
    id: "1",
    name: "Ahmad Wijaya",
    email: "ahmad.wijaya@kemenag.go.id",
    jabatan: "Bagian Umum",
    phone: "081234567890",
  },
  {
    id: "2",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@kemenag.go.id",
    jabatan: "Bagian Kepegawaian",
    phone: "081234567891",
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi.santoso@kemenag.go.id",
    jabatan: "Bagian Keuangan",
    phone: "081234567892",
  },
  {
    id: "4",
    name: "Fatimah Zahra",
    email: "fatimah.zahra@kemenag.go.id",
    jabatan: "Bagian Perencanaan",
    phone: "081234567893",
  },
  {
    id: "5",
    name: "Muhammad Rizki",
    email: "muhammad.rizki@kemenag.go.id",
    jabatan: "Bidang Pendidikan Islam",
    phone: "081234567894",
  },
  {
    id: "6",
    name: "Dewi Sartika",
    email: "dewi.sartika@kemenag.go.id",
    jabatan: "Bidang Urusan Agama Islam",
    phone: "081234567895",
  },
  {
    id: "7",
    name: "Ali Hassan",
    email: "ali.hassan@kemenag.go.id",
    jabatan: "Bidang Bimbingan Masyarakat Islam",
    phone: "081234567896",
  },
  {
    id: "8",
    name: "Khadijah Aminah",
    email: "khadijah.aminah@kemenag.go.id",
    jabatan: "Bidang Penyelenggaraan Haji dan Umrah",
    phone: "081234567897",
  },
  {
    id: "9",
    name: "Umar Faruq",
    email: "umar.faruq@kemenag.go.id",
    jabatan: "Sekretariat",
    phone: "081234567898",
  },
  {
    id: "10",
    name: "Aisyah Putri",
    email: "aisyah.putri@kemenag.go.id",
    jabatan: "Inspektorat",
    phone: "081234567899",
  },
  {
    id: "11",
    name: "Hadi Pranoto",
    email: "hadi.pranoto@kemenag.go.id",
    jabatan: "IT Support",
    phone: "081234567800",
  },
  {
    id: "12",
    name: "Nur Azizah",
    email: "nur.azizah@kemenag.go.id",
    jabatan: "Humas",
    phone: "081234567801",
  },
];
