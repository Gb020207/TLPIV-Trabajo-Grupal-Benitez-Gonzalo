import type {Request, Response} from "express";
import { Books } from "../models/book.models.js";

interface CreateBookBody{
    title: string;
    description: string
}

class BookControllers{
    async createBook(req: Request<{}, {}, CreateBookBody>, res: Response){
        try{
            const {title, description} =req.body;
            if (!title || typeof title !== "string" || title.trim() === ""){
                return res.status(400).json({
                    message: "El Titulo del libro es obligatorio"
                });
            };
            if (!description || typeof description !== "string" || description.trim() ===""){
                return res.status(400).json({
                    message: "La Descripcion del libro es Obligatoria"
                })
            }
            const book = await Books.create({
                title: title.trim(),
                description: description.trim()
            });
            console.log(`Rol creado: ${book.title}`);
            return res.status(201).json(book)
        }catch (error){
            console.error(error);
            return res.status(500).json({
                message: 'Error interno del servidor'
            })
        }
    }
}

export default BookControllers;