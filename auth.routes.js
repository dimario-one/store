const { Router } = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const router = Router();
const jwt = require("jsonwebtoken");
const config = require("config");

router.post(
    "/login",
    [
        check("email", "Введите корректный email").normalizeEmail().isEmail(),
        check("password", "Введите пароль").exists(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при входе в систему",
                });
            }
            const { email, password } = req.body;
   
            const user = await User.findOne({ email: email });
            // Если нет такого пользователя должны выдать ошибку
            if (!user) {
                return res
                    .status(400)
                    .json({ message: "Пользователь не существует" });
            }
            //  Проверка совпадают ли
            const isMatched = await (password, user.password);
            if (!isMatched) {
                return res.status(400).json({ message: "Неверный пароль" });
            }
            //  Создаем токен
            const token = jwt.sign(
                {userId:user.id},
                config.get("jwtSecretKey"),
                // третий параметр это время жизни токена
                {expiresIn:"1h"}
            );
            res.json({token,userId:user.id});
        } catch (error) {
            res.status(500).json({ message: "Что то пошло не так" });
        }
    }
)
router.post(
    "/register",
    [
        check("email", "Некорректный email").isEmail(),
        check("password", "Минимальная длина пароля 6 символов").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные при регистрации",
                });
            }
            const { email, password } = req.body;
            const candidate = await User.findOne({ email });
            if (candidate) {
                return res
                    .status(400)
                    .json({ message: "Пользователь уже существует" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: "Пользователь создан" });
        } catch (error) {
            res.status(500).json({ message: "Что то пошло не так Register"});
        }
    }
)



module.exports = router;
