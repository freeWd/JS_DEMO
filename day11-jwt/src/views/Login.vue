<template>
  <div class="login">
    <h1>This is an login page</h1>
     <Input v-model="username" placeholder="Enter username..." style="width: 300px" />
    <Button type="primary" @click="login(username)">Login</Button>
  </div>
</template>


<script>
import { getUser } from '../api/user';
import { mapActions } from 'vuex';

export default {
  async mounted() {
  //  let resp = await getUser();
  //  console.log(resp);
  },
  data() {
    return {
      username: ''
    }
  },
  methods: {
    ...mapActions(['toLogin']),
    login(username) {
      this['toLogin'](username).then((msg) => {
        console.log(msg, '<----msg');
      }).catch((msg) => {
        console.log(msg, '<----msg1');
      })
    }
  }
}
</script>
