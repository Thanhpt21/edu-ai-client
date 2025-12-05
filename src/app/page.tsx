'use client'

import { BookOpen, GraduationCap, Brain, Target, Users, Zap, Video, FileText, PlayCircle, Star, Shield, Globe, Rocket, Award, BarChart3, Clock, Users2, Sparkles } from 'lucide-react'


export default function EduLandingPage() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Tạo bài giảng với AI",
      description: "Tự động tạo nội dung bài giảng chuyên nghiệp với trí tuệ nhân tạo",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video dạy học AI",
      description: "Sản xuất video bài giảng chất lượng cao với công nghệ AI tiên tiến",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Quản lý khóa học",
      description: "Quản lý toàn bộ khóa học, chương trình đào tạo và lộ trình học tập",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Quản lý học viên",
      description: "Theo dõi tiến độ, kết quả học tập và quản lý thông tin học viên",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Quản lý tài liệu",
      description: "Lưu trữ và quản lý tài liệu học tập, giáo trình một cách hệ thống",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: "Hệ thống E-Learning",
      description: "Nền tảng học tập trực tuyến đầy đủ tính năng và dễ sử dụng",
      color: "from-cyan-500 to-teal-600"
    }
  ]

  const stats = [
    { number: "10,000+", label: "Học viên", icon: <Users2 className="w-5 h-5" /> },
    { number: "500+", label: "Khóa học", icon: <BookOpen className="w-5 h-5" /> },
    { number: "100+", label: "Giảng viên", icon: <GraduationCap className="w-5 h-5" /> },
    { number: "24/7", label: "Hỗ trợ", icon: <Clock className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Nền tảng AI hàng đầu cho giáo dục
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Tạo bài giảng
              <span className="block">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  thông minh với AI
                </span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              EduLearn AI - Hệ thống quản lý đào tạo thông minh, giúp bạn tạo và quản lý 
              khóa học chuyên nghiệp chỉ với vài cú click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Bắt đầu miễn phí
                </span>
              </button>
              <button className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-300">
                Xem demo ngay
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="flex items-center justify-center text-gray-600 text-sm">
                    {stat.icon}
                    <span className="ml-2">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá những tính năng AI mạnh mẽ giúp bạn tạo và quản lý khóa học một cách dễ dàng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Benefits Section */}
      <section id="benefits" className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lợi ích từ AI của chúng tôi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tận dụng sức mạnh AI để tối ưu hóa quá trình giảng dạy và học tập
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-3 rounded-xl">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Tự động hóa thông minh</h3>
                    <p className="text-gray-600">AI tự động tạo và tối ưu hóa nội dung học tập theo nhu cầu cá nhân</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Cá nhân hóa lộ trình</h3>
                    <p className="text-gray-600">Nội dung học tập được điều chỉnh phù hợp với từng học viên</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Phân tích dữ liệu</h3>
                    <p className="text-gray-600">Theo dõi và phân tích hiệu quả học tập một cách chi tiết</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="text-center">
                  <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Trình tạo AI thông minh</h3>
                  <p className="text-gray-600 mb-6">
                    Chỉ cần nhập chủ đề, AI sẽ tự động tạo bài giảng hoàn chỉnh với:
                  </p>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                      Nội dung chi tiết và chính xác
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                      Slide bài giảng chuyên nghiệp
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                      Câu hỏi và bài tập tự động
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-3"></div>
                      Video bài giảng AI
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sẵn sàng thay đổi cách bạn giảng dạy?
          </h2>
          <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto">
            Tham gia cùng hơn 1,000+ tổ chức giáo dục đang sử dụng EduLearn AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
              Đăng ký miễn phí 14 ngày
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Được tin dùng bởi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hơn 500+ tổ chức giáo dục và doanh nghiệp đào tạo
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-center">
            {['ĐH Bách Khoa', 'ĐH Kinh tế', 'FPT Education', 'Techmaster', 'Topica', 'MindX'].map((name, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <GraduationCap className="w-8 h-8 text-gray-600" />
                </div>
                <div className="font-medium text-gray-700">{name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}