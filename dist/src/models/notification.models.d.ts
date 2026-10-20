import { Model, Sequelize } from "sequelize";
import type { Optional } from "sequelize";
interface NotificationAtrributes {
    id: number;
    userId: number;
    bookId: number;
    message: string;
    read: boolean;
}
interface NotificationCreationAtrributes extends Optional<NotificationAtrributes, "id" | "read"> {
}
export declare class Notification extends Model<NotificationAtrributes, NotificationCreationAtrributes> implements NotificationAtrributes {
    id: number;
    userId: number;
    bookId: number;
    message: string;
    read: boolean;
    static initialize(sequelize: Sequelize): void;
}
export {};
//# sourceMappingURL=notification.models.d.ts.map