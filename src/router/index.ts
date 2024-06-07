import { createRouter,createWebHistory, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import routes from './routes'

const router = createRouter({
  // history: createWebHistory(),  //histroy不刷新，需要一个timestamp
  history: createWebHashHistory(),
  routes
})
router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})
export default router
