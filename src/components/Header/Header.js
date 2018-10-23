// @flow
import React from 'react'
import Link from './../../components/Link'
import Button from './../../components/Button'
import isMobile from './../../utils/is-mobile'
import styles from './Header.css'

import logo from './images/logo.png'

const Header = () => (
	<header className="header">
		<a className="logo" target="_blank" rel="noopener noreferrer" href="https://dnkclinic.ru">
			<img src={logo} alt="DNK Beauty"/>
		</a>

		{!isMobile &&
			<nav>
				<ul className="list">
					<li className="item">
						<Link className="link" to="/">Отчёт по возвращаемости</Link>
					</li>
					<li className="item">
						<Link className="link" to="/manager">Отчёт отдела продаж</Link>
					</li>
					<li className="item">
						<Link className="link" to="/deposit">Отчет отдела маркетинга</Link>
					</li>
					<li className="item">
						<Link className="link" to="/products">Орг. Структура</Link>
					</li>
				</ul>
			</nav>
		}

		<div>
			{!isMobile &&
				<Link className="enter" href="https://amocrm.ru">Вход в AMO</Link>
			}
			<Button className="button" href="https://yclients.com">YClients</Button>
		</div>
	</header>
)

export default Header
