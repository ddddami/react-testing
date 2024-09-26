import { http, HttpResponse } from "msw";
import { products } from "./data";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics", price: 10 },
      { id: 2, name: "Beauty", price: 99 },
      { id: 3, name: "Groceries", price: 4.9 },
    ]);
  }),

  http.get("/products", () => {
    return HttpResponse.json(products);
  }),

  // NOTE:  this
  http.get("/products/:id", ({ params }) => {
    const id = params.id as string;

    const product = products.find((p) => p.id === parseInt(id));
    if (!product) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(product);
  }),
];
