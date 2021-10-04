const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/jwt');


const newUser = async (req, res = response) => {

    const {email} = req.body;

    try{
        const doesEmailExists = await User.findOne({email});
        if(doesEmailExists) {
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado"
            });
        }
        
        const user = new User(req.body)

        // Encriptar contraseñas
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);

        // Generar mi JWT
        const token = await generarJWT(user.id);


    
        await user.save();
    
        res.json({
            ok: true,
            user,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}

const login = async (req, res = response) => {

    const { email, password} = req.body;

    try {

        const userDB = await User.findOne({email});
        if(!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el password
        const validPassword = bcrypt.compareSync(password, userDB.password);

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        // Generar el JWT
        const token = await generarJWT(userDB.id);

        res.json({
            ok: true,
            user: userDB,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }

}

const renewToken = async (req, res = response) => {
  
    // const uid uid del usuario
    const  uid  = req.uid;



    // generar un nuevo JWT, generarJWT
    const token = await generarJWT(uid);
    console.log('token: ' + token);


    //Obtener el usuario por el UID, Usuario.findById
    const userDB = await User.findById(uid);
    if(!userDB) {
        return res.status(404).json({
            ok: false,
            msg: 'Usuario no encontrado'
        });
    }



    res.json({
        ok: true,
        user: userDB,
        token
        
    });
        
   
}

module.exports = {
    newUser, 
    login,
    renewToken
}