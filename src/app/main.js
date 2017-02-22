import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Clicker from './clicker/clicker';

ReactDOM.render(
	<Clicker/>,
	document.querySelector('#view')
);
