import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ShoppingCart,
  Package,
  AlertTriangle,
  Trash2,
  Pencil,
  X,
  CheckCircle,
} from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import { mockProducts, mockCategories, mockSales } from "../../data/mockData";

const tabs = ["Products", "Point of Sale", "Sales History"];

const stockStatus = (stock) => {
  if (stock === 0)
    return {
      label: "Out of Stock",
      style: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
    };
  if (stock <= 5)
    return {
      label: "Low Stock",
      style:
        "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
    };
  return {
    label: "In Stock",
    style: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  };
};

function Inventory() {
  const [activeTab, setTab] = useState("Products");
  const [search, setSearch] = useState("");
  const [selectedCat, setCat] = useState("All");
  const [products, setProducts] = useState(mockProducts);
  const [sales, setSales] = useState(mockSales);
  const [basket, setBasket] = useState([]);
  const [buyer, setBuyer] = useState("");
  const [method, setMethod] = useState("Cash");
  const [orderDone, setOrderDone] = useState(false);

  const categories = ["All", ...mockCategories.map((c) => c.name)];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === "All" || p.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [search, selectedCat, products]);

  const summary = useMemo(
    () => ({
      total: products.length,
      inStock: products.filter((p) => p.stock > 5).length,
      lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
    }),
    [products],
  );

  const basketTotal = useMemo(() => {
    return basket.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [basket]);

  const addToBasket = (product) => {
    if (product.stock === 0) return;
    setBasket((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromBasket = (id) =>
    setBasket((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setBasket((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const handleCheckout = () => {
    if (basket.length === 0) return;
    const newSale = {
      id: sales.length + 1,
      buyer: buyer || "Walk-in",
      items: basket.map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.salePrice,
      })),
      total: basketTotal,
      method,
      date: new Date().toISOString().split("T")[0],
    };
    setSales((prev) => [newSale, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        const item = basket.find((i) => i.id === p.id);
        return item ? { ...p, stock: p.stock - item.qty } : p;
      }),
    );
    setBasket([]);
    setBuyer("");
    setOrderDone(true);
    setTimeout(() => setOrderDone(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory & POS"
        subtitle="Manage products, stock and point of sale"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Add Product
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Products",
            value: summary.total,
            bg: "bg-blue-50 dark:bg-blue-950",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "In Stock",
            value: summary.inStock,
            bg: "bg-green-50 dark:bg-green-950",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "Low Stock",
            value: summary.lowStock,
            bg: "bg-amber-50 dark:bg-amber-950",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Out of Stock",
            value: summary.outOfStock,
            bg: "bg-red-50 dark:bg-red-950",
            text: "text-red-600 dark:text-red-400",
          },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-semibold ${card.text}`}>
              {card.value}
            </p>
            <p className={`text-xs ${card.text} opacity-75 mt-1`}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setTab(tab);
              setSearch("");
            }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-accent text-white"
                : "text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-hover dark:hover:bg-dark-hover"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === "Products" && (
        <>
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
                />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      selectedCat === c
                        ? "bg-accent text-white border-accent"
                        : "bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border">
              {[
                "Product",
                "Code",
                "Category",
                "Purchase",
                "Sale Price",
                "Stock",
                "Actions",
              ].map((h) => (
                <span
                  key={h}
                  className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
                >
                  {h}
                </span>
              ))}
            </div>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const status = stockStatus(product.stock);
                return (
                  <div
                    key={product.id}
                    className="grid grid-cols-7 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package size={13} className="text-accent" />
                      </div>
                      <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                      {product.code}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium w-fit">
                      {product.category}
                    </span>
                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      Rs {product.purchasePrice}
                    </span>
                    <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      Rs {product.salePrice}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-medium w-fit ${status.style}`}
                    >
                      {product.stock === 0
                        ? status.label
                        : `${product.stock} — ${status.label}`}
                    </span>
                    <div className="flex gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-amber-50 dark:hover:bg-amber-950 hover:text-amber-600 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Package
                  size={22}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
                <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm">
                  No products found
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* POS Tab */}
      {activeTab === "Point of Sale" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products grid */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary text-sm outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const status = stockStatus(product.stock);
                const inBasket = basket.find((i) => i.id === product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => addToBasket(product)}
                    disabled={product.stock === 0}
                    className={`bg-light-card dark:bg-dark-card border rounded-xl p-4 text-left transition-all ${
                      product.stock === 0
                        ? "opacity-50 cursor-not-allowed border-light-border dark:border-dark-border"
                        : inBasket
                          ? "border-accent bg-accent/5"
                          : "border-light-border dark:border-dark-border hover:border-accent"
                    }`}
                  >
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                      <Package size={15} className="text-accent" />
                    </div>
                    <p className="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary mb-1 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm font-bold text-accent">
                      Rs {product.salePrice}
                    </p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-md font-medium mt-1 inline-block ${status.style}`}
                    >
                      {product.stock === 0 ? "Out" : `${product.stock} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basket */}
          <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-5 flex flex-col gap-4 h-fit">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary flex items-center gap-2">
                <ShoppingCart size={16} className="text-accent" />
                Basket
              </h3>
              {basket.length > 0 && (
                <button
                  onClick={() => setBasket([])}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {basket.length > 0 ? (
              <>
                <div className="flex flex-col gap-2">
                  {basket.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                          Rs {item.salePrice} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-5 h-5 rounded bg-light-hover dark:bg-dark-hover text-light-text-secondary dark:text-dark-text-secondary text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-medium text-light-text-primary dark:text-dark-text-primary w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-5 h-5 rounded bg-light-hover dark:bg-dark-hover text-light-text-secondary dark:text-dark-text-secondary text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-semibold text-light-text-primary dark:text-dark-text-primary w-16 text-right">
                        Rs {item.salePrice * item.qty}
                      </span>
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-light-border dark:border-dark-border pt-3 flex flex-col gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                      Total
                    </span>
                    <span className="text-sm font-bold text-accent">
                      Rs {basketTotal}
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Buyer name (optional)"
                    value={buyer}
                    onChange={(e) => setBuyer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  />
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-light-text-primary dark:text-dark-text-primary text-sm outline-none focus:border-accent transition-colors"
                  >
                    {["Cash", "Card", "Bank Transfer"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleCheckout}
                    className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      orderDone
                        ? "bg-green-500"
                        : "bg-accent hover:bg-accent-hover"
                    }`}
                  >
                    {orderDone ? (
                      <>
                        <CheckCircle size={15} /> Order Complete!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={15} /> Complete Order
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <ShoppingCart
                  size={28}
                  className="text-light-text-tertiary dark:text-dark-text-tertiary"
                />
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  Basket is empty
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                  Click products to add
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sales History Tab */}
      {activeTab === "Sales History" && (
        <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border">
            {["Buyer", "Items", "Total", "Method", "Date"].map((h) => (
              <span
                key={h}
                className="text-xs font-medium text-light-text-tertiary dark:text-dark-text-tertiary uppercase tracking-wide"
              >
                {h}
              </span>
            ))}
          </div>
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="grid grid-cols-5 px-4 py-3 border-b border-light-border dark:border-dark-border last:border-0 hover:bg-light-hover dark:hover:bg-dark-hover transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-medium flex-shrink-0">
                  {sale.buyer.charAt(0)}
                </div>
                <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                  {sale.buyer}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {sale.items.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs text-light-text-secondary dark:text-dark-text-secondary"
                  >
                    {item.name} × {item.qty}
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-accent">
                Rs {sale.total}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent font-medium w-fit">
                {sale.method}
              </span>
              <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {sale.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;
