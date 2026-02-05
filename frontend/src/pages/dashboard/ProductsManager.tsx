import { useEffect, useMemo, useState } from "react";
import type { Book } from "../home/TopSellers";
import Swal from "sweetalert2";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUploadCloud,
  FiX,
  FiSave,
  FiRefreshCw,
  FiImage,
  FiTag,
  FiDollarSign,
} from "react-icons/fi";

type UploadResponse = {
  filename: string;
  url: string;
  message?: string;
};

type ProductForm = {
  title: string;
  description: string;
  newPrice: number | null;
  oldPrice: number | null;
  coverImage: string;
  category: string;
};

const emptyForm: ProductForm = {
  title: "",
  description: "",
  newPrice: null,
  oldPrice: null,
  coverImage: "",
  category: "Business",
};

const PRODUCTS_API = "http://localhost:3000/api/dashboard/products";
const UPLOAD_API = "http://localhost:3000/api/dashboard/uploads/book-cover";

const CATEGORIES = ["Business", "Fiction", "Horror", "Adventure"] as const;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Request failed";
}

const money = (n: number) => n.toFixed(2);

const ProductsManager = () => {
  const [items, setItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const canSubmit = useMemo(() => {
    return (
      form.title.trim().length > 1 &&
      form.description.trim().length > 5 &&
      form.coverImage.trim() &&
      form.category.trim() &&
      form.newPrice !== null &&
      Number.isFinite(form.newPrice) &&
      form.newPrice > 0
    );
  }, [form]);

  const discountPercent = useMemo(() => {
    if (form.newPrice === null) return null;
    if (form.oldPrice === null) return null;
    if (form.oldPrice <= 0) return null;
    if (form.oldPrice <= form.newPrice) return null;
    const pct = ((form.oldPrice - form.newPrice) / form.oldPrice) * 100;
    return Math.round(pct);
  }, [form.newPrice, form.oldPrice]);

  const toast = async (opts: { icon: "success" | "error" | "info"; title: string }) => {
    await Swal.fire({
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
      icon: opts.icon,
      title: opts.title,
    });
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(PRODUCTS_API, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load products");
      setItems(data);
    } catch (err: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: getErrorMessage(err),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setPreviewUrl("");
  };

  const startEdit = (book: Book) => {
    setMode("edit");
    setEditingId(book._id);
    setForm({
      title: book.title,
      description: book.description,
      newPrice: book.newPrice,
      oldPrice: book.oldPrice === book.newPrice ? null : book.oldPrice,
      coverImage: book.coverImage,
      category: book.category,
    });
    setPreviewUrl(book.coverImage ? `http://localhost:3000/uploads/books/${book.coverImage}` : "");
    toast({ icon: "info", title: `Editing: ${book.title}` });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(UPLOAD_API, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: fd,
      });

      if (!res.ok) {
        const errData: { message?: string } = await res.json();
        throw new Error(errData.message || "Upload failed");
      }

      const data: UploadResponse = await res.json();
      setForm((p) => ({ ...p, coverImage: data.filename }));
      setPreviewUrl(`http://localhost:3000${data.url}`);
      toast({ icon: "success", title: "Image uploaded" });
    } catch (err: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: getErrorMessage(err),
      });
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!canSubmit) {
      await Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill required fields (title, description, new price, image, category).",
      });
      return;
    }

    const url =
      mode === "edit" && editingId !== null
        ? `${PRODUCTS_API}/${editingId}`
        : PRODUCTS_API;

    const method = mode === "edit" ? "PUT" : "POST";

    const payload = {
      title: form.title,
      description: form.description,
      newPrice: form.newPrice,
      oldPrice: form.oldPrice,
      coverImage: form.coverImage,
      category: form.category,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Request failed");

      await loadProducts();
      startCreate();
      toast({ icon: "success", title: mode === "edit" ? "Saved" : "Created" });
    } catch (err: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Request failed",
        text: getErrorMessage(err),
      });
    }
  };

  const remove = async (id: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete product?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${PRODUCTS_API}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      setItems((prev) => prev.filter((p) => p._id !== id));
      toast({ icon: "success", title: "Deleted" });
    } catch (err: unknown) {
      await Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: getErrorMessage(err),
      });
    }
  };

  if (loading) return <div className="text-gray-600">Loading products...</div>;

  return (
    <div className="w-full max-w-full overflow-x-hidden max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard · Products</h1>
          <p className="text-sm text-gray-500">
            Create, edit, delete products. Upload cover image and manage prices.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="border rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-gray-50"
            onClick={loadProducts}
          >
            <FiRefreshCw /> Refresh
          </button>

          <button className="btn-primary flex items-center gap-2" onClick={startCreate}>
            <FiPlus /> New product
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2">
            {mode === "create" ? <FiPlus /> : <FiEdit2 />}
            {mode === "create" ? "Add product" : `Edit #${editingId}`}
          </h2>

          {mode === "edit" && (
            <button
              className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
              onClick={startCreate}
            >
              <FiX /> Cancel
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="grid lg:grid-cols-12 gap-4">
            {/* Left: fields */}
            <div className="lg:col-span-8 space-y-4 min-w-0">
              <div className="grid sm:grid-cols-2 gap-3 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="e.g. Atomic Habits"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    className="w-full border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiDollarSign /> New price
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="0.00"
                    value={form.newPrice ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((p) => ({ ...p, newPrice: v === "" ? null : Number(v) }));
                    }}
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiTag /> Old price <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="0.00"
                    value={form.oldPrice ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setForm((p) => ({ ...p, oldPrice: v === "" ? null : Number(v) }));
                    }}
                  />

                  {discountPercent !== null && (
                    <div className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-2 py-1 inline-flex items-center gap-2 mt-2">
                      <span className="font-semibold">Discount:</span> {discountPercent}%
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full border rounded-xl px-3 py-2 min-h-[110px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Short description..."
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Right: upload + preview + actions */}
            <div className="lg:col-span-4 space-y-4 min-w-0">
              <div className="border rounded-2xl p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiUploadCloud className="text-xl" />
                    <span className="text-sm">{form.coverImage ? "Cover selected" : "Upload cover"}</span>
                  </div>

                  <label className="inline-flex items-center gap-2 border rounded-xl px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <FiImage />
                    <span className="text-sm">{uploading ? "Uploading..." : "Choose"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadCover(f);
                      }}
                    />
                  </label>
                </div>

                <div className="mt-3">
                  {previewUrl ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="h-20 w-20 object-contain border rounded-xl bg-white flex-shrink-0"
                      />
                      <div className="text-xs text-gray-500 min-w-0">
                        <div>Saved as:</div>
                        <div className="font-mono break-all">{form.coverImage}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No preview yet.</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                <button
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={!canSubmit || uploading}
                  onClick={submit}
                >
                  {mode === "create" ? <FiPlus /> : <FiSave />}
                  {mode === "create" ? "Create" : "Save"}
                </button>

                <button
                  className="border rounded-xl px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
                  onClick={startCreate}
                >
                  <FiX /> Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products grid (NEW DESIGN) */}
      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h2 className="font-semibold">Products</h2>
          <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-700">{items.length}</span>
          </div>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-gray-500">No products yet</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((b) => {
                const imgUrl = b.coverImage
                  ? `http://localhost:3000/uploads/books/${b.coverImage}`
                  : "";

                const hasDiscount = b.oldPrice > b.newPrice;

                return (
                  <div
                    key={b._id}
                    className="border rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white min-w-0"
                  >
                    <div className="p-3 flex gap-3 min-w-0">
                      <div className="h-20 w-20 rounded-xl border bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                        {imgUrl ? (
                          <img src={imgUrl} alt={b.title} className="h-full w-full object-contain" />
                        ) : (
                          <FiImage className="text-gray-400 text-2xl" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{b.title}</div>
                            <div className="mt-1 inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                              <FiTag /> {b.category}
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="font-bold">${money(b.newPrice)}</div>
                            {hasDiscount ? (
                              <div className="text-xs text-gray-400 line-through">${money(b.oldPrice)}</div>
                            ) : (
                              <div className="text-xs text-gray-400">No discount</div>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                          {b.description}
                        </div>
                      </div>
                    </div>

                    <div className="px-3 pb-3">
                      <div className="flex gap-2">
                        <button
                          className="flex-1 inline-flex items-center justify-center gap-2 border rounded-xl px-3 py-2 hover:bg-gray-50"
                          onClick={() => startEdit(b)}
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          className="flex-1 inline-flex items-center justify-center gap-2 border rounded-xl px-3 py-2 hover:bg-gray-50"
                          onClick={() => remove(b._id)}
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>

                    <div className="px-3 pb-3 text-[11px] text-gray-400">
                      ID: {b._id}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsManager;