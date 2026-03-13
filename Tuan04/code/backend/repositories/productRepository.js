const pool = require("../config/db");

module.exports = {

    findAll: async () => {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM product");
        conn.release();
        return rows;
    },

    create: async (product) => {
        const conn = await pool.getConnection();
        await conn.query(
            "INSERT INTO product(name,price) VALUES (?,?)",
            [product.name, product.price]
        );
        conn.release();
    },

    update: async (id, product) => {
        const conn = await pool.getConnection();
        await conn.query(
            "UPDATE product SET name=?, price=? WHERE id=?",
            [product.name, product.price, id]
        );
        conn.release();
    },

    delete: async (id) => {
        const conn = await pool.getConnection();
        await conn.query(
            "DELETE FROM product WHERE id=?",
            [id]
        );
        conn.release();
    }
};