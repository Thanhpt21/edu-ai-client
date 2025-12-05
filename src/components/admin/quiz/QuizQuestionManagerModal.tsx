// src/components/admin/quiz/QuizQuestionManagerModal.tsx
'use client'

import { Modal, Table, Button, Space, Tooltip, Input, message, Tag, Badge, Form, Input as AntdInput, Card, Row, Col, Alert, Popconfirm } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ReloadOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  QuestionCircleOutlined,
  FileAddOutlined
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useQuizQuestionsByQuiz } from '@/hooks/quiz-question/useQuizQuestionsByQuiz'
import { useCreateQuizQuestion } from '@/hooks/quiz-question/useCreateQuizQuestion'
import { useUpdateQuizQuestion } from '@/hooks/quiz-question/useUpdateQuizQuestion'
import { useDeleteQuizQuestion } from '@/hooks/quiz-question/useDeleteQuizQuestion'
import { useBulkCreateQuizQuestions } from '@/hooks/quiz-question/useBulkCreateQuizQuestions'
import { QuizWithRelations } from '@/types/quiz.type'
import { QuizQuestion } from '@/types/quiz-question.type'

const { TextArea } = AntdInput
const { Search } = Input

interface QuizQuestionManagerModalProps {
  open: boolean
  onClose: () => void
  quiz: QuizWithRelations | null
  refetchQuizzes?: () => void
}

interface QuestionFormData {
  question: string
  options: string[]
  correct: string
}

export const QuizQuestionManagerModal = ({ 
  open, 
  onClose, 
  quiz, 
  refetchQuizzes 
}: QuizQuestionManagerModalProps) => {
  const [form] = Form.useForm<QuestionFormData>()
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [optionInputs, setOptionInputs] = useState<string[]>(['', '', '', ''])
  const [searchText, setSearchText] = useState('')
  const [selectedCorrect, setSelectedCorrect] = useState<number | null>(null)
  
  // Fetch questions
  const { 
    data: questionsData, 
    isLoading, 
    refetch 
  } = useQuizQuestionsByQuiz(quiz?.id || 0, false)
  
  // Mutations
  const createMutation = useCreateQuizQuestion()
  const updateMutation = useUpdateQuizQuestion(editingQuestion?.id || 0)
  const deleteMutation = useDeleteQuizQuestion()
  const bulkCreateMutation = useBulkCreateQuizQuestions(quiz?.id || 0)

  const questions: QuizQuestion[] = questionsData || []

  // Filter questions based on search
  const filteredQuestions = searchText 
    ? questions.filter(q => 
        q.question.toLowerCase().includes(searchText.toLowerCase()) ||
        q.correct.toLowerCase().includes(searchText.toLowerCase())
      )
    : questions

  useEffect(() => {
    if (open && quiz) {
      form.resetFields()
      setEditingQuestion(null)
      setOptionInputs(['', '', '', ''])
      setSelectedCorrect(null)
      setSearchText('')
    }
  }, [open, quiz, form])

  const handleCreateQuestion = async (values: QuestionFormData) => {
    if (!quiz) return

    try {
      // Validate options
      const options = optionInputs.filter(opt => opt.trim() !== '')
      if (options.length < 2) {
        message.error('Cần ít nhất 2 lựa chọn')
        return
      }

      if (selectedCorrect === null || !options[selectedCorrect]) {
        message.error('Vui lòng chọn đáp án đúng')
        return
      }

      await createMutation.mutateAsync({
        quizId: quiz.id,
        question: values.question,
        options: options,
        correct: options[selectedCorrect]
      })

      message.success('Thêm câu hỏi thành công')
      form.resetFields()
      setOptionInputs(['', '', '', ''])
      setSelectedCorrect(null)
      refetch()
      refetchQuizzes?.() // Refresh quiz stats
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi thêm câu hỏi')
    }
  }

  const handleUpdateQuestion = async (values: QuestionFormData) => {
    if (!quiz || !editingQuestion) return

    try {
      const options = optionInputs.filter(opt => opt.trim() !== '')
      if (options.length < 2) {
        message.error('Cần ít nhất 2 lựa chọn')
        return
      }

      if (selectedCorrect === null || !options[selectedCorrect]) {
        message.error('Vui lòng chọn đáp án đúng')
        return
      }

      await updateMutation.mutateAsync({
        question: values.question,
        options: options,
        correct: options[selectedCorrect]
      })

      message.success('Cập nhật câu hỏi thành công')
      form.resetFields()
      setEditingQuestion(null)
      setOptionInputs(['', '', '', ''])
      setSelectedCorrect(null)
      refetch()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi cập nhật câu hỏi')
    }
  }

  const handleDeleteQuestion = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      message.success('Xóa câu hỏi thành công')
      refetch()
      refetchQuizzes?.() // Refresh quiz stats
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Lỗi xóa câu hỏi')
    }
  }

  const handleEditQuestion = (question: QuizQuestion) => {
    setEditingQuestion(question)
    form.setFieldsValue({
      question: question.question,
    })
    
    // Set options
    const options = [...question.options]
    const optionInputs = [...options, '', '', ''].slice(0, 6) // Max 6 options
    setOptionInputs(optionInputs)
    
    // Set correct answer
    const correctIndex = options.indexOf(question.correct)
    setSelectedCorrect(correctIndex >= 0 ? correctIndex : null)
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
    form.resetFields()
    setOptionInputs(['', '', '', ''])
    setSelectedCorrect(null)
  }

  const handleAddOption = () => {
    if (optionInputs.length < 6) {
      setOptionInputs([...optionInputs, ''])
    }
  }

  const handleRemoveOption = (index: number) => {
    if (optionInputs.length > 2) {
      const newOptions = [...optionInputs]
      newOptions.splice(index, 1)
      setOptionInputs(newOptions)
      
      // Adjust selected correct index
      if (selectedCorrect !== null) {
        if (selectedCorrect === index) {
          setSelectedCorrect(null)
        } else if (selectedCorrect > index) {
          setSelectedCorrect(selectedCorrect - 1)
        }
      }
    } else {
      message.warning('Cần ít nhất 2 lựa chọn')
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...optionInputs]
    newOptions[index] = value
    setOptionInputs(newOptions)
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      render: (question: string) => (
        <div className="font-medium">{question}</div>
      ),
    },
    {
      title: 'Số lựa chọn',
      key: 'options',
      width: 100,
      align: 'center' as const,
      render: (record: QuizQuestion) => (
        <Badge count={record.options.length} style={{ backgroundColor: '#1890ff' }} />
      ),
    },
    {
      title: 'Đáp án đúng',
      dataIndex: 'correct',
      key: 'correct',
      width: 150,
      render: (correct: string, record: QuizQuestion) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          {correct}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: QuizQuestion) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="link" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditQuestion(record)}
            />
          </Tooltip>
          
          <Popconfirm
            title={
                <div>
                <div className="font-medium">Xóa câu hỏi</div>
                <div className="text-gray-600 mt-1">Bạn có chắc chắn muốn xóa câu hỏi này?</div>
                </div>
            }
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            >
            <Tooltip title="Xóa">
                <Button 
                type="link" 
                danger
                size="small"
                icon={<DeleteOutlined />}
                />
            </Tooltip>
            </Popconfirm>
        </Space>
      ),
    },
  ]

  if (!quiz) return null

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QuestionCircleOutlined />
            <span>Quản lý câu hỏi: {quiz.title}</span>
          </div>
        
        </div>
      }
      open={open}
      onCancel={onClose}
      width={1200}
      style={{ top: 20 }}
      footer={null}
      maskClosable={false}
      destroyOnClose
    >
      <div className="mt-4">
      

        <Row gutter={[16, 16]}>
          {/* Form thêm/chỉnh sửa câu hỏi */}
          <Col span={12}>
            <Card 
              title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"} 
              size="small"
              extra={
                editingQuestion && (
                  <Button 
                    type="text" 
                    icon={<CloseOutlined />}
                    onClick={handleCancelEdit}
                    size="small"
                  >
                    Hủy
                  </Button>
                )
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
              >
                <Form.Item
                  label="Câu hỏi"
                  name="question"
                  rules={[
                    { required: true, message: 'Vui lòng nhập câu hỏi' },
                    { min: 5, message: 'Câu hỏi ít nhất 5 ký tự' }
                  ]}
                >
                  <TextArea 
                    rows={3}
                    placeholder="Nhập nội dung câu hỏi..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>

                <Form.Item label="Các lựa chọn">
                  <div className="space-y-2">
                    {optionInputs.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Button
                            type={selectedCorrect === index ? "primary" : "default"}
                            shape="circle"
                            size="small"
                            onClick={() => setSelectedCorrect(index)}
                            className={selectedCorrect === index ? '!bg-green-600' : ''}
                          >
                            {String.fromCharCode(65 + index)}
                          </Button>
                          <span className="ml-2 w-6 text-center">
                            {selectedCorrect === index && (
                              <CheckCircleOutlined className="text-green-600" />
                            )}
                          </span>
                        </div>
                        
                        <AntdInput
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}...`}
                          className="flex-1"
                        />
                        
                        {optionInputs.length > 2 && (
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveOption(index)}
                          />
                        )}
                      </div>
                    ))}
                    
                    {optionInputs.length < 6 && (
                      <Button 
                        type="dashed" 
                        onClick={handleAddOption}
                        icon={<PlusOutlined />}
                        block
                      >
                        Thêm lựa chọn
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-500">
                    {selectedCorrect !== null ? (
                      <span className="text-green-600">
                        Đáp án đúng: {String.fromCharCode(65 + selectedCorrect)}. {optionInputs[selectedCorrect]}
                      </span>
                    ) : (
                      <span className="text-red-500">Chưa chọn đáp án đúng</span>
                    )}
                  </div>
                </Form.Item>

                <Form.Item className="mt-4">
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    icon={editingQuestion ? <SaveOutlined /> : <PlusOutlined />}
                    block
                    size="large"
                  >
                    {editingQuestion ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>

          </Col>

          {/* Danh sách câu hỏi */}
          <Col span={12}>
            <Card 
              title="Danh sách câu hỏi" 
              size="small"
              extra={
                <Search
                  placeholder="Tìm câu hỏi..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-48"
                />
              }
            >
              <Table
                columns={columns}
                dataSource={filteredQuestions}
                rowKey="id"
                loading={isLoading}
                pagination={{
                  pageSize: 8,
                  showSizeChanger: false,
                  showTotal: (total) => `${total} câu hỏi`,
                }}
                scroll={{ y: 400 }}
                size="small"
              />
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">
                      Tổng cộng: {questions.length} câu hỏi
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Button 
                      type="primary" 
                      onClick={onClose}
                      icon={<CheckCircleOutlined />}
                    >
                      Hoàn thành
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>
  )
}