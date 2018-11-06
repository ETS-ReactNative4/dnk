import React, { Fragment } from 'react'
import Services from './../Services'
import Button from './../Button'
import classnames from 'classnames/bind'

import card from './images/card.png'
import styles from './Tariff.css'

const cx = classnames.bind(styles)

const media = window.matchMedia('(max-width: 800px)')

const Option = ({ tariff, changeTariff, children }) => {
	// if (media.matches) {
	// 	return (
	// 		<Fragment>
	// 			<div className="tariff">
	// 				<div className="tariff_tariffHeader"/>
	// 				<div className="tariff_tariffBody">
	// 					<h2 className="tariff_heading">{tariff.title}</h2>
	// 					<p className="tariff_description">{tariff.description}</p>
	//
	// 					{children}
	// 				</div>
	// 			</div>
	// 		</Fragment>
	// 	)
	// }

	return (
		<div className="option">
			<div className={cx('tariff_block', { red: tariff.name === 'exclusive' })}>
				<div className="tariff_header">
					<h2 className="tariff_heading">{tariff.title}</h2>
					<div className="tariff_label">{tariff.cost}</div>
				</div>
				<p className="tariff_description">{tariff.description}</p>

				{children}
			</div>
		</div>
	)
}

export default Option
