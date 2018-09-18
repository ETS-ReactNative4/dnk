/* @flow */
import React, { type Node } from 'react'

import classnames from 'classnames/bind'
import styles from './Link.css'

const cx = classnames.bind(styles)

type LinkPropsType = {
	className?: string,
	href?: string,
	to?: string,
	children: Node,
}

const Link = ({ className, href, to, children }: LinkPropsType) => {

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

export default Link
