import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts' // Expects that Highcharts was loaded in the code.
import moment from 'moment';
import './Chart.css'

class Chart extends Component {
	componentWillMount() {
		const {data, name, startDate, endDate} = this.props

		const { attendantForChart } = data
		console.log(attendantForChart, 'atte')

		const returnsPercent = +((data.compressedUniq.length / data.uniqAttendantMobiles.size) * 100).toFixed(1) // Процент возвращаемости

		console.log(returnsPercent, 'pr', startDate)

		var i = 0
		const percents = []
		const dates = []
		while (moment(startDate).add(i, 'days') <= moment(endDate)) {
			const s = attendantForChart.filter(item => moment(item.datetime) < moment(startDate).add(i, 'days') && item.client.phone !== "")
			const sPhones = s.map(item => item.client.phone)
			const sPhonesSet = new Set(sPhones)
			// percents.push(+((data.compressedUniq.length / s.length) * 100).toFixed(1))
			const percent = ((data.compressedUniq.length / sPhonesSet.size) * 100).toFixed(1)
			console.log(data.compressedUniq.length, sPhonesSet.size, moment(startDate).add(i, 'days'), +percent)
			percents.push(+percent)
			dates.push(moment(startDate).add(i, 'days').format('DD MMMM'))

			if (moment(startDate).add(i+3, 'days') < moment(endDate)) {
				i += 3
			} else {
				i += 1
			}
		}

		// const dates = attendantForChart.map(item => moment(item.datetime).format("MM-DD"))
		// const percents = attendantForChart.map(item => {
		// 	if (moment(reportDate) > moment(yclientsData[j].datetime)) {
		// 		return +((data.compressedUniq.length / data.uniqAttendantMobiles.size) * 100).toFixed(1)
		// 	}
		// })

		this.config = {
			chart: {
				type: 'area'
			},
			title: {
				text: 'Показатель возвращенных клиентов'
			},
			legend: {
				layout: 'vertical',
				align: 'left',
				verticalAlign: 'top',
				x: 150,
				y: 100,
				floating: true,
				borderWidth: 1,
				backgroundColor: '#FFFFFF'
			},
			xAxis: {
				type: 'datetime',
				categories: dates,
			},
			yAxis: {
				title: {
					text: 'Процент возвращаемости'
				}
			},
			tooltip: {
				shared: true,
				valueSuffix: '%'
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				areaspline: {
					fillOpacity: 0.5
				}
			},
			series: [{
				name,
				data: percents,
			}]
		};
	}
	componentDidMount() {
		// let chart = this.refs.chart.getChart();
		// chart.series[0].addPoint({x: 10, y: 12});
	}

	render() {
		return (
			<ReactHighcharts config={this.config} ref="chart"></ReactHighcharts>
		)
	}
}

export default Chart
