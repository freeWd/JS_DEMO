import createApp from './app';

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})


// let { app } = createApp();
// app.$mount('#app');