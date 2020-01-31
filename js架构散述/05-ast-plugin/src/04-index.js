// import flattenDeep from "lodash/flattenDeep";
// import concat from "lodash/concat";
import { flattenDeep, concat } from 'lodash'; //会将整个lodash导入 483kb

const arr = [1, 2, [3, [4, 5, [6]]]];

console.log(flattenDeep(arr));
console.log(concat(1, 2, [3], [[4]]));
