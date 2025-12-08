'use client'

import { 
  Brain, Target, Users, Rocket, Award, Shield, 
  Globe, Heart, TrendingUp, Zap, Sparkles, GraduationCap,
  CheckCircle, Clock, MapPin, Mail, Phone, ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Nguyễn Minh Anh",
      role: "CEO & Founder",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinhAnh",
      bio: "Chuyên gia AI với 10+ năm kinh nghiệm trong giáo dục công nghệ"
    },
    {
      name: "Trần Văn Bình",
      role: "CTO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=VanBinh",
      bio: "Kiến trúc sư phần mềm, chuyên gia hệ thống phân tán"
    },
    {
      name: "Lê Thị Cẩm Tú",
      role: "Head of Education",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=CamTu",
      bio: "Tiến sĩ Giáo dục học, 15 năm kinh nghiệm đào tạo"
    },
    {
      name: "Phạm Quốc Dũng",
      role: "AI Research Lead",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuocDung",
      bio: "Tiến sĩ AI, cựu nghiên cứu viên tại Google AI"
    }
  ]

  const milestones = [
    { year: "2020", title: "Thành lập", description: "EduLearn AI được thành lập với sứ mệnh cách mạng hóa giáo dục" },
    { year: "2021", title: "Ra mắt phiên bản 1.0", description: "Phát hành nền tảng AI đầu tiên cho 10 trường đại học" },
    { year: "2022", title: "Mở rộng quốc tế", description: "Hợp tác với các tổ chức giáo dục tại 5 quốc gia" },
    { year: "2023", title: "Đạt 10,000+ học viên", description: "Mốc quan trọng với sự tin tưởng của cộng đồng" },
    { year: "2024", title: "AI Engine 2.0", description: "Ra mắt công nghệ AI thế hệ mới cho giáo dục" }
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Đam mê giáo dục",
      description: "Chúng tôi tin rằng giáo dục chất lượng là chìa khóa cho tương lai tốt đẹp hơn"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Minh bạch & Tin cậy",
      description: "Luôn trung thực và minh bạch trong mọi hoạt động kinh doanh"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Đổi mới liên tục",
      description: "Không ngừng cải tiến sản phẩm và dịch vụ để phục vụ tốt hơn"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Cộng đồng học tập",
      description: "Xây dựng cộng đồng học tập tích cực và hỗ trợ lẫn nhau"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Câu chuyện của chúng tôi
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Kiến tạo tương lai
              <span className="block">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  giáo dục thông minh
                </span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Từ năm 2020, EduLearn AI đã và đang tiên phong trong việc ứng dụng 
              trí tuệ nhân tạo để cách mạng hóa phương pháp giảng dạy và học tập.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Chúng tôi cam kết trao quyền cho mọi giảng viên và tổ chức giáo dục 
                bằng công cụ AI mạnh mẽ, giúp họ tập trung vào điều quan trọng nhất: 
                truyền cảm hứng và kiến thức cho thế hệ tương lai.
              </p>
              <div className="space-y-3">
                {[
                  "Cá nhân hóa trải nghiệm học tập",
                  "Tự động hóa quy trình giảng dạy",
                  "Nâng cao chất lượng giáo dục",
                  "Tiết kiệm thời gian và chi phí"
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-2xl mb-6">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tầm nhìn</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Trở thành nền tảng AI hàng đầu Đông Nam Á cho giáo dục, 
                kết nối 1 triệu giảng viên với 10 triệu học viên vào năm 2030, 
                tạo ra hệ sinh thái học tập thông minh và bền vững.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">1M+</div>
                  <div className="text-sm text-gray-600">Giảng viên</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">10M+</div>
                  <div className="text-sm text-gray-600">Học viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những cột mốc quan trọng trong hành trình kiến tạo giáo dục thông minh
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 transform -translate-y-1/2 hidden md:block"></div>

            <div className="grid md:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center 
                    ${index % 2 === 0 ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border-4 border-indigo-100'}`}>
                    {milestone.year}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những nguyên tắc dẫn dắt mọi quyết định và hành động của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 border border-gray-200 
                         hover:border-indigo-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
                  <div className="text-indigo-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những người tiên phong với đam mê thay đổi nền giáo dục
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 
                         transform hover:-translate-y-2 border border-gray-100 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-indigo-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
              <span>Gặp gỡ toàn bộ đội ngũ</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Kết nối với chúng tôi
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Luôn sẵn sàng lắng nghe và hợp tác cùng bạn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Trụ sở chính</h3>
                <p className="text-gray-600">Tòa nhà Innovation, Quận 1, TP.HCM</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-xl mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contact@edulearn.ai</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Điện thoại</h3>
                <p className="text-gray-600">(+84) 28 1234 5678</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Cùng chúng tôi kiến tạo tương lai giáo dục
          </h2>
          <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto">
            Dù bạn là giảng viên, tổ chức giáo dục hay doanh nghiệp đào tạo, 
            hãy cùng chúng tôi tạo ra những trải nghiệm học tập đột phá.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
              Tham gia đội ngũ
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
              Trở thành đối tác
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}