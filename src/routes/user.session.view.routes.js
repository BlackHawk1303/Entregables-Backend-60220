import { Router } from "express";
import userProvider from "../dao/db/user.services.js";

const router = Router()
const userManager = new userProvider();

import bcrypt from "bcrypt"
import {validationResult} from "express-validator"
import userModel from "../dao/db/models/user.model.js";

const renderLoginPage = (req, res, pageTitle, metaDescription) => {
    res.render('login', { title: pageTitle, metaDescription });
};


const renderRegisterPage = (req, res, pageTitle, metaDescription) => {
    res.render('register', { title: pageTitle, metaDescription });
};


router.get('/login', async (req, res) => {
    renderLoginPage(req, res, "Inicio de Sesión", "Inicia sesión en nuestro sitio para Acceder a tu Cuenta");
});


router.get('/register', async (req, res) => {
    renderRegisterPage(req, res, "Registro de Nuevo Usuario", "Regístrate en Nuestro sitio para Crear una Nueva Cuenta");
});

router.post('/login', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: "Error", error: "Usuario o Contraseña Incorrecta" });
        }       

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age 
        };

        if (req.session.user.email === "adminCoder@coder.com" || req.session.user.email === "admincoder@coder.com") req.session.user.rol = "ADMIN"
        else req.session.user.rol = "USER"

        console.log(req.session.user)

        res.status(200).json({ status: "Success", payload: req.session.user, message: "Inicio de Sesión Exitoso" });
    } catch (error) {
        console.error("Error al Iniciar Sesión:", error.message);
        res.status(500).json({ status: "Error", message: "Error interno Del Servidor" });
    }
});


router.post('/register', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, email, age, password } = req.body;

    try {
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: "Error", message: "El Usuario ya se Encuentra Registrado" });
        }
        const newUser = new userModel({
            first_name,
            last_name,
            email,
            age,
            password
        });       

        const result = await newUser.save();
        res.status(200).json({ status: "Success", message: "Usuario creado con Exito", user: result });
    } catch (err) {
        console.error("Error al Crear el Usuario:", err.message);
        res.status(500).json({ status: "Error", message: "Error Interno del Servidor" });
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al Cerrar Sesión:", err.message);
            res.status(500).json({ status: "Error", message: "Error Interno del Servidor" });
        } else {
            res.redirect('/login');
        }
    });
});
export default router;
