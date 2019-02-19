// TRELLO
// id доски 5c18f86b5c8bcd5af8c1d482
// boards/{id}/lists — Получить все списки доски


// ID колонок для понимания
// const lists = {
// 	'recallKris': '5c52d09ca61c157ad5d3572c', // "На перезвон (Кристина)"
// 	'recallLove': '5c41badc0b6e4163ec6dee0b', // "На перезвон (Любовь)"
// 	'recallMarina': '5c599ae87acfc2222892c32c', // "На перезвон (Марина)"
// 	'almostKris': '5c519b45a3796f533a12f678', // "Дожать (Кристина)"
// 	'almostLove': '5c448ce56dd2794807f67484', // "Дожать (Любовь)"
// 	'successKris': '5c519bafd53bd95e92007589', // "Подтвердились (Кристина)"
// 	'successLove' : '5c40748a0962938a10c1761e', // "Подтвердились (Любовь)"
// 	'successMarina': '5c599aefa412b12ab3c50dcd', // "Подтвердились (Марина)"
// 	'failKris': '5c519bbfe37472244a349b35', // "Не подтвердились (Кристина)"
// 	'failLove': '5c40749811c6847eb255a24c', // "Не подтвердились (Любовь)"
// 	'failMarina': '5c599af68d2ae576c3bd43e2', // "Не подтвердились (Марина)"
// 	'cameKris': '5c519bd4e368320cb86860a1', // "Пришли (Кристина)"
// 	'cameLove': '5c458f7a2079178eb8604a1c', // "Пришли (Любовь)",
// 	'cameMarina': '5c599afa80c92065602bc134', // "Пришли (Марина)"
// }

// ID менеджеров в Trello
const managerIds = {
	'Love': '5c405bf4dd639450428e1abc',
	'Kris': '5c503c7703a4ed637870a235',
	'Marina': '581a23153f0a13d306830bb9'
}

// Групировка колонок TRELLO по статусам и менеджерам
const trelloStates = {
	recall: {
		Love: '5c41badc0b6e4163ec6dee0b',
		Kris: '5c52d09ca61c157ad5d3572c',
		Marina: '5c599ae87acfc2222892c32c'
	},
	almost: {
		Love: '5c448ce56dd2794807f67484',
		Kris: '5c519b45a3796f533a12f678'
	},
	success: {
		Love: '5c40748a0962938a10c1761e',
		Kris: '5c519bafd53bd95e92007589',
		Marina: '5c599aefa412b12ab3c50dcd'
	},
	fail: {
		Love: '5c40749811c6847eb255a24c',
		Kris: '5c519bbfe37472244a349b35',
		Marina: '5c599af68d2ae576c3bd43e2'
	},
	came: {
		Love: '5c458f7a2079178eb8604a1c',
		Kris: '5c519bd4e368320cb86860a1',
		Marina: '5c599afa80c92065602bc134'
	}
}

// Блок для отображения на странице
const tariff = {
	title: "Сквозная Аналитика",
	name: "exclusive",
	description: "Статистика от рекламного объявления до денег в кассе",
	cost: "важно",
}

// Маппинг
const mapperCompanies = {
	'Киевская': '170884',
	'Ярославль': '178997',
	'Брянск': '178998',
	'Пятигорск': '150855',
}

// Yclients partner ID
const partnerID = 'hu2x584xzw7y7fy34bg5';

// Yclients user ID
const userID = '7a140112eded9ee20ba43f03406138cf';


// Забиваем сделками из Трелло по столбцам за период
const allData = {
	'5c52d09ca61c157ad5d3572c': {
		name: "На перезвон (Кристина)",
		data: []
	},
	'5c41badc0b6e4163ec6dee0b': {
		name: "На перезвон (Любовь)",
		data: []
	},
	'5c599ae87acfc2222892c32c': {
		name: "На перезвон (Марина)",
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
	'5c599aefa412b12ab3c50dcd': {
		name: "Подтвердились (Марина)",
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
	'5c599af68d2ae576c3bd43e2': {
		name: "Не подтвердились (Марина)",
		data: [],
	},
	'5c519bd4e368320cb86860a1': {
		name: 'Пришли (Кристина)',
		data: [],
	},
	'5c458f7a2079178eb8604a1c': {
		name: 'Пришли (Любовь)',
		data: []
	},
	'5c599afa80c92065602bc134': {
		name: 'Пришли (Марина)',
		data: [],
	},
	'5c1903b9e8ca4d35fb99cc0a': {
		name: 'Не пришли',
		data: [],
	}
}

const yclientsAuthConfig = {
	url: 'https://api.yclients.com/api/v1/auth',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Authorization': 'hu2x584xzw7y7fy34bg5',
	},
}

const config = {
	allData,
	managerIds,
	mapperCompanies,
	trelloStates,
	tariff,
	partnerID,
	userID,
	yclientsAuthConfig
}

export default config
