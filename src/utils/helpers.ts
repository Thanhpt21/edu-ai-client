import dayjs from 'dayjs';

export function formatVND(amount: number | string): string {
  if (typeof amount === 'string') {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return 'Giá trị không hợp lệ';
    }
    amount = parsedAmount;
  }
  if (typeof amount !== 'number') {
    return 'Giá trị không hợp lệ';
  }
  return (amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', ' đ');
}

export const formatDate = (date: string | Date | dayjs.Dayjs | null | undefined): string => {
  if (!date) {
    return '-'; // Hoặc một giá trị mặc định khác tùy bạn
  }
  return dayjs(date).format('DD/MM/YYYY HH:mm:ss');
};


export const formatDuration = (minutes: number) => {
  if (!minutes) return '--:--'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}