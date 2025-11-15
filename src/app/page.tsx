'use client'

import { BookOpen, GraduationCap, Brain, Target, Users, Zap } from 'lucide-react'

export default function EduAILandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Logo & Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            EDU AI
          </h1>
          <div className="inline-block bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
            <p className="text-xl md:text-2xl font-semibold">
              Trí tuệ nhân tạo trong giáo dục
            </p>
          </div>
        </div>

        {/* Main Tagline */}
        <div className="max-w-3xl text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Cách mạng hóa học tập với 
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text"> AI cá nhân hóa</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            Hệ thống học tập thông minh giúp cá nhân hóa trải nghiệm học tập, tối ưu hóa lộ trình và nâng cao hiệu quả tiếp thu kiến thức
          </p>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => window.location.href = '/login'}
          className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 mb-16"
        >
          <span className="relative z-10">Bắt đầu học ngay</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mt-5">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI Cá nhân hóa</h3>
            <p className="text-gray-300 text-sm">
              Hệ thống AI thích ứng với trình độ và phong cách học tập của từng người
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Lộ trình tối ưu</h3>
            <p className="text-gray-300 text-sm">
              Xây dựng lộ trình học tập thông minh dựa trên mục tiêu và khả năng
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Học tập cộng tác</h3>
            <p className="text-gray-300 text-sm">
              Kết nối với cộng đồng học tập và chia sẻ kiến thức cùng nhau
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mt-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center mb-3">
              <BookOpen className="w-5 h-5 text-cyan-400 mr-3" />
              <h4 className="text-lg font-semibold text-white">Đa dạng môn học</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Toán, Lý, Hóa, Văn, Ngoại ngữ và nhiều môn học khác
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-cyan-400 mr-3" />
              <h4 className="text-lg font-semibold text-white">Học mọi lúc</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Truy cập 24/7 trên mọi thiết bị, học tập linh hoạt
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 EDU AI - Nền tảng giáo dục thông minh thế hệ mới
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