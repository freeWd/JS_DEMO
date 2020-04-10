<template>
    <div>
        用户列表页面
        <ul>
            <li>
              <router-link :to="{ name: 'userDetail', params: {id: '001'}, query: {name: '王小虎'}}">用户一</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'userDetail', params: {id: '002'}, query: {name: '李逍遥'}}">用户二</router-link>
            </li>
        </ul>
    </div>
</template>
