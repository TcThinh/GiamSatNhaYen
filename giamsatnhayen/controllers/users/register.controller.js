const passwordValidator = require('password-validator')

//Handle register request ( check )
function checkRegister(req, res, next) {

    const { name, email, pass, re_pass } = req.body
    let errors = []

    // Check required fields
    if (!name || !email || !pass || !re_pass) {
        errors.push({ msg: 'Please fill in all fields' })
        return res.render('auth/register.ejs', {
            name,
            email,
            pass,
            re_pass,
            errors
        })
    }

    // Check passwords match 
    if (pass !== re_pass) {
        errors.push({ msg: 'Passwords do not match' })
        return res.render('auth/register.ejs', {
            name,
            email,
            pass,
            re_pass,
            errors
        })
    }

    //Validate password
    const schema = new passwordValidator()
    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        .has().uppercase() // Must have uppercase letters
        .has().lowercase() // Must have lowercase letters
        .has().digits() // Must have digits
        .has().not().spaces() // Should not have spaces
        // .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    // Get error messages  from password validator
    errors = errors.concat(require('../../utils/users.util')
        .getListMessagePasswordValidator(schema.validate(pass, { list: true })))
    if (errors.length > 0) {
        return res.render('auth/register.ejs', {
            name,
            email,
            pass,
            re_pass,
            errors
        })
    }
    next() //next middleware
}

function storingDatabase(req, res, next) {
    res.send('your now registered')
}

module.exports = {
    checkRegister,
    storingDatabase
}