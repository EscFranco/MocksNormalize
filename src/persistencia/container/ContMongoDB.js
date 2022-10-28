class ContenedorMongoDB {
    constructor(model) {
        this.model = model
    }

    async getAll() {
        try {
            const docs = await this.model.find({});
            return docs;
        } catch (error) {
            logger.error({ message: `error al obtener los documentos ${error}` });
        }
    }

    async get(id) {
        try {
            const docs = await this.model.findById(id);
            return docs;
        } catch (error) {
            logger.error({ message: `error al obtener el documento ${error}` });
        }
    }


    async saveOne(obj) {
        try {
            return await this.model.collection.insertOne(obj)
        } catch (error) {
            logger.error({ message: `error al subir el documento ${error}` });
        }
    }

    async update(objeto, id) {
        const objetos = await this.getAll();
        const object = objetos.find((obj) => obj._id === id);
        if (object === undefined) {
            logger.error({ message: `error al actualizar el documento, no se encontro el id: ${id}` });
        } else {
            Object.assign(object, objeto);
        }
        try {
            await this.model.replaceOne(
                { _id: id },
                { ...object.toObject() }
            );
        } catch (error) {
            logger.error({ message: `error al actualizar el documento ${error}` });
        }
    }

    async delete(id) {
        try {
            await this.model.deleteOne({
                _id: id,
            });
        } catch (error) {
            logger.error({ message: `error al borrar el documento ${error}` });
        }
    }
}

export default ContenedorMongoDB