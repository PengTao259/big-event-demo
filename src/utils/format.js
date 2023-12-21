import { dayjs } from 'element-plus'

export const forMatDate = (time) => {
  return dayjs(time).format('YYYY年MM月DD日')
}
