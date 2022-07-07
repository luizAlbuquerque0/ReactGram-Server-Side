const { body } = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name")
            .isString()
            .withMessage("O nome é obrigatorio")
            .isLength({ min: 3 })
            .withMessage("O nome deve ter no min 3 caracteres"),
        body("email")
            .isString()
            .withMessage("O email é obrigatorio")
            .isEmail()
            .withMessage("Insira um email válido"),
        body("password")
            .isString()
            .withMessage("A senha é obrigatoria")
            .isLength({ min: 5 })
            .withMessage("A senha deve conter no mínimo 5 caracteres"),
        body("confirmPassword")
            .isString()
            .withMessage("A confirmação de senha é obrigatoria")
            .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("As senhas não são iguais");
                }
                return true;
            }),
    ];
};

const loginValidation = () => {
    return [
        body("email")
            .isString()
            .withMessage("O email é obrigatório")
            .isEmail()
            .withMessage("Insira um email válido"),
        body("password").isString().withMessage("A senha é obrigatória"),
    ];
};

const userUpdateValidation = () => {
    return [
        body("name")
            .optional()
            .isLength({ min: 3 })
            .withMessage("Nome precisa de pelo menos 3 caracteres"),
        body("password")
            .optional()
            .isLength({ min: 5 })
            .withMessage("A senha percisa ter no mininmo 5 caracteres"),
    ];
};

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
};
