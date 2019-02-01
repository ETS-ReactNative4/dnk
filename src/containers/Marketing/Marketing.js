import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';
import logo from './logo.jpg'
import moment from 'moment';

import classnames from 'classnames/bind'

import styles from './Marketing.css'

import Tariff from './../../components/Tariff'
import Button from './../../components/Button'
import DatePicker from 'react-datepicker';

import Trello from "node-trello";
const t = new Trello("d9236b46476892005ccea3bb01638114", "2c56694a3dde115d5d23e6e50d77543ba953766bfad725a9bdd0b99725a3cecb");

require('moment/locale/ru');

const cx = classnames.bind(styles)
moment.locale('ru');


// id доски 5c18f86b5c8bcd5af8c1d482

// /boards/{id}/lists
const lists = {
	'recallKris': '5c52d09ca61c157ad5d3572c', // "На перезвон (Кристина)"
	'recallLove': '5c41badc0b6e4163ec6dee0b', // "На перезвон (Любовь)"
	'almostKris': '5c519b45a3796f533a12f678', // "Дожать (Кристина)"
	'almostLove': '5c448ce56dd2794807f67484', // "Дожать (Любовь)"
	'successKris': '5c519bafd53bd95e92007589', // "Подтвердились (Кристина)"
	'successLove' : '5c40748a0962938a10c1761e', // "Подтвердились (Любовь)"
	'failKris': '5c519bbfe37472244a349b35', // "Не подтвердились (Кристина)"
	'failLove': '5c40749811c6847eb255a24c', // "Не подтвердились (Любовь)"
	'cameKris': '5c519bd4e368320cb86860a1', // "Пришли (Кристина)"
	'cameLove': '5c458f7a2079178eb8604a1c', // "Пришли (Любовь)"
}

const managerIds = {
	'Love': '5c405bf4dd639450428e1abc',
	'Kris': '5c503c7703a4ed637870a235'
}

const trelloStates = {
	recall: {
		Love: '5c41badc0b6e4163ec6dee0b',
		Kris: '5c52d09ca61c157ad5d3572c'
	},
	almost: {
		Love: '5c448ce56dd2794807f67484',
		Kris: '5c519b45a3796f533a12f678'
	},
	success: {
		Love: '5c40748a0962938a10c1761e',
		Kris: '5c519bafd53bd95e92007589'
	},
	fail: {
		Love: '5c40749811c6847eb255a24c',
		Kris: '5c519bbfe37472244a349b35'
	},
	came: {
		Love: '5c458f7a2079178eb8604a1c',
		Kris: '5c519bd4e368320cb86860a1'
	}
}


class Marketing extends Component {
	state = {
		allData: [],
		dayData: [],
		choosenDate: moment(),
		choosenFormattedDate: moment().format('DD/MM/YYYY'),
		choosenTillDate: moment(),
		choosenFormattedTillDate: moment().format('DD/MM/YYYY'),
		selectedAdTypes: ['ВК', 'Instagram'],
		selectedManagers: ['Love', 'Kris'],
		selectedCompanies: ['Киевская', 'Ярославль', 'Брянск'],
		urls: [], //  урлы на выбранный тип карточек при клике
		isLoading: false,
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

			const allData = {
				'5c52d09ca61c157ad5d3572c': {
					name: "На перезвон (Кристина)",
					data: []
				},
				'5c41badc0b6e4163ec6dee0b': {
					name: "На перезвон (Любовь)",
					data: []
				},
				'5c519b45a3796f533a12f678': {
					name: "Дожать (Кристина)",
					data: []
				},
				'5c448ce56dd2794807f67484': {
					name: "Дожать (Любовь)",
					data: [],
				},
				'5c519bafd53bd95e92007589': {
					name: "Подтвердились (Кристина)",
					data: []
				},
				'5c40748a0962938a10c1761e': {
					name: "Подтвердились (Любовь)",
					data: [],
				},
				'5c519bbfe37472244a349b35': {
					name: "Не подтвердились (Кристина)",
					data: []
				},
				'5c40749811c6847eb255a24c': {
					name: "Не подтвердились (Любовь)",
					data: [],
				},
				'5c519bd4e368320cb86860a1': {
					name: 'Пришли (Кристина)',
					data: [],
				},
				'5c458f7a2079178eb8604a1c': {
					name: 'Пришли (Любовь)',
					data: []
				}
			}

			dayData.map(card => {
				allData[card.idList].data.push(card)
			})

			this.setState({ dayData: dayData, allData: allData, isLoading: false })
		})
	}

	handleClick = (type) => {
		const selectedTrelloStatusId = [];

		this.state.selectedManagers.map(manager => {
			selectedTrelloStatusId.push(trelloStates[type][manager])
		})

		const myData = []

		selectedTrelloStatusId.map(id => {
			myData.push(...this.state.allData[id].data)
		})

		const urls = myData.map(data => data.shortUrl)

		this.setState({ urls })
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

	calculateData = (type, love, kris) => {
		const { allData, selectedAdTypes, selectedManagers, selectedCompanies } = this.state

		const preformattedData = [...allData[love].data, ...allData[kris].data]

		let recallData = preformattedData.filter(data => {
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

		recallData = recallData.filter(data => {
			let result = false

			selectedManagers.map((manager) => {
				if (data.idMembers.includes(managerIds[manager])) {
					result = true
				}
			})

			return result
		})

		recallData = recallData.filter(data => {
			let result = false

			selectedCompanies.map((company) => {
				if (data.name.indexOf(company) !== -1) {
					result = true
				}
			})

			return result
		})

		return recallData
	}

	render() {
		const {
			choosenDate,
			choosenFormattedDate,
			choosenTillDate,
			choosenFormattedTillDate,
			dayData,
			selectedAdTypes,
			selectedManagers,
			selectedCompanies,
			urls
		} = this.state

		const tariff = {
			title: "Сквозная Аналитика",
			name: "exclusive",
			description: "Статистика от рекламного объявления до денег в кассе",
			cost: "важно",
		}

		const period = choosenFormattedDate === choosenFormattedTillDate ? moment(choosenDate).format("DD MMMM") : moment(choosenDate).format("DD MMMM") + " — " + moment(choosenTillDate).format("DD MMMM")

		let recallData, almostData, failData, successData, cameData, fullData;

		if (dayData.length > 0) {
			recallData = this.calculateData('recall', '5c52d09ca61c157ad5d3572c', '5c41badc0b6e4163ec6dee0b')
			almostData = this.calculateData('almost', '5c519b45a3796f533a12f678', '5c448ce56dd2794807f67484')
			failData = this.calculateData('fail', '5c519bbfe37472244a349b35', '5c40749811c6847eb255a24c')
			successData = this.calculateData('success', '5c519bafd53bd95e92007589', '5c40748a0962938a10c1761e')
			cameData = this.calculateData('came', '5c519bd4e368320cb86860a1', '5c458f7a2079178eb8604a1c')
			fullData = [...recallData, ...almostData, ...failData, ...successData, ...cameData]

			console.log(selectedAdTypes, selectedManagers, selectedCompanies, recallData)
		}

		return (
			<article className="docs">
				<Tariff name="space" tariff={tariff}>
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
												<Button className={cx('filterButton', { unChoosen: !selectedAdTypes.includes('Instagram')})} onClick={() => this.handleChangeAds('Instagram')}>Instagram</Button>
											</div>
										</div>

										<div>
											<h3>Менеджер</h3>
											<div className="buttonsField">
												<Button className={cx('filterButton', { unChoosen: !selectedManagers.includes('Love')})} onClick={() => this.handleChangeManager('Love')}>Любовь</Button>
												<Button className={cx('filterButton', { unChoosen: !selectedManagers.includes('Kris')})} onClick={() => this.handleChangeManager('Kris')}>Кристина</Button>
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
											<span>{((recallData.length) / dayData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('almost')}>Дожать:</span>
										<div className="value">
											<span>{almostData.length}</span>
										</div>

										<div className="value">
											<span>{(almostData.length / dayData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('fail')}>Не подтвердились:</span>
										<div className="value">
											<span>{failData.length}</span>
										</div>

										<div className="value">
											<span>{(failData.length / dayData.length * 100).toFixed(1)}%</span>
										</div>
									</div>

									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('success')}>Подтвердились:</span>
										<div className="value">
											<span>{successData.length}</span>
										</div>

										<div className="value">
											<span>{(successData.length / dayData.length * 100).toFixed(1)}%</span>
										</div>
									</div>


									<div className="row">
										<span className="marketingName" onClick={() => this.handleClick('came')}>Пришли:</span>
										<div className="value">
											<span>{cameData.length}</span>
										</div>

										<div className="value">
											<span>{(cameData.length / dayData.length * 100).toFixed(1)}%</span>
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
								</div>
							</div>
						</div>
					</div>
					{urls &&
						<div className="urlsField">{urls.map(url => <a href={url} target="_blank">{url}</a>)}</div>
					}
				</div>
			}
			</article>
		)
	}
}

export default Marketing
