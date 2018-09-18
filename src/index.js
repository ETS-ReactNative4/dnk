import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './components/Header'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<section className="app">
		<Header/>

		<App />
	</section>
, document.getElementById('root'));
registerServiceWorker();
