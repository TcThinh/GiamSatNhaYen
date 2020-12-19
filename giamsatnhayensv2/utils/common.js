const timeNow = () => {
	const date = new Date()
	const year = date.getUTCFullYear()
	const month = date.getUTCMonth()
	const datee = date.getUTCDate()
	const hour = date.getUTCHours()
	const minute = date.getUTCMinutes()
	const second = date.getSeconds()
	const time = new Date(Date.UTC(year, month, datee, hour, minute, second));
	return time.toLocaleString('en-US', { timeZone: "Asia/Bangkok" })
}

module.exports = {
	timeNow
}