<template>
    <div>
        用户列表页面
        <router-link :to="{ name: 'userDetail', params: {id: '001'}, query: {name: '王小虎'}}">用户一</router-link>
    </div>
</template>
