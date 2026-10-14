import type {Request, Response} from "express";
import {Suscription} from "../models/suscription.models.js";

interface CreateSuscriptionBody{
    userId: number,
    bookId: number
}
class SuscriptionControllers{
    async createSuscription(req: Request<{}, {}, CreateSuscriptionBody>, res: Response){
        try{
            const {userId} =req.body;
            if (!userId || typeof userId !== "number"){
                return res.status(400).json({
                    message: "El Id del Usuario es obligatorio"
                });
            };
            const {bookId} = req.body;
            if (!bookId || typeof bookId !== "number"){
                return res.status(400).json({
                    message: "El Id del Libro es importante"
                })
            };
            const suscription = await Suscription.create({userId: Number});
            console.log(`Suscripcion creada: ${suscription.userId}`);
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