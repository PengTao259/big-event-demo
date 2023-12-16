// 导入pinia
import { createPinia } from 'pinia'
// 持久化插件
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

export * from './modules/user'
export * from './modules/count'
