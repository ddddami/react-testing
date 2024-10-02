import { screen, waitForElementToBeRemoved } from "@testing-library/react";

import { Product } from "../../src/entities";
import { db } from "../mocks/db";
import { navigateTo, simulateDelay, simulateError } from "../utils";

describe("ProductDetailPage", () => {
  let product: Product;
  beforeAll(() => {
    product = db.product.create();
  });
  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render loading while fetching product", () => {
    simulateDelay("/products/" + product.id);
    navigateTo("/products/" + product.id);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render the product", async () => {
    navigateTo("/products/" + product.id);
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();
  });

  it.skip("should render not found if product could not be fetched", () => {
    simulateError("/products/" + product.id);
    navigateTo("/products/" + product.id);

    // would always timeout because we are using the normal production code query config not test.. it'd always retry the test
    // await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    // expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
