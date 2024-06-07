export default [
  {
    path: '/',
    name: "Home",
    meta: {
      title: "AI助手",
    },
    component: () => import('@/views/homePage/index.vue')
  }
]
