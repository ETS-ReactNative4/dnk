import React from 'react'
import styles from './Services.css'

const Services = ({ services }) =>
	services.map(({ heading, body }) => (
		<div className="service" key={heading}>
			<h2 className="heading">{heading}</h2>
			{body.map(({ name, value, note }) => (
				<div className="row" key={name}>
					<span className="name">{name}</span>
					<div className="value">
						<span>{value}</span>
						{note &&
							<span className="note">
								{note}
							</span>
						}
					</div>
				</div>
			))}
		</div>
	))

export default Services
