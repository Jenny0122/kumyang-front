import { createRouter, createWebHistory } from 'vue-router';

// 라우트 정의
const routes = [
    { path: '/search', name: 'Search', component: () => import('../components/Search.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/search' } // 모든 URL을 /search로 리다이렉트
];

// 라우터 생성
const router = createRouter({
    history: createWebHistory(), // HTML5 History 모드 사용
    routes,
});

export default router;
