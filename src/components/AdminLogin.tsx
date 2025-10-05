import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, Key } from "lucide-react";
import { toast } from "sonner";
interface AdminLoginProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

//Kode admin yang digunakan
const ADMIN_CODE = "ADMINBDKSBY";

export const AdminLogin = ({ onBack, onLoginSuccess }: AdminLoginProps) => {
  const [adminCode, setAdminCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (adminCode === ADMIN_CODE) {
        toast.success("Login admin berhasil!");
        
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', new Date().toISOString());
        onLoginSuccess();
      } else {
        toast.error("Kode admin salah! Hanya admin yang memiliki akses.");
        setAdminCode("");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Login Admin</h1>
              <p className="text-sm text-gray-600">Masukkan kode admin untuk mengakses dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-0 shadow-xl bg-green-100">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-green-700">
              <Lock className="w-8 h-8 text-green-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">
              Akses Admin
            </CardTitle>
            <CardDescription className="text-green-700">
              Hanya admin yang memiliki kode khusus yang dapat mengakses fitur ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adminCode" className="flex items-center text-sm font-medium text-green-700">
                  <Key className="w-4 h-4 mr-2" />
                  Kode Admin
                </Label>
                <Input
                  id="adminCode"
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Masukkan kode admin"
                  className="h-12 text-center tracking-widest bg-white text-black placeholder:text-gray-400"
                  required
                />
                <p className="text-xs text-green-700 text-center">
                  Kode ini hanya diberikan kepada administrator sistem
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-green-700 text-white shadow-md hover:bg-green-800"
                disabled={isLoading || !adminCode.trim()}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span className="text-white">Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2 text-white" />
                    <span className="text-white">Login sebagai Admin</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-amber-800">Informasi Keamanan</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Kode admin bersifat rahasia dan hanya boleh diketahui oleh administrator yang berwenang.
                    Jangan bagikan kode ini kepada siapapun.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
