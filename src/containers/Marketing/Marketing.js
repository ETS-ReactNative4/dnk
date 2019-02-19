import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';
import classnames from 'classnames/bind'
import moment from 'moment';
import request from './../../utils/request'
import getState from './get-state.js'
import config from './config'
import logo from './logo.jpg'

import styles from './Marketing.css'

import Tariff from './../../components/Tariff'
import Button from './../../components/Button'
import DatePicker from 'react-datepicker';

import Trello from "node-trello";
const t = new Trello("d9236b46476892005ccea3bb01638114", "2c56694a3dde115d5d23e6e50d77543ba953766bfad725a9bdd0b99725a3cecb");

require('moment/locale/ru');

const cx = classnames.bind(styles)
moment.locale('ru')



// FACEBOOK APP SECRET 7a11f6e726873afab83f29ac9c29438c
// AccessToken EAAJHlJxKpLQBAINIdlCIxlQeAHD3OTJMemcbOpL1DPZBZCQH5dlMnxcNzGmwyfcpvcD2YqIDvQPb7fz0TgOLZBbZADlpKqzcHTYka35f2e9ZCRyRRlnKEGYhs2ZCaCQH2Y0O3BL8gvP0LvGZBluU8z2oLr9S0rLsLYZD

//
// const adsSdk = require('facebook-nodejs-business-sdk');
// const accessToken = 'EAAJHlJxKpLQBAINIdlCIxlQeAHD3OTJMemcbOpL1DPZBZCQH5dlMnxcNzGmwyfcpvcD2YqIDvQPb7fz0TgOLZBbZADlpKqzcHTYka35f2e9ZCRyRRlnKEGYhs2ZCaCQH2Y0O3BL8gvP0LvGZBluU8z2oLr9S0rLsLYZD';
// const api = adsSdk.FacebookAdsApi.init(accessToken);
// const AdAccount = adsSdk.AdAccount;
// const Lead = adsSdk.Lead;
// const Ad = adsSdk.Ad;
// const id = '23843158445810239'
// const Campaign = adsSdk.Campaign;
// const account = new AdAccount('act_132461390881309');
// // api.setDebug(true);
//
// const f = async () => {
//
// 		let campaigns = await account.getCampaigns([Campaign.Fields.name], {
// 			limit: 20,
// 			[Campaign.Fields.effective_status]: [Campaign.EffectiveStatus.active],
// 		});
//
// 		campaigns.forEach(c => {
// 			console.log(c, 'CCCC')
//
// 			let fields, params;
// 			fields = ['field_data'];
// 			params = { 'filtering' : [{'field':'time_created','operator':'GREATER_THAN','value':1546549613}],};
// 			const leadss = (new Ad(id)).getLeads(
// 			  fields,
// 			  params
// 			).then(ans => console.log(ans));
// 		});
//
// 		while (campaigns.hasNext()) {
// 			campaigns = await campaigns.next();
// 			campaigns.forEach(c => console.log(c.name));
// 		}
// };
//
// f();

























class Marketing extends Component {
	state = getState(this.props)

	authYclients = (mobiles, alreadyFilteredRecords = [], alreadyProfit = 0, page = 0) => {
		/* eslint-disable */
		const {choosenCompanyIds, choosenDate, choosenTillDate } = this.state
		const requestStartDate = moment(choosenDate).format("YYYY-MM-DD")
		const requestEndDate = moment(choosenTillDate).format("YYYY-MM-DD")

		request({
			...config.yclientsAuthConfig,
			data: this.state.authData
		}).then(() => {
			for (let i = 0; i < choosenCompanyIds.length; i++) {
				request({
					url: `https://api.yclients.com/api/v1/records/${choosenCompanyIds[i]}&start_date=${requestStartDate}&end_date=${requestEndDate}&count=100000&page=${page}`,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${config.partnerID}, User ${config.userID}`,
					},
					data: this.state.authData,
				}).then((records) => {
					// Фильтруем данные YCLIENTS и оставляем только те записи, которые совпадают с записями Trello по номеру телефона
					const filteredRecords = records.data.filter(record => {
						let result = false;

						mobiles.map(mobile => {
							if (record && record.client && record.client.phone.indexOf(mobile) !== -1) {
								console.log(record.client, mobile, "SPLASH!")
								result = true
							}
						})

						return result
					})

					console.log(filteredRecords, 'Yclients records filtered by trello')

					let profit = 0;

					filteredRecords.map((record) => {
						// считаем выручку только по пришедшим
						if (record.attendance === 1) {
							let summary = 0;

							record.services.map(service => summary += +service.cost)

							profit += summary
						}
					}, 0)

					console.log(profit, 'PROFIT')

					const companyId = choosenCompanyIds[i]

					this.setState({
						allTraficRecords: {
							...this.state.allTraficRecords,
							[companyId]: {
								records: [...alreadyFiltedRecords, ...filteredRecords],
								profit: alreadyProfit + profit,
							},
						}
					})

					// if (records.length === 300) {
					// 	this.authYclients(mobiles, filteredRecords, profit, ++page)
					// }
				})
			}
		})
		/* eslint-enable */
	}

	handleChangeDate = (date) => {
		const dateAsString = moment(date).format('DD/MM/YYYY')

		this.setState({
			choosenFormattedDate: dateAsString,
			choosenDate: date
		})
	}

	handleChangeTillDate = (date) => {
		const dateAsString = moment(date).format('DD/MM/YYYY')

		this.setState({
			choosenFormattedTillDate: dateAsString,
			choosenTillDate: date
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()
		this.setState({isLoading: true})

		const { choosenDate, choosenTillDate } = this.state
		const diff = choosenTillDate.diff(choosenDate, 'days')

		const choosenDateCopy = moment(choosenDate)

		const days = [choosenDateCopy.format('DD/MM/YYYY')]

		for (let i = 0; i < diff; i++) {
			days.push(choosenDateCopy.add(1, 'days').format('DD/MM/YYYY'))
		}

		t.get(`/1/boards/5c18f86b5c8bcd5af8c1d482/cards`, (err, data) => {

			const dayData = data.filter(card => {
				let result = false

				days.map(day => {
					if (card.name.indexOf(day) !== -1) result = true
				})

				return result
			})

			// console.log(dayData, 'dayData')

			const regex = /(\+7|7|8)?[\s\-]?\(?[4689][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}/gm; // find mobile phone
			const reg = /((\+7|^7|^8|-| |\(|\)))/gm; // remove brackets and +7, 8, -

			const mobiles = dayData.map(data => {
				const fullPhone = data.desc.match(regex)[0]
				const phone = fullPhone.replace(reg, '')

				return phone
			})

			console.log(mobiles, 'mobiles')

			this.authYclients(mobiles);

			dayData.map(card => {
				config.allData[card.idList].data.push(card)
			})

			this.setState({ dayData, allData: config.allData, isLoading: false })
		})
	}

	handleClick = (type) => {
		const myData = []
		const selectedTrelloStatusId = [];

		this.state.selectedManagers.map(manager => {
			selectedTrelloStatusId.push(config.trelloStates[type][manager])
		})

		selectedTrelloStatusId.map(id => {
			myData.push(...this.state.allData[id].data)
		})

		const selectedLeads = myData.map(data => ({
			name: data.name,
			link: data.shortUrl
		}))

		console.log(myData, 'myData')
		this.setState({ selectedLeads })
	}

	handleChangeAds = (ads) => {
		const { selectedAdTypes } = this.state
		const newSelectedAdTypes = selectedAdTypes.includes(ads) ? [...selectedAdTypes].filter(type => type !== ads) : [...selectedAdTypes, ads]

		this.setState({ selectedAdTypes: newSelectedAdTypes })
	}

	handleChangeManager = (manager) => {
		const { selectedManagers } = this.state
		const newSelectedManagers = selectedManagers.includes(manager) ? [...selectedManagers].filter(type => type !== manager) : [...selectedManagers, manager]

		this.setState({ selectedManagers: newSelectedManagers })
	}

	handleChangeCompany = (company) => {
		const { selectedCompanies } = this.state
		const newSelectedCompanies = selectedCompanies.includes(company) ? [...selectedCompanies].filter(type => type !== company) : [...selectedCompanies, company]

		this.setState({ selectedCompanies: newSelectedCompanies })
	}

	calculateData = (type, love, kris, marina) => {
		const { allData, selectedAdTypes, selectedManagers, selectedCompanies } = this.state

		const preformattedData = [...allData[love].data, ...allData[kris].data]

		if (marina) {
			preformattedData.push(...allData[marina].data)
		}

		let calculatedData = preformattedData.filter(data => {
			let result = false

			selectedAdTypes.map((ads) => {
				if (ads === 'ВК' && data.desc.indexOf('ВК') !== -1) {
					result = true
				}

				if (ads === 'Instagram' && data.desc.indexOf('ВК') === -1) {
					result = true
				}
			})

			return result
		})

		calculatedData = calculatedData.filter(data => {
			let result = false

			selectedManagers.map((manager) => {
				if (data.idMembers.includes(config.managerIds[manager])) {
					result = true
				}
			})

			return result
		})

		calculatedData = calculatedData.filter(data => {
			let result = false

			selectedCompanies.map((company) => {
				if (data.name.indexOf(company) !== -1) {
					result = true
				}
			})

			return result
		})

		return calculatedData
	}

	render() {
		const {
			allTraficRecords,
			choosenDate,
			choosenFormattedDate,
			choosenTillDate,
			choosenFormattedTillDate,
			dayData,
			selectedAdTypes,
			selectedManagers,
			selectedCompanies,
			selectedLeads
		} = this.state

		// Если выбран одинаковый день, показываем 1 день, а не период
		const period = choosenFormattedDate === choosenFormattedTillDate ? moment(choosenDate).format("DD MMMM") : moment(choosenDate).format("DD MMMM") + " — " + moment(choosenTillDate).format("DD MMMM")

		let recallData, almostData, failData, successData, cameData, fullData, profit = 0;

		if (dayData.length > 0) {
			recallData = this.calculateData('recall', '5c52d09ca61c157ad5d3572c', '5c41badc0b6e4163ec6dee0b', '5c599ae87acfc2222892c32c')
			almostData = this.calculateData('almost', '5c519b45a3796f533a12f678', '5c448ce56dd2794807f67484')
			failData = this.calculateData('fail', '5c519bbfe37472244a349b35', '5c40749811c6847eb255a24c', '5c599af68d2ae576c3bd43e2')
			successData = this.calculateData('success', '5c519bafd53bd95e92007589', '5c40748a0962938a10c1761e', '5c599aefa412b12ab3c50dcd')
			cameData = this.calculateData('came', '5c519bd4e368320cb86860a1', '5c458f7a2079178eb8604a1c', '5c599afa80c92065602bc134')
			fullData = [...recallData, ...almostData, ...failData, ...successData, ...cameData]

			selectedCompanies.map((current) => profit += allTraficRecords[config.mapperCompanies[current]].profit)
		}

		return (
			<article className="docs">
				<Tariff name="space" tariff={config.tariff}>
					<div className="block">
						<form onSubmit={this.handleSubmit}>
							<div className="dateField">
								<div className="date">
									<p className="dateNotes">Выберите начало периода:</p>
									<DatePicker
										selectsStart
										startDate={choosenDate}
										endDate={choosenTillDate}
										selected={choosenDate}
										onChange={this.handleChangeDate}
									/>
								</div>
							</div>

							<div className="dateField">
								<div className="date">
									<p className="dateNotes">Выберите конец периода:</p>
									<DatePicker
										selectsEnd
										startDate={choosenDate}
										endDate={choosenTillDate}
										selected={choosenTillDate}
										onChange={this.handleChangeTillDate}
									/>
								</div>
							</div>

							<Button type="submit" className="manager_staffButton">
								Подтвердить выбор
							</Button>
						</form>
					</div>
				</Tariff>

				{this.state.isLoading && <span className="loader" />}

				{dayData.length > 0 &&
					<div className="block">
						<div className="service">
						<div className="result">
							<div className="result_tariffHeader">
								<img className="marketingLogo" src={logo} alt='маркетинг'/>
							</div>
							<div className="result_tariffBody">
								<div className="service">
									<div className="period">{period}</div>

									<div className="filterField">
										<div>
											<h3>Р.К.</h3>
											<div className="buttonsField">
												<Button className={cx('filterButton', { unChoosen: !selectedAdTypes.includes('ВК')})} onClick={() => this.handleChangeAds('ВК')}>ВК</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedAdTypes.includes('Instagram')})} onClick={() => this.handleChangeAds('Instagram')}>Instgram</Button>
											</div>
										</div>

										<div>
											<h3>Менеджер</h3>
											<div className="buttonsField">
												<Button className={cx('filterButton', { unChoosen: !selectedManagers.includes('Love')})} onClick={() => this.handleChangeManager('Love')}>Любовь</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedManagers.includes('Kris')})} onClick={() => this.handleChangeManager('Kris')}>Кристина</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedManagers.includes('Marina')})} onClick={() => this.handleChangeManager('Marina')}>Марина</Button>
											</div>
										</div>
									</div>

									<div className="filterField">
										<div>
											<h3>Филиал</h3>
											<div className="buttonsField">
												<Button className={cx('filterButton', { unChoosen: !selectedCompanies.includes('Киевская')})} onClick={() => this.handleChangeCompany('Киевская')}>Киевская</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedCompanies.includes('Ярославль')})} onClick={() => this.handleChangeCompany('Ярославль')}>Ярославль</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedCompanies.includes('Брянск')})} onClick={() => this.handleChangeCompany('Брянск')}>Брянск</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedCompanies.includes('Пятигорск')})} onClick={() => this.handleChangeCompany('Пятигорск')}>Пятигорск</Button>
											</div>
										</div>
									</div>

									<div className="row">
										<span className="name">Показатель</span>
										<div className="value">
											<span>Количество</span>
										</div>
										<div className="value">
											<span>Процент</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('recall')}>На перезвон:</span>
										<div className="value">
											<span>{recallData.length}</span>
										</div>

										<div className="value">
											<span>{((recallData.length) / fullData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('almost')}>Дожать:</span>
										<div className="value">
											<span>{almostData.length}</span>
										</div>

										<div className="value">
											<span>{(almostData.length / fullData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('fail')}>Не подтвердились:</span>
										<div className="value">
											<span>{failData.length}</span>
										</div>

										<div className="value">
											<span>{(failData.length / fullData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('success')}>Подтвердились:</span>
										<div className="value">
											<span>{successData.length}</span>
										</div>

										<div className="value">
											<span>{(successData.length / fullData.length * 100).toFixed(1)}%</span>
										</div>
									</div>


									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('came')}>Пришли:</span>
										<div className="value">
											<span>{cameData.length}</span>
										</div>

										<div className="value">
											<span>{(cameData.length / fullData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName">Все лиды:</span>
										<div className="value">
											<span>{fullData.length}</span>
										</div>

										<div className="value">
											<span>100%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName">Выручка:</span>
										<div className="value">
											<span>{new Intl.NumberFormat('ru-RU').format(profit)} ₽</span>
										</div>

										<div className="value">
											<span>100%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName">Расходы:</span>
										<div className="value">
											<span>расходы в ₽</span>
										</div>

										<div className="value">
											<span>100%</span>
										</div>
									</div>

								</div>
							</div>
						</div>
					</div>

					{selectedLeads.length > 0 &&
						<div className="urlsField">
							<h1 className="urlsHeading">Все лиды в Trello</h1>
							<div className="urls">
								{selectedLeads.map(lead =>
									<a className="trelloLinks" href={lead.link} target="_blank" key={lead.link}>
										<h3>{lead.name}</h3>
									</a>
								)}
							</div>
						</div>
					}
				</div>
			}
			</article>
		)
	}
}

export default withCookies(Marketing)
