import { useEffect, useMemo, useState } from "react";
import AllBookCard from "../books/AllBookCard";
import type { Book } from "../home/TopSellers";

const PRODUCTS_API = "http://localhost:3000/api/products";

type ApiError = { message?: string };



function isApiError(v: unknown): v is ApiError {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return o.message === undefined || typeof o.message === "string";
}

function isBook(v: unknown): v is Book {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o._id === "number" &&
    typeof o.title === "string" &&
    typeof o.description === "string" &&
    typeof o.newPrice === "number" &&
    typeof o.oldPrice === "number" &&
    typeof o.coverImage === "string" &&
    typeof o.category === "string"
  );
}

function isBookArray(v: unknown): v is Book[] {
  return Array.isArray(v) && v.every(isBook);
}

const categories = ["All", "Business", "Fiction", "Horror", "Adventure"] as const;

const AllTableJsonBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(PRODUCTS_API);

        const raw: unknown = await res.json();

        if (!res.ok) {
          const message =
            isApiError(raw) && raw.message ? raw.message : "Failed to load products from DB";
          throw new Error(message);
        }

        if (!alive) return;

        setBooks(isBookArray(raw) ? raw : []);
      } catch (e: unknown) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Load failed");
        setBooks([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    if (selectedCategory === "All") return books;
    return books.filter(
      (b) => b.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [books, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-semibold">All books</h2>
          <p className="text-sm text-gray-500 mt-1">Source: PostgreSQL (Products)</p>

          {error && (
            <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Failed to load DB products: {error}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as (typeof categories)[number])
            }
            className="border bg-[#EAEAEA] border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-semibold text-gray-700">{filteredBooks.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading books...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <AllBookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllTableJsonBooks;