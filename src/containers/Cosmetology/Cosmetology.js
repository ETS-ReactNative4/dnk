// @flow
import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';

import Tariff from './../../components/Tariff'
import Button from './../../components/Button'
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

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

const partnerID = 'hu2x584xzw7y7fy34bg5'
const userID = '7a140112eded9ee20ba43f03406138cf'

class Cosmetology extends Component {
	state = {
		staffs: [],
		choosenCompanyID: null,
		choosenStaffID: null,
		staffResult: null,
		authData: {
			login: this.props.cookies.get('login') || null,
			password: this.props.cookies.get('password') || null
		},
		profit: {
			services: null,
			goods: null,
		},
		yclientsData: [],
		password: null,
		startDate: moment(),
		endDate: moment(),
		reportDate: moment(),
		complete: false,
		isLoading: false,
	}

	componentWillMount() {
		const userLogin = this.props.cookies.get('login').toLowerCase()
		let companyID = null
		let staffID = null

		if (userLogin === 'arslanbek.khasiev@mail.ru' || userLogin === 'usol-irina@yandex.ru') {
			companyID = 114454
			staffID = 264106
		}  else if (userLogin === '79100155524') {
			companyID = 169519
			staffID = 453426
		}

		this.setState({
			choosenCompanyID: companyID,
			choosenStaffID: staffID,
		})
	}

	componentDidMount() {
		this.authYclients();
	}

	authYclients = () => {
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
				url: `https://api.yclients.com/api/v1/staff/${this.state.choosenCompanyID}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': partnerID,
				},
				data: this.state.authData,
			}).then((staffs) => {
				// закрыть доступ к данным Юлии Романовной
				const userLogin = this.props.cookies.get('login').toLowerCase()
				if (userLogin !== 'arslanbek.khasiev@mail.ru') {
					staffs = staffs.filter((staff) => staff.id !== 281693)
				}

				this.setState({ staffs })
			})
		})
	}

	handleStaffChange = (e) => {
		this.setState({
			profit: {
				services: null,
				goods: null,
			},
			yclientsData: [],
			choosenStaffID: +e.target.value,
			staffResult: null,
		})
	}

	getProfitData = () => {
		const { choosenStaffID, startDate, endDate, reportDate } = this.state
		const requestStartDate = moment(startDate).format("YYYY-MM-DD")
		const reportDateFormatted = moment(reportDate).format("YYYY-MM-DD")

		request({
			url: `https://api.yclients.com/api/v1/reports/z_report/${this.state.choosenCompanyID}?start_date=${requestStartDate}&end_date=${reportDateFormatted}&master_id=${choosenStaffID}`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${partnerID}, User ${userID}`,
			},
		}).then(({ data }) => {
			// console.log(data.stats, 'profit')

			this.setState({
				profit: {
					services: data.stats.targets_paid,
					goods: data.stats.goods_paid,
				}
			})
		})
	}

	handleStaffSubmit = (e, page = 1) => {
		this.getProfitData();

		const { choosenStaffID, choosenCompanyID, startDate, endDate, reportDate } = this.state
		const requestStartDate = moment(startDate).format("YYYY-MM-DD")
		const requestEndDate = moment(endDate).format("YYYY-MM-DD")

		e.preventDefault()

		this.setState({isLoading: true})

		request({
			url: `https://api.yclients.com/api/v1/records/${choosenCompanyID}&staff_id=${choosenStaffID}&start_date=${requestStartDate}&end_date=${requestEndDate}&count=100000&page=${page}`,
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${partnerID}, User ${userID}`,
			},
			data: this.state.authData,
		}).then(({ data: staffsClients }) => {

			// console.log(staffsClients, 'staffsClients')

			if (staffsClients.length === 300) {
				this.handleStaffSubmit(e, ++page)

				this.setState({
					yclientsData: staffsClients
				})
			} else {
				const yclientsData = [...this.state.yclientsData, ...staffsClients]
				const allRecordsMobiles = []
				const allRecords = []
				const allMobiles = []
				const attendantMobiles = []
				const canceledMobiles = []
				const notAttendantMobiles = []
				const aimedClients = []
				const aimedClientsMobiles = []
				const attendant = []
				const attendantWithoutPhoneNumber = []
				const myArr = []
				const myArrMobiles = []


				// &staff_id=${choosenStaffID}
				// Получаем вообще все записи = yclientsData
				// Фильтруем на записи staffID
				// Мапим записи StaffID
				// Берем номер телефона и ищем повтор во всем списке (также фильтр по дате и то, что другой staffID)
				//

				// вообще все записи сотрудника
				for (let i = 0; i < yclientsData.length; i++) {
					if (yclientsData[i].attendance !== -1) {
						allMobiles.push(yclientsData[i].client.phone)
					} else if (yclientsData[i].client.phone !== "") {
						notAttendantMobiles.push(yclientsData[i].client.phone)
					}

					allRecords.push(yclientsData[i])
					allRecordsMobiles.push(yclientsData[i].client.phone)
				}

				// все кто пришел сотрудника
				for (let j = 0; j < yclientsData.length; j++) {
					if (yclientsData[j].attendance === 1 && moment(reportDate) > moment(yclientsData[j].datetime)) {
							attendantWithoutPhoneNumber.push(yclientsData[j])
						if (yclientsData[j].client.phone !== "") {
							attendant.push(yclientsData[j])
							attendantMobiles.push(yclientsData[j].client.phone)
						}
					}

					if (yclientsData[j].attendance === -1 && yclientsData[j].client.phone !== "" && moment(reportDate) > moment(yclientsData[j].datetime)) {
						canceledMobiles.push(yclientsData[j].client.phone)
					}
				}

				const delayedRequest = () => (
					request({
						url: `https://api.yclients.com/api/v1/records/${choosenCompanyID}&start_date=${requestStartDate}&end_date=${requestEndDate}&count=100000`,
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
						// console.log(allClients, 'allClients')
						// console.log(yclientsData, 'yclientsData')
						// console.log(attendant, 'attendant')

						allClients.map(client => {
							// console.log(client.attendance !== -1, client.staff_id !== choosenStaffID, 'b', client.staff_id, choosenStaffID)
							if (!aimedClientsMobiles.includes(client.client.phone) && client.attendance !== -1 && client.staff_id !== choosenStaffID && attendantMobiles.includes(client.client.phone)) {
								aimedClientsMobiles.push(client.client.phone)
								aimedClients.push(client)
							}

							if (attendantMobiles.includes(client.client.phone) && client.staff_id === choosenStaffID) {
								myArrMobiles.push(client.client.phone)
								myArr.push(client)
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
				processArray(yclientsData).then(() => {
					const returnsOfAttendant = allMobiles.filter(item => attendantMobiles.includes(item))

					// все кто пришел сотрудника
					// Вообще все записи сотрудника
					// Из всех записей, мы берем только тех, кто приходил
					// Получаем список

					const uniqMobiles = new Set(returnsOfAttendant)
					const returnMobiles = attendantMobiles.length - uniqMobiles.size
					const uniqAttendantMobiles = new Set(attendantMobiles)

					// console.log(allRecords, 'allRecords все записи')
					// console.log(allMobiles, 'ВСЕ ЗАПИСИ')
					// console.log(new Set(allMobiles), 'Все записи без дублей');
					// console.log(attendantMobiles, 'attendantMobiles все кто пришел до сегодня') // нужно сделать до отчетного дня
					// console.log(uniqAttendantMobiles, 'все кто пришел до сегодня без дублей') // здесь нужно убрать те, что есть в
					// console.log(returnsOfAttendant, 'все кто пришел и их них записан до конца периода')
					const arrayOfUniqMobiles = Array.from(uniqMobiles)
					// console.log(arrayOfUniqMobiles, 'все кто пришел и записан без дублей')
					// console.log(returnMobiles, 'returnMobiles все кто пришел и их них записан до конца периода —  все кто пришел и записан без дублей')
					// console.log(aimedClients, 'клиенты, которые были направлены на коллег')
					// console.log(myArr, 'возвращенные')

					const arrayOfReturnMobiles = attendantMobiles.filter(item => {
						if (!arrayOfUniqMobiles.includes(item)) {
							return item
						}
					})

					const percentOfReturns = (returnMobiles / uniqAttendantMobiles.size) * 100
					const futureMobiles = allMobiles.length - attendantMobiles.length

					function compressArray(original) {

						var compressed = [];
						// make a copy of the input array
						var copy = original.slice(0);

						// first loop goes over every element
						for (var i = 0; i < original.length; i++) {

							var myCount = 0;
							// loop over every element in the copy and see if it's the same
							for (var w = 0; w < copy.length; w++) {
								if (original[i] == copy[w]) {
									// increase amount of times duplicate is found
									myCount++;
									// sets item to undefined
									delete copy[w];
								}
							}

							if (myCount > 0) {
								var a = new Object();
								a.value = original[i];
								a.count = myCount;
								compressed.push(a);
							}
						}

						const compressedUniq = compressed.filter(item => item.count > 1)

						return {
							compressed,
							compressedUniq
						};
					};

					const compressedUniq = compressArray(allMobiles).compressedUniq;
					// console.log(allMobiles, 'myArrMobiles', compressedUniq, compressedUniq.length)


					console.log(attendant, 'attendant')

					let serviceProfit = 0;
					attendantWithoutPhoneNumber.map((client) => {
						if (client.services.length > 0) {
							for (var i = 0; i < client.services.length; i++) {
								serviceProfit += client.services[i].cost
							}
						} else {
							serviceProfit += client.services[0].cost
						}
					})

					console.log(serviceProfit, 'amouuuunt')

					this.setState({
						staffResult: {
							serviceProfit, // доход по услугам
							compressedUniq, // Тот самый показатель повторных клиентов
							allRecordsMobiles, // вообще все записи
							allMobiles, // все записи на весь срок, кроме не пришедших
							futureMobiles, // записи на будущие даты
							canceledMobiles, // отказники
							uniqAttendantMobiles,
							attendantMobiles, // все кто пришел до отчетного дня
							notAttendantMobiles, // все кто не пришел до отчетного дня
							returnsOfAttendant, // все кто записался до конца периода из тех кто пришел
							aimedClients, // направленные на других
							uniqMobiles,
							returnMobiles,
							percentOfReturns,
							myArr,
						},
						isLoading: false,
					})
				})
			}
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

	handleCompanyChange = (e) => {
		let staffID = 264106

		if (e.target.value === '114454') {
			staffID = 264106
		} else if (e.target.value === '150855') {
			staffID = 386103
		} else if (e.target.value === '169519') {
			staffID = 453426
		}

		this.setState({
			choosenCompanyID: e.target.value,
			choosenStaffID: staffID,
		}, () => {
			this.authYclients()
		})
	}

	render() {
		// console.log(this.state.profit, 'proffffit state')

		const { staffs, staffResult } = this.state
		const tariff = {
			title: "Отчёт по возвращаемости клиентов",
			name: "space",
			description: "Статистика важнейших показателей по каждому косметологу",
			cost: "важно",
		}

		const userLogin = this.props.cookies.get('login').toLowerCase()

		const companies = [{
			name: "Med yu med",
			id: 114454,
			disabled: userLogin !== 'arslanbek.khasiev@mail.ru' && userLogin !== 'usol-irina@yandex.ru'
		}, {
			name: "Пятигорск",
			id: 150855,
			disabled: userLogin !== 'arslanbek.khasiev@mail.ru'
		}, {
			name: "Мотивация",
			id: 169519,
			disabled: userLogin !== 'arslanbek.khasiev@mail.ru' && userLogin !== '79100155524'
		}]

		if (this.state.authData.password) {
			return (
				<article className="docs">
					<Tariff name="exclusive" tariff={tariff}>
						{staffs && <div className="block">
							<form onSubmit={this.handleStaffSubmit}>
								<div className="companyField">
									<label className="label">Выберите филиал:</label>
									<select onChange={this.handleCompanyChange} className="select">
										{companies.map((company, id) => (
											<option value={company.id} disabled={company.disabled}>{company.name}</option>
										))}
									</select>
								</div>

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
					</Tariff>

					{this.state.isLoading && <span className="loader" />}

					{staffResult &&
						<div className="block">
							<div className="service">
								<div className="result">
									<div className="result_tariffHeader">
										<img className="avatar" src={this.getStaff().avatar_big} alt={this.getStaff()}/>
									</div>
									<div className="result_tariffBody">
										<div className="service">
											<p className="staffName">{this.getStaff().name}</p>
											<div className="period">{moment(this.state.startDate).format("DD MMMM")} — {moment(this.state.endDate).format("DD MMMM")}</div>

											<div className="row">
												<span className="name">Доход по услугам:</span>
												<div className="value">
													<span>{new Intl.NumberFormat('ru-RU').format(staffResult.serviceProfit)} ₽</span>
												</div>
												<div className="value">
													<span>{(staffResult.serviceProfit / (staffResult.serviceProfit + this.state.profit.goods) * 100).toFixed(0)}%</span>
												</div>
											</div>

											<div className="row">
												<span className="name">Доход по товарам:</span>
												<div className="value">
													<span>{new Intl.NumberFormat('ru-RU').format(this.state.profit.goods)} ₽</span>
												</div>
												<div className="value">
												<span>{(this.state.profit.goods / (staffResult.serviceProfit + this.state.profit.goods) * 100).toFixed(0)}%</span>
												</div>
											</div>

											<div className="row">
												<span className="name">Клиенты, которых обслужили:</span>
												<div className="value">
													<span>{staffResult.uniqAttendantMobiles.size}</span>
												</div>

												<div className="value">
													<span>100%</span>
												</div>
											</div>

											<div className="row">
												<span className="name">Записи на будущие даты:</span>
												<div className="value">
													<span>{staffResult.futureMobiles}</span>
												</div>
												<div className="value">
													<span>{(staffResult.futureMobiles / staffResult.uniqAttendantMobiles.size * 100).toFixed(0)}%</span>
												</div>
											</div>

											<div className="row">
												<span className="name">Клиенты, которые отменились:</span>
												<div className="value">
													<span>{staffResult.canceledMobiles.length}</span>
												</div>

												<div className="value">
													<span>{(staffResult.canceledMobiles.length / staffResult.allRecordsMobiles.length * 100).toFixed(0)}%</span>
												</div>
											</div>

											<div className="row">
												<span className="name">Клиенты, которых направили к коллегам:</span>
												<div className="value">
													<span>{staffResult.aimedClients.length}</span>
												</div>

												<div className="value">
													<span>{(staffResult.aimedClients.length / staffResult.uniqAttendantMobiles.size * 100).toFixed(0)}%</span>
												</div>
											</div>

											<div className="row">
												<span className="name">Повторные записи (Возвращаемость):</span>
												<div className="value">
													<span>{staffResult.compressedUniq.length}</span>
												</div>
												<div className="value">
													<span>{((staffResult.compressedUniq.length / staffResult.uniqAttendantMobiles.size) * 100).toFixed(1)}%</span>
												</div>
											</div>
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

export default withCookies(Cosmetology)
