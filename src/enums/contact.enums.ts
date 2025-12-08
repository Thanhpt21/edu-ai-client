export enum ContactStatus {
  PENDING = "PENDING",       // Đang chờ xử lý
  PROCESSING = "PROCESSING", // Đang xử lý
  COMPLETED = "COMPLETED",   // Hoàn tất
  FAILED = "FAILED"          // Thất bại
}

export enum ContactType {
  CONTACT = "CONTACT",    // Liên hệ chung (hỏi đáp, hỗ trợ)
  PROMOTION = "PROMOTION", // Đăng ký nhận khuyến mãi/bản tin
  OTHER = "OTHER"      // Các loại khác (tùy chọn)
}

// Hàm helper để chuyển đổi enum sang tiếng Việt (nếu cần dùng nhiều nơi)
export const getContactStatusText = (status: ContactStatus): string => {
  switch (status) {
    case ContactStatus.PENDING:
      return 'Đang chờ';
    case ContactStatus.PROCESSING:
      return 'Đang xử lý';
    case ContactStatus.COMPLETED:
      return 'Hoàn thành';
    case ContactStatus.FAILED:
      return 'Thất bại';
    default:
      return status;
  }
};

export const getContactTypeText = (type: ContactType): string => {
  switch (type) {
    case ContactType.CONTACT:
      return 'Liên hệ chung';
    case ContactType.PROMOTION:
      return 'Đăng ký khuyến mãi';
    case ContactType.OTHER:
      return 'Khác';
    default:
      return type;
  }
};