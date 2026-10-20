import { Books } from "../models/book.models.js";
export class BookRepository {
    findAll() {
        return Books.findAll({ order: [["id", "ASC"]] });
    }
    findById(id) {
        return Books.findByPk(id);
    }
    create(data) {
        return Books.create(data);
    }
    async update(id, data) {
        const book = await this.findById(id);
        if (!book) {
            return null;
        }
        await book.update(data);
        return book;
    }
    async changeStatus(id, status) {
        const book = await this.findById(id);
        if (!book) {
            return null;
        }
        const previousStatus = book.status;
        await book.update({ status });
        return { book, previousStatus };
    }
    async delete(id) {
        const book = await this.findById(id);
        if (!book) {
            return false;
        }
        await book.destroy();
        return true;
    }
}
//# sourceMappingURL=BookRepository.js.map