import ShoppingCar from './shopping-car/shopping-car.vue';
import FormValid from './form-valid/form-valid.vue'
import FormValidCustom from './form-valid-custom/FormValidCustom.vue';

export default [
    {
        path: '',
        redirect: '/shopping-car'
    }, {
        path: '/shopping-car',
        name: 'shopping-car',
        component: ShoppingCar
    }, {
        path: '/formvalid',
        name: 'form-valid',
        component: FormValid
    }, {
        path: '/formvalid-custom',
        name: 'form-valid-custom',
        component: FormValidCustom
    }
]