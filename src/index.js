import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Manager from './containers/Manager'
import Header from './components/Header'
import registerServiceWorker from './registerServiceWorker';
import { CookiesProvider } from 'react-cookie';
import { Router, IndexRoute } from 'react-router'
import { BrowserRouter, Route, Switch } from 'react-router-dom';


ReactDOM.render(
	<CookiesProvider>
		<BrowserRouter>
			<section className="app">
				<Header/>
				<Switch>
					<Route exact path="/" component={App}/>
					<Route path="/manager" component={Manager}/>
				</Switch>
			</section>
			</BrowserRouter>
		</CookiesProvider>
, document.getElementById('root'));
registerServiceWorker();
