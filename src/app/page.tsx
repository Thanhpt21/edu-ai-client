'use client'

import { BookOpen, GraduationCap, Brain, Target, Users, Zap, Video, FileText, PlayCircle } from 'lucide-react'

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
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Hệ thống AI E-LEARNING
          </h1>
          <div className="inline-block bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text">
            <p className="text-lg md:text-xl font-semibold">
              Nền tảng giáo dục thông minh thế hệ mới
            </p>
          </div>
        </div>

        {/* Main Tagline */}
        <div className="max-w-4xl text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
            Tạo bài giảng và video dạy học với AI - Quản lý toàn diện hệ thống đào tạo
          </h2>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => window.location.href = '/login'}
          className="group relative px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 mb-16"
        >
          <span className="relative z-10">Trải nghiệm ngay</span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mt-5">
          {/* AI Features */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tạo bài giảng với AI</h3>
            <p className="text-gray-300 text-sm">
              Tự động tạo nội dung bài giảng chuyên nghiệp với trí tuệ nhân tạo
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tạo video dạy học với AI</h3>
            <p className="text-gray-300 text-sm">
              Sản xuất video bài giảng chất lượng cao với công nghệ AI tiên tiến
            </p>
          </div>

          {/* Management Features */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Quản lý khóa học</h3>
            <p className="text-gray-300 text-sm">
              Quản lý toàn bộ khóa học, chương trình đào tạo và lộ trình học tập
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Quản lý học viên</h3>
            <p className="text-gray-300 text-sm">
              Theo dõi tiến độ, kết quả học tập và quản lý thông tin học viên
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Quản lý tài liệu</h3>
            <p className="text-gray-300 text-sm">
              Lưu trữ và quản lý tài liệu học tập, giáo trình một cách hệ thống
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <PlayCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Hệ thống E-Learning</h3>
            <p className="text-gray-300 text-sm">
              Nền tảng học tập trực tuyến đầy đủ tính năng và dễ sử dụng
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mt-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Zap className="w-5 h-5 text-cyan-400 mr-3" />
              <h4 className="text-lg font-semibold text-white">Tự động hóa</h4>
            </div>
            <p className="text-gray-400 text-sm">
              AI tự động tạo và tối ưu hóa nội dung học tập theo nhu cầu
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-cyan-400 mr-3" />
              <h4 className="text-lg font-semibold text-white">Cá nhân hóa</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Nội dung học tập được điều chỉnh phù hợp với từng học viên
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Hệ thống AI E-LEARNING - Nền tảng giáo dục thông minh toàn diện
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