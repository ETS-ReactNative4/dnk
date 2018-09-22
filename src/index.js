import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Header from './components/Header'
import registerServiceWorker from './registerServiceWorker';
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
	<section className="app">
		<Header/>

		<CookiesProvider>
			<App />
		</CookiesProvider>
	</section>
, document.getElementById('root'));
registerServiceWorker();
