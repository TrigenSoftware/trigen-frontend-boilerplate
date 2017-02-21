import 'babel-polyfill';
import { increase } from './clicker/clicker';

document.querySelector('header').addEventListener('click', () => {
	document.querySelector('header h1').innerText = increase();
});
