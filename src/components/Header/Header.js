// @flow
import React from 'react'
import Link from './../../components/Link'
import Button from './../../components/Button'
import isMobile from './../../utils/is-mobile'
import styles from './Header.css'

import logo from './images/logo.png'

const Header = () => (
	<header className="header">
		<Link className="logo" to="/dnk">
			<img src={logo} alt="DNK Beauty"/>
		</Link>

		{!isMobile &&
			<nav>
				<ul className="list">
					<li className="item">
						<Link className="link" to="/dnk/cosmetology">Отчёт по возвращаемости</Link>
					</li>
					<li className="item">
						<Link className="link" to="/dnk/manager">Отчёт отдела продаж</Link>
					</li>
					<li className="item">
						<Link className="link" to="/dnk/marketing">Отчет отдела маркетинга</Link>
					</li>
					<li className="item">
						<Link className="link" to="/dnk/structure">Орг. Структура</Link>
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
