// @flow
import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';

import Button from './../../components/Button'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import marina from './images/Marina.jpeg'
import laura from './images/Laura.jpeg'
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Manager.css'

require('moment/locale/ru');
moment.locale('ru');

const managersAvatar = {
	3700335 : marina,
	3972087 : laura,
}

// https://fgpstepanov.amocrm.ru/private/api/auth.php
// USER_LOGIN fgp.stepanov@yandex.ru
// USER_HASH b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2



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

const companyID = 114454
const partnerID = 'hu2x584xzw7y7fy34bg5'
const userID = '7a140112eded9ee20ba43f03406138cf'

class Manager extends Component {
	state = {
		staffs: [],
		choosenManagerID: 3700335,
		staffResult: null,
		authData: {
			login: this.props.cookies.get('login') || null,
			password: this.props.cookies.get('password') || null
		},
		password: null,
		reportDate: moment(),
		complete: false,
	}

	componentDidMount() {
		let login;
		let password;

		if (!this.state.authData.login || !this.state.authData.password) {
			 login = prompt('Логин Yclients')
			 password = prompt('Пароль Yclients')
		} else {
			login = this.state.authData.login;
			password = this.state.authData.password;
		}

		this.props.cookies.set('login', login);
		this.props.cookies.set('password', password);

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
				request({
					url: `https://api.yclients.com/api/v1/company_users/${companyID}`,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${partnerID}, User ${userID}`,
					},
					data: this.state.authData,
				}).then((allStaffs) => {
					const staffs = allStaffs.filter(staff => {
						return staff.id === 3700335 || staff.id === 3972087
					})

					this.setState({ staffs })


					this.authAMO();
				})
			})
		})
	}

	authAMO() {
		// https://fgpstepanov.amocrm.ru/private/api/auth.php
		// USER_LOGIN fgp.stepanov@yandex.ru
		// USER_HASH b59844aaa7ed1e42c43b5ff1e2a8747ee827a8c2
		// id 2502274 Елена


		// GET https://fgpstepanov.amocrm.ru/api/v2/leads?responsible_user_id=2502274 — все сделки

		// id цифровой воронке
		// 20184184 — надо позвонить
		// 20972836 — надо ответить
		// 22210315 — целевые входящие
		// 22210318 — нецелевые входящие

		// https://fgpstepanov.amocrm.ru/api/v2/leads?responsible_user_id=2502274&status[0]=20972836&status[1]=22210315&status[2]=20184184&status[3]=22210318
		// делаем фильтр сделок по ключу 'created_at'
		// считаем count
		request({
			url: 'http://localhost:3001',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT',
			},
		}).then((res) => {
			const leads = res.response.leads
			// console.log(leads, 'amooo')
			const amoRecords = leads.filter((lead) => {
				const m = lead.date_create
				const n = moment(m)
				debugger;
				console.log(lead.status_id)
				if (lead.status_id === '20972836' || lead.status_id === '22210315' || lead.status_id === '20184184' || lead.status_id === '22210318') {
					console.log("HE[]")
					return true
				}

				return false
			})

			console.log(amoRecords, 'amoRecords')
		}).catch(err => console.log(err))
	}

	handleStaffChange = ({ target }) => {
		console.log(target, +target.value, 'target')
		this.setState({
			choosenManagerID: +target.value,
			staffResult: null,
		})
	}

	handleStaffSubmit = (e) => {
		const { choosenManagerID, startDate, endDate, reportDate } = this.state

		e.preventDefault()
		console.log(reportDate, 'reportDate')
		request({
			url: `https://api.yclients.com/api/v1/records/${companyID}?created_user_id=${choosenManagerID}&c_start_date=${moment(reportDate).format('YYYY-MM-DD')}&c_end_date=${moment(reportDate).format('YYYY-MM-DD')}&count=100000`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${partnerID}, User ${userID}`,
			},
			data: this.state.authData,
		}).then(({ data: staffsClients }) => {

			console.log(staffsClients, 'staffsClients')
			let allRecordsByManager = staffsClients


			this.setState({
				staffResult: {
					allRecordsByManager,
				},
			})
		})
	}

	getStaff() {
		const { staffs, choosenManagerID } = this.state
		for (let i = 0; i < staffs.length; i++) {
			if (choosenManagerID === staffs[i].id) {
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


	render() {
		const { staffs, staffResult } = this.state

		if (this.state.authData.password) {
			return (
				<article className="docs">
					<h1 className="heading">
						Отчёт Отдела Продаж
					</h1>
					{staffs && <div className="block">
						<form onSubmit={this.handleStaffSubmit}>
							<label className="label">Выберите сотрудника:</label>

							<select onChange={this.handleStaffChange} className="select">
								{staffs.map((staff, id) => (
									<option value={staff.id}>{staff.firstname}</option>
								))}
							</select>

							<div className="dateField">
								<div className="date">
									<p className="dateNotes">Выберите день:</p>
									<DatePicker
										selected={this.state.reportDate}
										startDate={this.state.reportDate}
										onChange={this.handleDatapickerReport}
									/>
								</div>
							</div>

							<Button type="submit" className="staffButton">Подтвердить выбор</Button>
						</form>
					</div>
					}

					{staffResult &&
						<div className="block">
							<div className="service">
								<div className="service">
									<h2 className="heading">Результат</h2>

									<img className="avatar" src={managersAvatar[this.getStaff().id]} alt={this.getStaff()}/>
									<p className="staffName">{this.getStaff().name}</p>
									<div className="period">Дата: {moment(this.state.reportDate).format("DD MMMM")}</div>


									<div className="row">
										<span className="name">Показатель</span>
										<div className="value">
											<span>Кол-во записей</span>
										</div>
										<div className="value">
											<span>Процент</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Все записи:</span>
										<div className="value">
											<span>{staffResult.allRecordsByManager.length}</span>
										</div>
										<div className="value">
											<span>{(staffResult.allRecordsByManager.length * 100).toFixed(0)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Клиенты, которых обслужили:</span>
										<div className="value">
											<span>{staffResult.allRecordsByManager.length}</span>
										</div>

										<div className="value">
											<span>100%</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					}
				</article>
			)
		}

		return (
			<article className="docs">
				<h1 className="heading">
					Пожалуйста подождите
				</h1>
			</article>
		)
	}
}

// {note && <Note {...note}/>}

export default withCookies(Manager)
