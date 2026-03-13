const repo = require("../repositories/productRepository");

module.exports = {

    getAll: async () => {
        return await repo.findAll();
    },

    create: async (product) => {
        await repo.create(product);
    },

    update: async (id, product) => {
        await repo.update(id, product);
    },

    delete: async (id) => {
        await repo.delete(id);
    }
};