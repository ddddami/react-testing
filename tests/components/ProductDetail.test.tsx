import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create({ name: "product 1" });
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });
    render(<ProductDetail productId={productId} />);

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(
      http.get("/products/1", () => {
        return HttpResponse.json(null);
      })
    );

    render(<ProductDetail productId={1} />);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error for invalid product id", async () => {
    render(<ProductDetail productId={0} />);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
