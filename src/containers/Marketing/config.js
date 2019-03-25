// TRELLO
// id доски 5c18f86b5c8bcd5af8c1d482
// boards/{id}/lists — Получить все списки доски


// ID колонок для понимания
// const lists = {
//	'5c18f91ce773ab78186d52e2' // Новые лиды
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

// '5c938cbcb7b52f0f7143d067' // Записанные (Лаура)
// '5c938bd18398a1559edb48da' // На перезвон (Лаура)
// '5c938d151bc558504d499682' // Пришли (Лаура)
// '5c938f92552353853cc0b868' не пришли (Лаура)
// }

// ID менеджеров в Trello
const managerIds = {
	'Laura': '5c1b6d7882fc200805c31e9a',
	// 'Love': '5c405bf4dd639450428e1abc',
	// 'Kris': '5c503c7703a4ed637870a235',
	// 'Marina': '581a23153f0a13d306830bb9'
}

// Групировка колонок TRELLO по статусам и менеджерам
const trelloStates = {
	recall: {
		Laura: '5c938bd18398a1559edb48da',
		// Love: '5c41badc0b6e4163ec6dee0b',
		// Kris: '5c52d09ca61c157ad5d3572c',
		// Marina: '5c599ae87acfc2222892c32c'
	},
	// almost: {
	// 	Love: '5c448ce56dd2794807f67484',
	// 	Kris: '5c519b45a3796f533a12f678'
	// },
	success: {
		Laura: '5c938cbcb7b52f0f7143d067',
		// Love: '5c40748a0962938a10c1761e',
		// Kris: '5c519bafd53bd95e92007589',
		// Marina: '5c599aefa412b12ab3c50dcd'
	},
	fail: {
		Laura: '5c938f92552353853cc0b868',
		// Love: '5c40749811c6847eb255a24c',
		// Kris: '5c519bbfe37472244a349b35',
		// Marina: '5c599af68d2ae576c3bd43e2'
	},
	came: {
		Laura: '5c938d151bc558504d499682',
		// Love: '5c458f7a2079178eb8604a1c',
		// Kris: '5c519bd4e368320cb86860a1',
		// Marina: '5c599afa80c92065602bc134'
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
	'Ессентуки': '197296'
}

// Yclients partner ID
const partnerID = 'hu2x584xzw7y7fy34bg5';

// Yclients user ID
const userID = '7a140112eded9ee20ba43f03406138cf';


// Забиваем сделками из Трелло по столбцам за период
const allData = {
	'5c18f91ce773ab78186d52e2': {
		name: 'Новые лиды',
		data: [],
	},
	'5c938cbcb7b52f0f7143d067': {
		name: "Записанные (Кристина)",
		data: []
	},
	'5c938bd18398a1559edb48da': {
		name: "На перезвон (Лаура)",
		data: []
	},
	'5c938d151bc558504d499682': {
		name: "Пришли (Лаура)",
		data: []
	},
	'5c938f92552353853cc0b868': {
		name: "Не пришли (Лаура)",
		data: []
	}
}

const config = {
	allData,
	managerIds,
	mapperCompanies,
	trelloStates,
	tariff,
	partnerID,
	userID
}

export default config
