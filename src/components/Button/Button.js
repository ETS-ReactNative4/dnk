// @flow
import React from 'react'
// import Link from 'components/Link'
import classnames from 'classnames/bind'
import styles from './Button.css'

const cx = classnames.bind(styles)

type ButtonPropsType = {
	className?: string,
	href?: string,
	to?: string,
	children?: any,
	onClick?: (Event) => void|Promise<?mixed>,
}

const Button = ({ className, href, to, children, onClick }: ButtonPropsType) => {
	const buttonProps = {
		className: cx('button', className),
		href,
		to,
	}

	// if (to) {
	// 	return <Link {...buttonProps}>{children}</Link>
	// }

	if (href) {
		return <a {...buttonProps} target="_blank" rel="noopener noreferrer">{children}</a>
	}

	return (
		<button onClick={onClick} {...buttonProps}>{children}</button>
	)
}

export default Button
