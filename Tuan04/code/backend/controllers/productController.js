const service = require("../services/productService");

module.exports = {

    getAll: async (req, res) => {
        const data = await service.getAll();
        res.json(data);
    },

    create: async (req, res) => {
        await service.create(req.body);
        res.json({message:"created"});
    },

    update: async (req, res) => {
        await service.update(req.params.id, req.body);
        res.json({message:"updated"});
    },

    delete: async (req, res) => {
        await service.delete(req.params.id);
        res.json({message:"deleted"});
    }
};