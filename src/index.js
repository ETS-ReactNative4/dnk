import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import Cosmetology from './containers/Cosmetology'
import Manager from './containers/Manager'
import Structure from './containers/Structure'
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
					<Route exact path="/" component={Main}/>
					<Route path="/cosmetology" component={Cosmetology}/>
					<Route path="/manager" component={Manager}/>
					<Route path="/structure" component={Structure}/>
				</Switch>
			</section>
			</BrowserRouter>
		</CookiesProvider>
, document.getElementById('root'));
registerServiceWorker();
