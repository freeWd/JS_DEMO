import React from 'react';
import ReactDom from 'react-dom';
import Counter from './component/Counter';
import Todos from './component/Todos';


ReactDom.render(<div>
    <Counter/>
    <hr/>
    <Todos/>
</div>, document.getElementById('root'));