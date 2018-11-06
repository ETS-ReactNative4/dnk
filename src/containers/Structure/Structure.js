import React, { Component } from 'react'
import { withCookies, Cookies } from 'react-cookie';

import moment from 'moment';

import classnames from 'classnames/bind'

import structureImage from './images/structure.pdf'
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Structure.css'

require('moment/locale/ru');

const cx = classnames.bind(styles)
moment.locale('ru');

const Structure = () => (
	<article className="main">
		<embed className="structure" src={structureImage}/>
	</article>
)

export default Structure
