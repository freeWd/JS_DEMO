import Vue from 'vue';
import SkeletonA from './skeletonA.vue'
import SkeletonB from './skeletonB.vue'

export default new Vue({
    components: {
        SkeletonA,
        SkeletonB
    },
    template: `<div>
        <SkeletonA style="display:none" id="skeletonA"></SkeletonA>
        <SkeletonB style="display:none" id="skeletonB"></SkeletonB>
        </div>`
})