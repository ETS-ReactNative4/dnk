import moment from 'moment';

const getState = (props) => ({
	profit: 0,
	choosenCompanyIds: ['170884', '178997', '178998', '150855', '197296'], // YCLIENTS киевская ярик брянск пятигорск ессентуки
	yclientsData: null,
	allTraficRecords: {
		'170884': {
			records: [],
			profit: null,
		},
		'178997': {
			records: [],
			profit: null
		},
		'178998': {
			records: [],
			profit: null
		},
		'150855': {
			records: [],
			profit: null
		},
		'197296': {
			records: [],
			profit: null
		}
	},
	authData: {
		login: props.cookies.get('login') || null,
		password: props.cookies.get('password') || null
	},
	allData: [],
	dayData: [],
	choosenDate: moment(),
	choosenFormattedDate: moment().format('DD/MM/YYYY'),
	choosenTillDate: moment(),
	choosenFormattedTillDate: moment().format('DD/MM/YYYY'),
	selectedAdTypes: ['ВК', 'Instagram'],
	selectedManagers: ['Love', 'Kris', 'Marina'],
	selectedCompanies: ['Киевская', 'Ярославль', 'Брянск', 'Пятигорск', 'Ессентуки'],
	selectedLeads: [], //  name/урлы на выбранный тип карточек при клике
	isLoading: false,
})

export default getState
