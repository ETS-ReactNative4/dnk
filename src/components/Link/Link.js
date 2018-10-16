/* @flow */
import React, { type Node } from 'react'
import { Link } from 'react-router-dom'

import classnames from 'classnames/bind'
import styles from './Link.css'

const cx = classnames.bind(styles)

type LinkPropsType = {
	className?: string,
	href?: string,
	to?: string,
	children: Node,
}

const MyLink = ({ className, href, to, children }: LinkPropsType) => {
	if (to) {
		return (
			<Link className="link" to={to}>{children}</Link>
		)
	}

	return (
		<a
			className="link"
			href={href}
			target="_blank"
			rel="noopener noreferrer"
		>
			{children}
		</a>
	)
}

export default MyLink
