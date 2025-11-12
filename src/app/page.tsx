'use client'

import { Store, ShoppingBag, TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react'

export default function AibanLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Logo & Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Aiban.vn
          </h1>
          <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text">
            <p className="text-xl md:text-2xl font-semibold">
              Quản lý cửa hàng thông minh
            </p>
          </div>
        </div>

        {/* Main Tagline */}
        <div className="max-w-3xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Giải pháp quản lý toàn diện cho 
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text"> cửa hàng của bạn</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Tối ưu hóa vận hành, tăng doanh thu và quản lý mọi khía cạnh của cửa hàng từ đơn hàng, kho hàng đến khách hàng một cách dễ dàng
          </p>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => window.location.href = '/login'}
          className="group relative px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 mb-16"
        >
          <span className="relative z-10">Đăng nhập để quản trị</span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-5">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Thống kê chi tiết</h3>
            <p className="text-gray-300 text-sm">
              Theo dõi doanh thu và hiệu suất kinh doanh theo thời gian thực
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Xử lý nhanh chóng</h3>
            <p className="text-gray-300 text-sm">
              Quản lý đơn hàng và kho hàng một cách tự động và hiệu quả
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bảo mật tuyệt đối</h3>
            <p className="text-gray-300 text-sm">
              Dữ liệu được mã hóa và bảo vệ với tiêu chuẩn cao nhất
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Aiban.vn - Giải pháp quản lý cửa hàng chuyên nghiệp
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}