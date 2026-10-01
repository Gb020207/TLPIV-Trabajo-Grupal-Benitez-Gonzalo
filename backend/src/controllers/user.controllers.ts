import type {Request, Response} from "express";
import {User} from "../models/user.models.js";
import {Role} from "../models/roles.models.js"

interface CreateUserBody{
    name: string;
    email: string;
    password: string;
}

class UserControllers{
    async createUser(req: Request<{}, {}, CreateUserBody>, res: Response){
        try{
            const {name, email, password} =req.body;
            if (!name || typeof name !== "string" || name.trim() === ""){
                return res.status(400).json({
                    message: "El Nombre es obligatorio"
                });
            };
            if (!email || typeof email !== "string" || email.trim() ===""){
                return res.status(400).json({
                    message: "El Email es obligatorio"
                });
            }
            if (!password || typeof password !== "string" || password.trim() ===""){
                return res.status(400).json({
                    message: "La Contraseña es obligatoria"
                });
            }
            const role = await Role.findOne({
                where: {name: "USER"}
            })
            if (!role){
                return res.status(500).json({
                    message: "Rol USER no configurado"
                })
            }
            const user = await User.create({
                name: name.trim(),
                email: email.trim(),
                password,
                roleId: role.id
            });
            console.log(`Usuario creado: ${user.name}`);
            return res.status(201).json(user)
        }catch (error){
            console.error(error);
            return res.status(500).json({
                message: 'Error interno del servidor'
            })
        }
    }
}

export default UserControllers;