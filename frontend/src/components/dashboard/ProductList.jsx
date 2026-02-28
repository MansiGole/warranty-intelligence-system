import { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addWarranty = async (productId) => {
  const months = prompt("Warranty months?");
  const purchase = prompt("Purchase date (YYYY-MM-DD)");

  const res = await fetch("http://localhost:5000/api/warranties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({
      product_id: productId,
      duration_months: Number(months),
      purchase_date: purchase
    })
  });

  const data = await res.json();
  alert(data.message);
};

const status = getWarrantyStatus(product.expiry_date);

<span
  className={
    status === "expired"
      ? "bg-red-500 text-white px-2 py-1 rounded"
      : status === "urgent"
      ? "bg-yellow-500 text-white px-2 py-1 rounded"
      : status === "warning"
      ? "bg-orange-400 text-white px-2 py-1 rounded"
      : "bg-green-500 text-white px-2 py-1 rounded"
  }
>
  {status.toUpperCase()}
</span>


  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Your Products</h2>

      {products.map((p) => (
        <div key={p.id} className="border p-3 mb-2 rounded">
        <p className="font-bold">{p.name}</p>
        <p>{p.brand}</p>

        <button
            onClick={() => addWarranty(p.id)}
            className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
        >
            Add Warranty
        </button>
        </div>
      ))}
    </div>
  );
}
