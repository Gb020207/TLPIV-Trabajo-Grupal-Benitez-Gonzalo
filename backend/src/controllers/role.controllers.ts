import type {Request, Response} from "express";
import {RolePermission} from "../models/role.models.js"

interface CreateRolPermissionBody{
    roleId: number;
    permissionId: number;
}

class RolePermissionControllers{
    async createRolePermission(req: Request<{}, {}, CreateRolPermissionBody>, res: Response){
        try{
            const {roleId, permissionId} =req.body;
            if (!roleId || typeof roleId !== "number"){
                return res.status(400).json({
                    message: "El ID del rol es obligatorio"
                });
            };
            if (!permissionId || typeof permissionId !== "number"){
                return res.status(400).json({
                    message: "El permissionId es obligatorio"
                });
            }
            const roleId = await RoleId.create({role: name.trim()});
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