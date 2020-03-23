import _ from 'lodash';
import util3 from './util3';

console.log('util2 ---->', _.clone({name: '123'}));
util3.play();

export default {
    play() {
        console.log('play util2')
    }
}
