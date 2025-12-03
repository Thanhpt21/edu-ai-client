// src/components/admin/lesson/LessonDetail.tsx
'use client'

import { Card, Descriptions, Tag, Space, Button, Row, Col, Statistic, message, Alert } from 'antd'
import { EditOutlined, EyeOutlined, PlayCircleOutlined, UserOutlined, VideoCameraOutlined, LinkOutlined, YoutubeOutlined, CloudUploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useLessonOneForAdmin } from '@/hooks/lesson/useLessonOneForAdmin'
import { useState } from 'react'
import { LessonAIVideos } from './LessonAIVideos'
import { useRouter } from 'next/navigation'
import { LessonUpdateModal } from '@/components/admin/lesson/LessonUpdateModal' // Thêm import

interface LessonDetailProps {
  lessonId: number
  onEdit?: () => void
}

// 🎯 COMPONENT HIỂN THỊ HTML AN TOÀN
const SafeHTMLRenderer = ({ html }: { html: string }) => {
  const sanitizeHTML = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, '')
  }

  return (
    <div 
      className="prose max-w-none p-4 bg-gray-50 rounded border"
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }}
    />
  )
}

// 🎯 COMPONENT VIDEO PLAYER TRỰC TIẾP
const VideoPlayer = ({ url, type }: { url: string; type: 'youtube' | 'supabase' | 'external' }) => {
  const extractYoutubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const getVideoTypeInfo = () => {
    switch (type) {
      case 'youtube': 
        return { 
          text: 'YouTube Video', 
          color: 'red', 
          icon: <YoutubeOutlined />
        };
      case 'supabase': 
        return { 
          text: 'Uploaded Video', 
          color: 'green', 
          icon: <CloudUploadOutlined />
        };
      default: 
        return { 
          text: 'Video', 
          color: 'default', 
          icon: <VideoCameraOutlined />
        };
    }
  };

  const typeInfo = getVideoTypeInfo();
  const youtubeId = extractYoutubeId(url);

  return (
    <div className="space-y-4">
      {/* Video Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {typeInfo.icon}
          <Tag color={typeInfo.color} className="text-sm font-medium">
            {typeInfo.text}
          </Tag>
        </div>
      
      </div>

      {/* Video Player Container */}
      <div className="border rounded-xl overflow-hidden shadow-lg bg-black">
        {type === 'youtube' && youtubeId ? (
          <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
            <video
              src={url}
              controls
              controlsList="nodownload"
              className="absolute top-0 left-0 w-full h-full bg-black"
              preload="metadata"
            >
              <source src={url} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 DETECT VIDEO TYPE
const detectVideoType = (url: string): 'youtube' | 'supabase' | 'external' => {
  if (!url) return 'external';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (url.includes('supabase.co') || url.includes('supabase.in')) {
    return 'supabase';
  }
  
  return 'external';
};

export const LessonDetail = ({ lessonId, onEdit }: LessonDetailProps) => {
  const { data: lesson, isLoading, refetch } = useLessonOneForAdmin(lessonId);
  const [htmlPreview, setHtmlPreview] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false); // State cho modal update
  const router = useRouter();

  const handleEdit = () => {
    setOpenUpdate(true);
  };

  const handleUpdateSuccess = () => {
    refetch(); // Tự động refetch dữ liệu mới
  };

  if (isLoading) {
    return <Card loading={true} />;
  }

  if (!lesson) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-red-500 text-lg">Không tìm thấy bài học</div>
          <Button type="primary" className="mt-4" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </Card>
    );
  }

  const videoType = detectVideoType(lesson.videoUrl || '');

  return (
    <>
      <div className="space-y-6">
        {/* Header với nút Quay về */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
              <div className="text-gray-500 mt-1">
                Khóa học: <span className="text-blue-600 font-medium">{lesson.course?.title}</span>
              </div>
            </div>
          </div>
          
          <Space>
            <Button 
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEdit} // Sử dụng handleEdit local
            >
              Chỉnh sửa
            </Button>
          </Space>
        </div>

        {/* Stats Row */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Lượt xem"
                value={lesson.totalViews}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Thời lượng"
                value={lesson.durationMin || 0}
                suffix="phút"
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="AI Videos"
                value={lesson.stats?.heygenVideoCount || 0}
                prefix={<VideoCameraOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Người học"
                value={lesson.stats?.progressCount || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            {/* Video Player Section - HIỂN THỊ TRỰC TIẾP */}
            {lesson.videoUrl ? (
              <Card 
                title={
                  <div className="flex items-center space-x-2">
                    <VideoCameraOutlined />
                    <span>Video bài học</span>
                  </div>
                }
                className="mb-6"
              >
                <VideoPlayer url={lesson.videoUrl} type={videoType} />
              </Card>
            ) : (
              <Card className="mb-6">
                <div className="text-center py-8">
                  <VideoCameraOutlined className="text-4xl text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Chưa có video</h3>
                  <p className="text-gray-500 mb-4">Bài học này chưa có video bài giảng</p>
                  <Button type="primary" onClick={handleEdit}>
                    Thêm video
                  </Button>
                </div>
              </Card>
            )}

            {/* Thông tin chi tiết */}
            <Card title="Thông tin chi tiết" className="mb-6">
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Tiêu đề" span={2}>
                  <span className="font-medium text-lg">{lesson.title}</span>
                </Descriptions.Item>
                
                <Descriptions.Item label="Khóa học">
                  <Tag color="blue">{lesson.course?.title}</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Thứ tự">
                  <Tag color="green">#{lesson.order}</Tag>
                </Descriptions.Item>
                
                <Descriptions.Item label="Thời lượng">
                  {lesson.durationMin ? (
                    <Tag color="orange">{lesson.durationMin} phút</Tag>
                  ) : (
                    <Tag color="default">Chưa có</Tag>
                  )}
                </Descriptions.Item>
                
                <Descriptions.Item label="Loại video">
                  {lesson.videoUrl ? (
                    <Tag 
                      color={
                        videoType === 'youtube' ? 'red' : 
                        videoType === 'supabase' ? 'green' : 'blue'
                      }
                      icon={
                        videoType === 'youtube' ? <YoutubeOutlined /> : <CloudUploadOutlined />
                      }
                    >
                      {videoType === 'youtube' ? 'YouTube Video' :
                       videoType === 'supabase' ? 'Uploaded Video' : 'External Video'}
                    </Tag>
                  ) : (
                    <Tag color="default">Không có video</Tag>
                  )}
                </Descriptions.Item>
                
                <Descriptions.Item label="Ngày tạo">
                  {new Date(lesson.createdAt).toLocaleString('vi-VN')}
                </Descriptions.Item>

                <Descriptions.Item label="Cập nhật lần cuối">
                  {new Date(lesson.updatedAt).toLocaleString('vi-VN')}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Nội dung bài học */}
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlayCircleOutlined />
                    <span>Nội dung bài học</span>
                  </div>
                </div>
              }
              className="mb-6"
            >
              {lesson.content ? (
                <>
                  {htmlPreview ? (
                    <div className="p-4 bg-gray-900 text-green-400 rounded border font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96">
                      {lesson.content}
                    </div>
                  ) : (
                    <SafeHTMLRenderer html={lesson.content} />
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <PlayCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                  <div>Chưa có nội dung bài học</div>
                  <Button type="primary" className="mt-4" onClick={handleEdit}>
                    Thêm nội dung
                  </Button>
                </div>
              )}
            </Card>

            {/* AI Videos */}
            <Card title="AI Videos" className="mb-6">
              <LessonAIVideos 
                heygenVideos={lesson.heygenVideos}
                lessonId={lesson.id}
                onVideoCreated={() => {
                  refetch();
                }}
              />
            </Card>
          </Col>

          <Col span={8}>
            {/* Thông tin khóa học */}
            <Card title="Thông tin khóa học" className="mb-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Tiêu đề:</div>
                  <div className="text-blue-600 font-medium">{lesson.course?.title}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Giảng viên:</div>
                  <div className="font-medium">{lesson.course?.instructor?.name || 'N/A'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email giảng viên:</div>
                  <div className="text-gray-600">{lesson.course?.instructor?.email || 'N/A'}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Đường dẫn:</div>
                  <div className="text-gray-600 truncate">{lesson.course?.slug || 'N/A'}</div>
                </div>
              </div>
            </Card>

            {/* Thông tin định dạng */}
            <Card title="Thông tin" className="mb-6">
              <div className="space-y-4">              
                <div>
                  <div className="text-sm text-gray-500 mb-1">Trạng thái nội dung:</div>
                  <Tag color={lesson.content ? 'success' : 'default'}>
                    {lesson.content ? 'Đã có nội dung' : 'Chưa có nội dung'}
                  </Tag>
                </div>
                
                {lesson.content && (
                  <>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Độ dài nội dung:</div>
                      <div className="font-medium">{lesson.content.length.toLocaleString()} ký tự</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Hình ảnh:</div>
                        <Tag color={lesson.content.includes('<img') ? 'blue' : 'default'}>
                          {lesson.content.includes('<img') ? 'Có' : 'Không'}
                        </Tag>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Links:</div>
                        <Tag color={lesson.content.includes('<a href') ? 'blue' : 'default'}>
                          {lesson.content.includes('<a href') ? 'Có' : 'Không'}
                        </Tag>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Video Info Card */}
            {lesson.videoUrl && (
              <Card title="Thông tin video">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Loại video:</div>
                    <div className="flex items-center space-x-2">
                      {videoType === 'youtube' ? <YoutubeOutlined className="text-red-500" /> : <CloudUploadOutlined className="text-green-500" /> }
                      <span className="font-medium">
                        {videoType === 'youtube' ? 'YouTube' :
                         videoType === 'supabase' ? 'Uploaded' : 'External'}
                      </span>
                    </div>
                  </div>
                  
                  {videoType === 'youtube' && lesson.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">YouTube ID:</div>
                      <div className="font-mono font-medium bg-gray-100 p-2 rounded">
                        {lesson.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]}
                      </div>
                    </div>
                  )}
                  
                  {videoType === 'supabase' && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="text-green-700 text-sm">
                        <CloudUploadOutlined className="mr-2" />
                        Video được lưu trữ trên Supabase Storage
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>

      {/* Update Modal - ĐƯỢC ĐƯA VÀO BÊN TRONG LessonDetail */}
      <LessonUpdateModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        lesson={lesson} // Truyền lesson data hiện tại
        refetch={handleUpdateSuccess} // Callback khi update thành công
      />
    </>
  );
};