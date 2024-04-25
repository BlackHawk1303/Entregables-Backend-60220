import { Router } from "express";
// import userProvider from "../dao/db/user.services.js";
import bcrypt from "bcrypt"
import {validationResult} from "express-validator"
import userModel from "../dao/db/models/user.model.js";
import passport from 'passport';
import passportLocal from 'passport-local';
import { authToken , validpass, tokenGenerator, HTTP_STATUS} from "../utils.js";
import { userLogin } from "../controllers/all.controller.js";

const router = Router()
// const userManager = new userProvider();

const renderLoginPage = (req, res, pageTitle, metaDescription) => {
    res.render('login', { title: pageTitle, metaDescription });
};


const renderRegisterPage = (req, res, pageTitle, metaDescription) => {
    res.render('register', { title: pageTitle, metaDescription });
};


router.get('/login', async (req, res) => {
    renderLoginPage(req, res, "Inicio de Sesión", "Inicia Sesión en Nuestro Sitio para Acceder a tu Cuenta");
});


router.get('/register', async (req, res) => {
    renderRegisterPage(req, res, "Registro de Nuevo Usuario", "Regístrate en Nuestro sitio para Crear una Nueva Cuenta");
});

router.post("/user/register", passport.authenticate('register', { failureRedirect: '/user/register/error' }),
    async (req, res) => {
        res.status(201).json({ status: "success", message: "Usuario Creado Exitosamente" });
    });
    
// router.post("/user/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await userManager.findUser({ email });

//         if (user.length === 0) {
//             return res.status(HTTP_STATUS.NOT_FOUND).send({ error: "Usuario no Encontrado", message: "Usuario o Contraseña Incorrectos" });
//         }
//         if (!validpass(user, password)) {
//             return res.status(HTTP_STATUS.UNAUTHORIZED).send({ error: "Acceso no Autorizado", message: "Usuario o Contraseña Incorrectos" });
//         }
//         const tokenData = {
//             name: `${user.first_name} ${user.last_name}`,
//             email: user.email,
//             age: user.age,
//             role: user.role
//         };

//         const token = tokenGenerator(tokenData);
//         console.log(token)
//         res.send({ message: "Inicio de Sesión Satisfactorio", token, id: user._id });
//     } catch (error) {
//         console.error("Error al Iniciar Sesión:", error);
//         res.status(HTTP_STATUS.SERVER_ERROR).send({ status: "error", error: "Error Interno de la Aplicación." });
//     }
// });
router.post("/user/login", userLogin)

router.get('/user/logout', (req, res) => {
    req.logout(err => {
        req.session.destroy(error => {
            return res.redirect('/login')
        })
    })
})

router.get("/user/register/error", (req, res) => {
    res.status(401).json({ error: "Error al Registrar el Usuario" });
});

router.get("/user/login/error", (req, res) => {
    res.status(401).json({ error: "Error al Iniciar Sesión" });
});

router.get('/user/githubCallback', passport.authenticate('github', { failureRedirect: '/user/github/error' }),
    async (req, res) => {
        const user = req.user;

        const user_name = `${user.first_name} ${user.last_name}`;
        req.session.user = {
            name: user_name,
            email: user.email,
            age: user.age,
            rol: user.email === "adminCoder@coder.com" ? "admin" : "user"
        };
        //res.json({ status: "success", payload: req.session.user });
        res.redirect("/products")
    });

router.get('/user/github', passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => {});


router.get('/user/current/:userId', authToken, async (req, res) => {
    res.send(req.user)
})

router.get('/user/current/', async (req, res) => {
    res.render('user')    
})

export default router;
