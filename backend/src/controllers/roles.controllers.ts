import {Request, Response} from "express";
import {Role} from "../models/roles.models.ts";

class RoleControllers{
    async createRole(req: Request, res: Response){
        try{
            const {name} =req.body;
            if (!name){
                return res.status(400).json({
                    message: "El Nombre es obligatorio"
                });
            };
            const role = await Role.create({name});
            console.log(`Rol creado: ${role.name}`);
            return res.status(201).json(role)
        }catch (error){
            console.error(error);
            return res.status(500).json({
                message: 'Error interno del servidor'
            })
        }
    }
}

export default RoleControllers;