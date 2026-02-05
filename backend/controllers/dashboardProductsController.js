const { pool } = require("../src/db/postgres");

const normalizePrice = (value) => {
    if (typeof value !== "number" || !Number.isFinite(value)) return null;
    return Number(value.toFixed(2));
  };
// helper: map DB row -> frontend Book shape
const toBook = (row) => ({
  _id: row.id,
  title: row.title,
  description: row.description,
  newPrice: Number(row.newPrice),
  oldPrice: row.oldPrice === null
  ? Number(row.newPrice)
  : Number(row.oldPrice),
  coverImage: row.coverImage,
  category: row.category,
});

const listProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, "newPrice", "oldPrice", "coverImage", category FROM "Products" ORDER BY id DESC'
    );
    res.json(result.rows.map(toBook));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

const getProduct = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const result = await pool.query(
      'SELECT id, title, description, "newPrice", "oldPrice", "coverImage", category FROM "Products" WHERE id=$1',
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Not found" });
    res.json(toBook(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

const createProduct = async (req, res) => {
  const { title, description, newPrice, oldPrice, coverImage, category } = req.body;
  const newPriceValue = normalizePrice(newPrice);
const oldPriceValue = normalizePrice(oldPrice);

if (
  typeof title !== "string" || !title.trim() ||
  typeof description !== "string" || !description.trim() ||
  typeof coverImage !== "string" || !coverImage.trim() ||
  typeof category !== "string" || !category.trim() ||
  newPriceValue === null
) {
  return res.status(400).json({ message: "Invalid product data" });
}

  try {
    const result = await pool.query(
      `INSERT INTO "Products"(title, description, "newPrice", "oldPrice", "coverImage", category)
VALUES($1,$2,$3,$4,$5,$6)
       RETURNING id, title, description, "newPrice", "oldPrice", "coverImage", category`,
      [title.trim(), description.trim(), newPriceValue, oldPriceValue, coverImage.trim(), category.trim()]
    );

    res.status(201).json(toBook(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

const updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid id" });

  const { title, description, newPrice, oldPrice, coverImage, category } = req.body;
  const newPriceValue = normalizePrice(newPrice);
const oldPriceValue = normalizePrice(oldPrice);

if (
  typeof title !== "string" || !title.trim() ||
  typeof description !== "string" || !description.trim() ||
  typeof coverImage !== "string" || !coverImage.trim() ||
  typeof category !== "string" || !category.trim() ||
  newPriceValue === null
) {
  return res.status(400).json({ message: "Invalid product data" });
}

  try {
    const result = await pool.query(
      `UPDATE "Products"
       SET title=$1, description=$2, "newPrice"=$3, "oldPrice"=$4, "coverImage"=$5, category=$6
       WHERE id=$7
       RETURNING id, title, description, "newPrice", "oldPrice", "coverImage", category`,
      [title.trim(), description.trim(), newPriceValue, oldPriceValue, coverImage.trim(), category.trim(), id]
    );

    if (!result.rows.length) return res.status(404).json({ message: "Not found" });
    res.json(toBook(result.rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const result = await pool.query('DELETE FROM "Products" WHERE id=$1 RETURNING id', [id]);
    if (!result.rows.length) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };