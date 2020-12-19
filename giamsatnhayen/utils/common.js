const last = (array, number) => { // get number item last array
    if (array === undefined || number > array.length)
        return undefined
    const _array = array;
    const result = []
    let index = array.length - 1;
    for (let i = 0; i < number; i++) {
        result.push(_array[index--])
    }
    return result
}

const clone = (any) => {
    if(any == undefined) return undefined;
    return JSON.parse(JSON.stringify(any))
}

const average = (array) => {
    if (array.length == 0) return 0;
    let sum = 0;
    array.forEach(e => {
        sum += e
    })
    return sum / array.length
}

const amountDate = async(month, year) => {
    if (month < 0 || month > 12 || year < 0) return -1
    if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) != -1) return 31
    if ([4, 6, 9, 11].indexOf(month) != -1) return 30
    return leapYear(month) ? 29 : 28
}

const leapYear = (year) => {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

const nearestAmountDates = async(amount, time) => {
    const split = time.split('/')
    let date = parseInt(split[1])
    let month = parseInt(split[0])
    let year = parseInt(split[2])
    const result = []
    for (let i = 1; i <= amount; ++i) {
        if (--date == 0) {
            --month
            if (month == 0) {
                month = 12
                    --year
            }
            date = await amountDate(month)
        }
        result.push(`${month}/${date}/${year}`)
    }
    return result
}

const timeNow = async() => {
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
    last,
    clone,
    average,
    nearestAmountDates,
    timeNow
}