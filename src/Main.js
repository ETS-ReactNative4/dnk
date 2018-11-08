// @flow
import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';

import Link from './components/Link'
import Tariff from './components/Tariff'
import Button from './components/Button'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import classnames from 'classnames/bind'

import 'react-datepicker/dist/react-datepicker.css';
import styles from './Main.css'

require('moment/locale/ru');

const cx = classnames.bind(styles)
moment.locale('ru');



const request = async ({url, method = 'GET', data, headers = {}} /* : RequestType */) /* : Promise<Object> */ => {
	try {
		const response = await fetch(url, {
			method,
			headers,
			body: method === 'POST' && JSON.stringify(data) || undefined,
		})

		if (response.status >= 300 || response.status < 200) {
			const error = await response.json()

			throw new Error(error)
		}

		const json = await response.json()

		return json
	} catch (err) {
		throw new Error(err)
	}
}

window.companyID = 114454
const companyID = window.companyID || 114454
const partnerID = 'hu2x584xzw7y7fy34bg5'
const userID = '7a140112eded9ee20ba43f03406138cf'


let login = null;
let password = null;
class Main extends Component {
	state = {
		staffs: [],
		choosenStaffID: 264106,
		staffResult: null,
		authData: {
			login: this.props.cookies.get('login') || null,
			password: this.props.cookies.get('password') || null
		},
		password: null,
		startDate: moment(),
		endDate: moment(),
		reportDate: moment(),
		complete: false,
		isLoading: false,
		authCompleted: false,
	}

	getDataFromYclients = (login, password) => {
		this.setState({
			authData: {
				login,
				password,
			}
		}, () => {
			request({
				url: 'https://api.yclients.com/api/v1/auth',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'hu2x584xzw7y7fy34bg5',
				},
				data: this.state.authData,
			}).then(() => {
				this.setState({ authCompleted: true })
				request({
					url: `https://api.yclients.com/api/v1/staff/${companyID}`,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': partnerID,
					},
					data: this.state.authData,
				}).then((staffs) => {
					this.setState({ staffs })
				})
			})
		})
	}

	handleStaffChange = ({ target }) => {
		this.setState({
			choosenStaffID: +target.value,
			staffResult: null,
		})
	}

	getStaff() {
		const { staffs, choosenStaffID } = this.state

		for (let i = 0; i < staffs.length; i++) {
			if (choosenStaffID === staffs[i].id) {
				return staffs[i]
			}
		}
	}

	handleDatapickerStart = (date) => {
		this.setState({
			startDate: date
		})
	}

	handleDatapickerEnd = (date) => {
		this.setState({
			endDate: date
		})
	}

	handleDatapickerReport = (date) => {
		this.setState({
			reportDate: date
		})
	}

	handleLoginChange = (e) => {
		login = e.target.value
	}

	handlePasswordChange = (e) => {
		password = e.target.value
	}

	handleAuthSubmit = (e) => {
		e.preventDefault();
		console.log(this.state.authData)
		if (login && password) {
			this.props.cookies.set('login', login);
			this.props.cookies.set('password', password);
			this.getDataFromYclients(login, password);
		}
	}


	render() {
		const { staffs, staffResult } = this.state

		return (
			<article className="main">
				<div className={cx('main_auth', {
					'visible': !this.state.authCompleted && !(this.state.authData.login && this.state.authData.password)
					})}>
					<form className="main_authForm" onSubmit={this.handleAuthSubmit}>
						<label className="auth_label">
							<p className="auth_text">Введите логин YClients:</p>
							<input className="auth_name" type="name" onChange={this.handleLoginChange}/>
						</label>

						<label className="auth_label">
							<p className="auth_text">Введите пароль YClients:</p>
							<input className="auth_name" type="password" onChange={this.handlePasswordChange}/>
						</label>

						<Button type="submit" className="auth_button">Подтвердить выбор</Button>
					</form>
				</div>

				<Link className="main_link" to='/cosmetology'>
					<h1 className="main_heading">Отчет по возвращаемости</h1>
				</Link>
			</article>
		)
	}
}

// {note && <Note {...note}/>}

export default withCookies(Main)
