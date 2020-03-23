import _ from 'lodash';
import util2 from './util2';
import util3 from './util3';

console.log('util1 --->', _.add(1, 111));
util2.play();
util3.play();

export default {
    play() {
        console.log('play util1')
    }
}