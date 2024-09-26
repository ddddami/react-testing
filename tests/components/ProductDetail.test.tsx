import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import { db } from "../mocks/db";
import { server } from "../mocks/server";
import AllProviders from "../AllProviders";

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
    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

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

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error for invalid product id", async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render an error message if error", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the loading indicator while data is being fetched", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();

        return HttpResponse.json({});
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading indicator after the data has been fetched", async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryAllByText(/loading/i));
  });

  it("should remove the loading indicator if an error occurs during data fetching", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryAllByText(/loading/i));
  });
});
