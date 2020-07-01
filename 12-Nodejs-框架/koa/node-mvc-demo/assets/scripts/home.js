var app = new Vue({
    el: '#app-home',
    methods: {
        goAddPage: function() {
            console.log('xxx');
             window.location.href = "./add";
        }
    }
})