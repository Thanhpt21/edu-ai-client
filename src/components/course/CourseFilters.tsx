// src/components/course/CourseFilters.tsx
import { 
  Card, 
  Button, 
  Select, 
  Divider,
  Tag,
  Space,
  Collapse
} from 'antd'
import { 
  FilterOutlined,
  ReloadOutlined,
  DollarOutlined,
  SortAscendingOutlined
} from '@ant-design/icons'
import { CourseLevelString, SortByField, SortOrder } from '@/types/course.type'

const { Option } = Select
const { Panel } = Collapse

interface CourseFiltersProps {
  levelFilter: CourseLevelString | ''
  setLevelFilter: (value: CourseLevelString | '') => void
  priceFilter: string
  setPriceFilter: (value: string) => void
  sortBy: SortByField
  sortOrder: SortOrder
  setSortBy: (value: SortByField) => void
  setSortOrder: (value: SortOrder) => void
  onReset: () => void
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  levelFilter,
  setLevelFilter,
  priceFilter,
  setPriceFilter,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  onReset
}) => {
  const levelOptions: { value: CourseLevelString; label: string; color: string }[] = [
    { value: 'BEGINNER', label: 'Cơ bản', color: 'green' },
    { value: 'INTERMEDIATE', label: 'Trung cấp', color: 'blue' },
    { value: 'ADVANCED', label: 'Nâng cao', color: 'red' },
  ]

  const priceOptions = [
    { value: 'free', label: 'Miễn phí' },
    { value: '0-50000', label: 'Dưới 50k' },
    { value: '50000-200000', label: '50k - 200k' },
    { value: '200000-500000', label: '200k - 500k' },
    { value: '500000-', label: 'Trên 500k' },
  ]

  const sortOptions = [
    { value: 'createdAt_desc', label: 'Mới nhất' },
    { value: 'createdAt_asc', label: 'Cũ nhất' },
    { value: 'price_asc', label: 'Giá thấp' },
    { value: 'price_desc', label: 'Giá cao' },
    { value: 'totalViews_desc', label: 'Xem nhiều' },
  ]

  const getLevelColor = (level: CourseLevelString) => {
    switch (level) {
      case 'BEGINNER': return 'green'
      case 'INTERMEDIATE': return 'blue'
      case 'ADVANCED': return 'red'
      default: return 'default'
    }
  }

  const getLevelLabel = (level: CourseLevelString) => {
    switch (level) {
      case 'BEGINNER': return 'Cơ bản'
      case 'INTERMEDIATE': return 'Trung cấp'
      case 'ADVANCED': return 'Nâng cao'
      default: return level
    }
  }

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <FilterOutlined />
          <span>Bộ lọc</span>
        </div>
      }
      extra={
        <Button 
          type="text" 
          icon={<ReloadOutlined />} 
          onClick={onReset}
          size="small"
        >
          Đặt lại
        </Button>
      }
      className="sticky top-4"
    >
      <Collapse defaultActiveKey={['1', '2', '3']} ghost>
        <Panel header="Sắp xếp" key="1" extra={<SortAscendingOutlined />}>
          <Select
            value={`${sortBy}_${sortOrder}`}
            onChange={(value) => {
              const [sort, order] = value.split('_')
              setSortBy(sort as SortByField)
              setSortOrder(order as SortOrder)
            }}
            className="w-full"
          >
            {sortOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Panel>

        <Panel header="Cấp độ" key="2">
          <Space direction="vertical" className="w-full">
            {levelOptions.map((option) => (
              <Button
                key={option.value}
                type={levelFilter === option.value ? 'primary' : 'default'}
                className={`w-full text-left ${
                  levelFilter === option.value ? 
                  `!bg-${option.color}-100 !text-${option.color}-600 !border-${option.color}-300` : 
                  ''
                }`}
                onClick={() => setLevelFilter(levelFilter === option.value ? '' : option.value)}
              >
                {option.label}
                {levelFilter === option.value && (
                  <Tag color={option.color} className="ml-2">
                    ✓
                  </Tag>
                )}
              </Button>
            ))}
          </Space>
        </Panel>

        <Panel header="Giá" key="3" extra={<DollarOutlined />}>
          <Space direction="vertical" className="w-full">
            {priceOptions.map((option) => (
              <Button
                key={option.value}
                type={priceFilter === option.value ? 'primary' : 'default'}
                className="w-full text-left"
                onClick={() => setPriceFilter(priceFilter === option.value ? '' : option.value)}
              >
                {option.label}
                {priceFilter === option.value && (
                  <Tag color="blue" className="ml-2">
                    ✓
                  </Tag>
                )}
              </Button>
            ))}
          </Space>
        </Panel>
      </Collapse>

      <Divider />

      <div className="text-sm text-gray-500">
        <div className="font-medium mb-1">Đang chọn:</div>
        <div className="space-y-1">
          {levelFilter && (
            <div className="flex justify-between">
              <span>Cấp độ:</span>
              <Tag color={getLevelColor(levelFilter)}>
                {getLevelLabel(levelFilter)}
              </Tag>
            </div>
          )}
          {priceFilter && (
            <div className="flex justify-between">
              <span>Giá:</span>
              <Tag color="blue">
                {priceOptions.find(p => p.value === priceFilter)?.label}
              </Tag>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default CourseFilters