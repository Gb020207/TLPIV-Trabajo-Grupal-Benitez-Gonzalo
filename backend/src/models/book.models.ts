import { Model,Optional,DataType,Sequelize } from "sequelize";
export type BookStatus=
    "DISPONIBLE"
    "PRESTADO"
    "EN_REPARACION"
interface BooksAttributes{
    id:number;
    title:string;
    description: string;
    status: BookStatus;
}

export class Books{
    
}