import Home from '_views/home/Home.vue';
import Version from '_views/home/Version.vue';


export default [
    {
        path: '',
        redirect: { name: 'home' }
    }, 
    {
        path: '/home',
        // 可以加name用于标记路由
        name: 'home',
        components: {
            default: Home,
            version: Version
        }
    },
    // 后面是有懒加载 - // 默认情况下只显示首页，其他页面点击才加载
    {
        path: '/login',
        name: 'login',
        component: () => import('_views/Login.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import('_views/Profile.vue')
    },
    {
        // 此处有子路由，需要注意的点事 app.vue的router-link中的to不能用name, 而是用path
        // 父路径跳转必须使用路径跳转不能使用name, 不然不显示默认子路径
        path: '/user',
        name: 'user',
        component: () => import('_views/users/User.vue'),
        // 路由元信息的传递
        meta: {needLogin: true},
        children: [
            {
                path: '',
                redirect: { name: 'userList' }
            },
            {
                path: 'list',
                name: 'userList',
                component: () => import('_views/users/UserList.vue')
            },
            {
                path: 'add',
                name: 'userAdd',
                component: () => import('_views/users/UserAdd.vue')
            },
            // 路由参数传递
            {
                // 路径参数 必须通过id跳转
                path: 'detail/:id',
                name: 'userDetail',
                component: () => import('_views/users/UserDetail.vue')
            }
        ]
    },
    {
        path: '*',
        component: () => import('_views/404.vue')
    }
]