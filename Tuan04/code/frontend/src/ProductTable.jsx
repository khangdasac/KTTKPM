import { useEffect, useState } from "react";
import { getProducts, addProduct, deleteProduct, updateProduct } from "./api";
import "./product.css";

function ProductTable() {

    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [editId, setEditId] = useState(null);

    const loadProducts = async () => {
        const res = await getProducts();
        setProducts(res.data);
    }

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAdd = async () => {
        await addProduct({ name, price });
        setName("");
        setPrice("");
        loadProducts();
    }

    const handleDelete = async (id) => {
        await deleteProduct(id);
        loadProducts();
    }

    const handleEdit = (p) => {
        setEditId(p.id);
        setName(p.name);
        setPrice(p.price);
    }

    const handleUpdate = async () => {
        await updateProduct(editId, { name, price });
        setEditId(null);
        setName("");
        setPrice("");
        loadProducts();
    }

    return (

        <div className="container">
            <h2>Product Management</h2>
            <div className="form-box">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Product name"
                />

                <input
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="Price"
                />

                {editId ?
                    <button className="btn update" onClick={handleUpdate}>
                        Update
                    </button>
                    :
                    <button className="btn add" onClick={handleAdd}>
                        Add
                    </button>
                }
            </div>

            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>

                            <td className="action">
                                <button
                                    className="btn edit"
                                    onClick={() => handleEdit(p)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn delete"
                                    onClick={() => handleDelete(p.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProductTable;