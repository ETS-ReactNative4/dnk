// @flow
import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';

import Button from './components/Button'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './App.css'

require('moment/locale/ru');
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

const companyID = 114454
const partnerID = 'hu2x584xzw7y7fy34bg5'
const userID = '7a140112eded9ee20ba43f03406138cf'

class Docs extends Component {
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

	handleStaffSubmit = (e) => {
		const { choosenStaffID, startDate, endDate, reportDate } = this.state
		const requestStartDate = moment(startDate).format("YYYY-MM-DD")
		const requestEndDate = moment(endDate).format("YYYY-MM-DD")


		e.preventDefault()

		request({
			url: `https://api.yclients.com/api/v1/records/${companyID}&staff_id=${choosenStaffID}&start_date=${requestStartDate}&end_date=${requestEndDate}&count=100000`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${partnerID}, User ${userID}`,
			},
			data: this.state.authData,
		}).then(({ data: staffsClients }) => {
			const allRecords = []
			const allMobiles = []
			const attendantMobiles = []
			const canceledMobiles = []
			const notAttendantMobiles = []
			const aimedClients = []
			const attendant = []


			// &staff_id=${choosenStaffID}
			// Получаем вообще все записи = staffsClients
			// Фильтруем на записи staffID
			// Мапим записи StaffID
			// Берем номер телефона и ищем повтор во всем списке (также фильтр по дате и то, что другой staffID)
			//

			// вообще все записи сотрудника
			for (let i = 0; i < staffsClients.length; i++) {
				if (staffsClients[i].attendance !== -1) {
					allMobiles.push(staffsClients[i].client.phone)
				} else if (staffsClients[i].client.phone !== "") {
					notAttendantMobiles.push(staffsClients[i].client.phone)
				}

				allRecords.push(staffsClients[i].client.phone)
			}

			// все кто пришел сотрудника
			for (let j = 0; j < staffsClients.length; j++) {
				if (staffsClients[j].attendance === 1 && staffsClients[j].client.phone !== "" && moment(reportDate) > moment(staffsClients[j].datetime)) {
					attendant.push(staffsClients[j])
					attendantMobiles.push(staffsClients[j].client.phone)
				}

				if (staffsClients[j].attendance === -1 && staffsClients[j].client.phone !== "" && moment(reportDate) > moment(staffsClients[j].datetime)) {
					canceledMobiles.push(staffsClients[j].client.phone)
				}
			}

			console.dir(staffsClients, 'staffsClients');


			const delayedRequest = () => (
				request({
					url: `https://api.yclients.com/api/v1/records/${companyID}&start_date=${requestStartDate}&end_date=${requestEndDate}&count=100000`,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${partnerID}, User ${userID}`,
					},
					data: this.state.authData,
				})
			)

			async function processArray(array) {
				await delayedRequest().then(( { data: allClients }) => {
					console.log(allClients, 'allClients')
					console.log(staffsClients, 'staffsClients')
					console.log(attendant, 'attendant')

					allClients.map(client => {
						console.log(client.attendance !== -1, client.staff_id !== choosenStaffID, 'b', client.staff_id, choosenStaffID)
						if (client.attendance !== -1 && client.staff_id !== choosenStaffID && attendantMobiles.includes(client.client.phone)) {
							aimedClients.push(client)
						}
					})
				})

				// for (const record of array) {
				// 	await delayedRequest(record.client)
				// }

				attendant.filter(attendantClient => {
					return aimedClients.filter(aimedClient => {
						if (attendantClient.client.phone === aimedClient.client.phone && moment(attendantClient.datetime) < moment(aimedClient.datetime)) {
							return true
						}
					})
				})

				return true
			}

			let complete = false
			processArray(staffsClients).then(() => {
				const returnsOfAttendant = allMobiles.filter(item => attendantMobiles.includes(item))

				// все кто пришел сотрудника
				// Вообще все записи сотрудника
				// Из всех записей, мы берем только тех, кто приходил
				// Получаем список

				const uniqMobiles = new Set(returnsOfAttendant)
				const returnMobiles = attendantMobiles.length - uniqMobiles.size
				const uniqAttendantMobiles = new Set(attendantMobiles)

				console.log(allMobiles, 'ВСЕ ЗАПИСИ')
				console.log(attendantMobiles, 'все кто пришел до сегодня') // нужно сделать до отчетного дня
				console.log(uniqAttendantMobiles, 'все кто пришел до сегодня без дублей') // здесь нужно убрать те, что есть в
				console.log(returnsOfAttendant, 'все кто пришел и их них записан до конца периода')
				const arrayOfUniqMobiles = Array.from(uniqMobiles)
				console.log(arrayOfUniqMobiles, 'все кто пришел и записан без дублей')
				console.log(returnMobiles, 'все кто пришел и их них записан до конца периода —  все кто пришел и записан без дублей')
				console.log(aimedClients, 'клиенты, которые были направлены на коллег')


				const arrayOfReturnMobiles = attendantMobiles.filter(item => {
					// console.log(item, 'item', arrayOfUniqMobiles, 'arrayOfUniqMobiles', returnsOfAttendant, 'returnsOfAttendant')
					if (!arrayOfUniqMobiles.includes(item)) {
						return item
					}
				})

				const percentOfReturns = (returnMobiles / uniqAttendantMobiles.size) * 100


				const futureMobiles = allMobiles.length - attendantMobiles.length

				this.setState({
					staffResult: {
						allRecords, // вообще все записи
						allMobiles, // все записи на весь срок, кроме не пришедших
						futureMobiles, // записи на будущие даты
						canceledMobiles, // отказники
						attendantMobiles, // все кто пришел до отчетного дня
						notAttendantMobiles, // все кто не пришел до отчетного дня
						returnsOfAttendant, // все кто записался до конца периода из тех кто пришел
						aimedClients, // направленные на других
						uniqMobiles,
						returnMobiles,
						percentOfReturns,
					},
				})
			})
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


	render() {
		const { staffs, staffResult } = this.state

		if (this.state.authData.password) {
			return (
				<article className="docs">
					<h1 className="heading">
						Отчёт по возвращаемости клиентов
					</h1>
					{staffs && <div className="block">
						<form onSubmit={this.handleStaffSubmit}>
							<label className="label">Выберите сотрудника:</label>

							<select onChange={this.handleStaffChange} className="select">
								{staffs.map((staff, id) => (
									<option value={staff.id}>{staff.name}</option>
								))}
							</select>

							<div className="dateField">
								<div className="date">
									<p className="dateNotes">Период:</p>
									<DatePicker
										selected={this.state.startDate}
										selectsStart
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										onChange={this.handleDatapickerStart}
									/>
									<p className="divider">—</p>
									<DatePicker
										selected={this.state.endDate}
										selectsEnd
										startDate={this.state.startDate}
										endDate={this.state.endDate}
										onChange={this.handleDatapickerEnd}
									/>
								</div>
							</div>

							<div className="dateField">
								<div className="date">
									<p className="dateNotes">Отчетный день:</p>
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

									<img className="avatar" src={this.getStaff().avatar_big} alt={this.getStaff()}/>
									<p className="staffName">{this.getStaff().name}</p>
									<div className="period">{moment(this.state.startDate).format("DD MMMM")} — {moment(this.state.endDate).format("DD MMMM")}</div>


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
										<span className="name">Записи на будущие даты:</span>
										<div className="value">
											<span>{staffResult.futureMobiles}</span>
										</div>
										<div className="value">
											<span>{(staffResult.futureMobiles / staffResult.attendantMobiles.length * 100).toFixed(0)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Клиенты, которых обслужили:</span>
										<div className="value">
											<span>{staffResult.attendantMobiles.length}</span>
										</div>

										<div className="value">
											<span>100%</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Клиенты, которые отменились:</span>
										<div className="value">
											<span>{staffResult.canceledMobiles.length}</span>
										</div>

										<div className="value">
											<span>{(staffResult.canceledMobiles.length / staffResult.allRecords.length * 100).toFixed(0)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Клиенты, которых направили к коллегам:</span>
										<div className="value">
											<span>{staffResult.aimedClients.length}</span>
										</div>

										<div className="value">
											<span>{(staffResult.aimedClients.length / staffResult.attendantMobiles.length * 100).toFixed(0)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Повторные записи (Возвращаемость):</span>
										<div className="value">
											<span>{staffResult.returnMobiles * 2}</span>
										</div>
										<div className="value">
											<span>{((staffResult.returnMobiles * 2 / staffResult.attendantMobiles.length) * 100).toFixed(1)}%</span>
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

export default withCookies(Docs)
