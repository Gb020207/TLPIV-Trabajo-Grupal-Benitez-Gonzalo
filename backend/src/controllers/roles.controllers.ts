import type {Request, Response} from "express";
import {Role} from "../models/roles.models.js";

interface CreateRoleBody{
    name: string
}
class RoleControllers{
    async createRole(req: Request<{}, {}, CreateRoleBody>, res: Response){
        try{
            const {name} =req.body;
            if (!name || typeof name !== "string" || name.trim() === ""){
                return res.status(400).json({
                    message: "El Nombre es obligatorio"
                });
            };
            const role = await Role.create({name: name.trim()});
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