const regex = /Android|webOS|iPhone|iP[ao]d|BlackBerry|Win(dows )?Phone/i

const isMobile = () => {
	if (typeof window === 'undefined' || !window.navigator) return false

	const { userAgent } = window.navigator

	if (!userAgent) {
		return false
	}

	return regex.test(userAgent)
}

export default isMobile()
