const getListMessagePasswordValidator = (list) => {
    // max list [ 'min', 'max', 'uppercase', 'lowercase', 'digits' ]
    const messages = []
    list.forEach(err => {
        if (err === 'min') messages.push({ msg: 'Password should be at least 8 characters' })
        if (err === 'max') messages.push({ msg: 'Maximum password should be 40 characters' })
        if (err === 'uppercase') messages.push({ msg: 'Password should be include uppercase characters' })
        if (err === 'lowercase') messages.push({ msg: 'Password should be include lowercase characters' })
        if (err === 'digits') messages.push({ msg: 'Password should be include digits' })
    })
    return messages;
}

module.exports = {
    getListMessagePasswordValidator
}