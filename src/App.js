// @flow
import React, { Component } from 'react'

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
			login: null,
			password: null
		},
		password: null,
		startDate: moment(),
		endDate: moment(),
		reportDate: moment()
	}

	componentDidMount() {
		let login = prompt('Логин Yclients')
		let password = prompt('Пароль Yclients')

		this.setState({
			authData: {
				login,
				password,
			}
		}, () => {
			console.log(this.state.auth)
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
		}).then(({ data: res }) => {
			const allMobiles = []
			const attendantMobiles = []
			const notAttendantMobiles = []

			// вообще все записи
			for (let i = 0; i < res.length; i++) {
				if (res[i].attendance !== -1) {
					allMobiles.push(res[i].client.phone)
				} else if (res[i].client.phone !== "") {
					notAttendantMobiles.push(res[i].client.phone)
				}
			}

			// все кто пришел
			for (let j = 0; j < res.length; j++) {
				if (res[j].attendance === 1 && res[j].client.phone !== "" && moment(reportDate) > moment(res[j].datetime)) {
					attendantMobiles.push(res[j].client.phone)
				}
			}

			const returnsOfAttendant = allMobiles.filter(item => attendantMobiles.includes(item))

			// все кто пришел
			// Вообще все записи
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


			const arrayOfReturnMobiles = attendantMobiles.filter(item => {
				// console.log(item, 'item', arrayOfUniqMobiles, 'arrayOfUniqMobiles', returnsOfAttendant, 'returnsOfAttendant')
				if (!arrayOfUniqMobiles.includes(item)) {
					return item
				}
			})

			const percentOfReturns = (returnMobiles / uniqAttendantMobiles.size) * 100

			this.setState({
				staffResult: {
					allMobiles, // все записи на весь срок, кроме не пришедших
					attendantMobiles, // все кто пришел до отчетного дня
					notAttendantMobiles, // все кто не пришел до отчетного дня
					returnsOfAttendant, // все кто записался до конца периода из тех кто пришел
					uniqMobiles,
					returnMobiles,
					percentOfReturns,
				},
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

	handleDatapickerReport

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
								<label className="date">
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
								</label>
							</div>

							<div className="dateField">
								<label className="date">
									<p className="dateNotes">Отчетный день:</p>
									<DatePicker
										selected={this.state.reportDate}
										startDate={this.state.reportDate}
										onChange={this.handleDatapickerReport}
									/>
								</label>
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
										<span className="name">Все записи:</span>
										<div className="value">
											<span>{staffResult.allMobiles.length}</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Клиенты, которых обслужили:</span>
										<div className="value">
											<span>{staffResult.attendantMobiles.length}</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Клиенты, которые не пришли:</span>
										<div className="value">
											<span>{staffResult.notAttendantMobiles.length}</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Повторные записи:</span>
										<div className="value">
											<span>{staffResult.returnMobiles * 2}</span>
										</div>
									</div>

									<div className="row">
										<span className="name">Процент возвращаемости:</span>
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

export default Docs
