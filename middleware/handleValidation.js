const {validationResult} = require("express-validator")

const validate = (req, res, next) =>{
    const erros = validationResult(req)

    if(erros.isEmpty()){
        return next()
    }

    const extractedErrors = []

    erros.array().map((err)=>extractedErrors.push(err.msg))


    return res.status(422).json({
        errors: extractedErrors
    })

}

module.exports = validate;