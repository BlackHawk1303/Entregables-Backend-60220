import { Router } from "express"
import bcrypt from "bcrypt"
import { validationResult } from "express-validator"
import userModel from "../dao/db/models/user.model.js"
import passport from 'passport'
import passportLocal from 'passport-local'
import { authToken, validpass, tokenGenerator, HTTP_STATUS, uploader, uploaderArray } from "../utils.js"
import { userLogin, get_User, current_user, premium_change, subirDocumentoUsuario,userLogout } from "../controllers/all.controller.js"
import { authorization } from "../utils.js"


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

router.post("/user/login", userLogin)

router.post('/user/logout', userLogout )

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
    async (req, res) => { });


router.get('/user/current/:userId', authToken, authorization(["user", "premium"]), current_user)

router.get('/user/current/', async (req, res) => {
    res.render('user')
})

router.get('/user/administrator/', async (req, res) => {
    res.render('editProduct')
})

router.get('/api/user/:id', get_User)

router.get('/user/recovery', async (req, res) => {
    res.render('passwordRecovery')
})

router.get('/admin/validator', authToken, authorization(["admin", "premium"]), async (req, res) => {
})

//router.get('/api/user/premium/:uid', premium_change)

router.post('/api/user/premium/:_id', uploaderArray.array("files", 3), premium_change)
router.post('/api/user/:_id/documents', uploader.single('file'), subirDocumentoUsuario)


export default router;
