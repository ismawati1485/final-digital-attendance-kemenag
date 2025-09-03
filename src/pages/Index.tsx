
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Shield,
  Award,
  BookOpen,
  Building,
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-modern">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-emerald-gradient shadow-emerald sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center space-x-4">
              <motion.div
                className="w-16 h-16 bg-white/95 rounded-2xl flex items-center justify-center shadow-emerald animate-glow p-2"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/image/logo.png"
                  alt="Logo Kementerian Agama RI"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Balai Diklat Keagamaan Surabaya
                </h1>
                <p className="text-emerald-50 text-lg">
                  Kementerian Agama Republik Indonesia
                </p>
                <p className="text-emerald-100 text-sm">
                  Sistem Informasi Absensi dan Pengelolaan Rapat Akurat
                </p>
              </div>
            </motion.div>
            <Link to="https://www.bdksurabaya-kemenag.id/" target="_blank">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  className="bg-white/10 text-white border-white/30 px-4 py-2 text-lg font-semibold backdrop-blur-sm"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Official System
                </Badge>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Hero Section with Kemenag Logo Banner */}
      <motion.div
        className="container mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Kemenag Logo Banner */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-emerald p-8 max-w-4xl mx-auto border border-slate-200/60">
            <img
              src="/image/logokemenag.png"
              alt="Kementerian Agama RI - Balai Diklat Keagamaan Surabaya"
              className="w-full h-auto max-h-24 object-contain mx-auto"
            />
          </div>
        </motion.div>

        <div className="text-center mb-20">
          <motion.h2
            variants={itemVariants}
            className="text-6xl font-bold mb-8 text-slate-800"
          >
            Sistem Kehadiran Rapat Digital
            <br />
            <span className="text-green-700">Profesional & Terpercaya</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed"
          >
            Platform resmi untuk pengelolaan kehadiran rapat dan kegiatan
            pelatihan di lingkungan Balai Diklat Keagamaan Surabaya dengan
            teknologi tanda tangan digital yang aman dan terpercaya.
          </motion.p>

          {/* Government Credentials */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center space-x-8 mb-16"
          >
            <div className="flex items-center space-x-2 text-emerald-700">
              <Shield className="w-6 h-6" />
              <span className="font-semibold">Resmi Pemerintah</span>
            </div>
            <div className="w-2 h-2 bg-azure-500 rounded-full"></div>
            <div className="flex items-center space-x-2 text-emerald-700">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold">Terverifikasi</span>
            </div>
            <div className="w-2 h-2 bg-azure-500 rounded-full"></div>
            <div className="flex items-center space-x-2 text-emerald-700">
              <BookOpen className="w-6 h-6" />
              <span className="font-semibold">Pendidikan Keagamaan</span>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
          >
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="modern-card rounded-2xl p-8"
            >
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-slate-800 mb-2">
                Kehadiran Real-time
              </div>
              <div className="text-slate-600 text-lg"></div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="modern-card rounded-2xl p-8 border-2 border-azure-400 shadow-azure"
            >
              <Clock className="w-12 h-12 text-azure-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-azure-600 mb-2"> Deteksi Keterlambatan</div>
              <div className="text-slate-600 text-lg"></div>
            </motion.div>
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="modern-card rounded-2xl p-8"
            >
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <div className="text-2xl font-bold text-slate-800 mb-2">
              <span className="block">Digital</span>
              <span className="block">Tanda Tangan</span>
              </div>
          </motion.div>
          </motion.div>
        </div>

        {/* Selection Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-24"
        >
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="group cursor-pointer modern-card border-2 hover:border-emerald-400 transition-all duration-300 h-full bg-green-100"
              onClick={() => navigate("/admin-login")}
            >
              <CardHeader className="text-center pb-8">
                <motion.div
                  className="w-24 h-24 bg-emerald-gradient rounded-3xl mx-auto mb-8 flex items-center justify-center group-hover:shadow-emerald transition-all duration-300"
                  whileHover={{ rotate: 5 }}
                >
                  <Users className="w-12 h-12 text-white" />
                </motion.div>
                <CardTitle className="text-3xl mb-4 text-slate-800">
                  Panel Administrator
                </CardTitle>
                <CardDescription className="text-xl text-slate-600">
                  Kelola agenda rapat, monitor kehadiran peserta, dan buat
                  laporan komprehensif
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4 mb-8 text-slate-700">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">
                      Manajemen agenda rapat lengkap
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">
                      Monitoring kehadiran real-time
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">Export laporan PDF</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">Dashboard analitik lengkap</span>
                  </div>
                </div>
                <Button className="w-full modern-button-primary text-lg py-6 shadow-emerald rounded-xl bg-green-700 text-white">
                  Akses Panel Admin
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="group cursor-pointer modern-card border-2 hover:border-emerald-400  transition-all duration-300 h-full bg-green-100"
              onClick={() => navigate("/attendance")}
            >
              <CardHeader className="text-center pb-8">
                <motion.div
                  className="w-24 h-24 bg-emerald-gradient rounded-3xl mx-auto mb-8 flex items-center justify-center group-hover:shadow-azure transition-all duration-300"
                  whileHover={{ rotate: -5 }}
                >
                  <Calendar className="w-12 h-12 text-white" />
                </motion.div>
                <CardTitle className="text-3xl mb-4 text-slate-800">
                  Kehadiran Peserta
                </CardTitle>
                <CardDescription className="text-xl text-slate-600">
                  Lakukan presensi rapat dengan sistem tanda tangan digital yang
                  aman
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4 mb-8 text-slate-700">
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">
                      Form kehadiran yang user-friendly
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">
                      Tanda tangan digital tersertifikasi
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">Notifikasi status kehadiran</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-lg">Proses cepat dan aman</span>
                  </div>
                </div>
                <Button className="w-full modern-button-primary text-lg py-6 shadow-emerald rounded-xl bg-green-700 text-white">
                  Mulai Absen
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={containerVariants} className="text-center">
          <motion.h3
            variants={itemVariants}
            className="text-4xl font-bold mb-16 text-slate-800"
          >
            Fitur & Keunggulan Sistem
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                title: "Manajemen Agenda",
                desc: "Kelola jadwal rapat dan kegiatan dengan sistem yang terintegrasi",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: CheckCircle,
                title: "Kehadiran Digital",
                desc: "Sistem presensi modern dengan tanda tangan digital tersertifikasi",
                color: "text-azure-600 bg-azure-50",
              },
              {
                icon: Clock,
                title: "Tracking Waktu",
                desc: "Monitoring waktu kehadiran dengan akurasi tinggi dan laporan detail",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: Shield,
                title: "Keamanan Terjamin",
                desc: "Sistem keamanan berlapis dengan enkripsi data tingkat enterprise",
                color: "text-azure-600 bg-azure-50",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="modern-card rounded-2xl p-8 text-center"
              >
                <div
                  className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-xl mb-4 text-slate-800">
                  {feature.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800 text-slate-50 mt-20"
      >
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
                <img
                  src="/image/logo.png"
                  alt="Logo Kementerian Agama RI"
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-2xl font-bold">
                Balai Diklat Keagamaan Surabaya
              </h4>
            </div>
            <p className="text-slate-300 text-lg mb-4">
              Kementerian Agama Republik Indonesia
            </p>
            <div className="w-24 h-1 bg-azure-500 mx-auto mb-6"></div>
            <p className="text-slate-400">
              &copy; 2025 Balai Diklat Keagamaan Surabaya. Sistem Absensi
              Digital Resmi Pemerintah.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;
