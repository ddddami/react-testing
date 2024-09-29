import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it("should render form fields", async () => {
    // render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });
    const { waitForFormToLoad, getInputs } = renderComponent();

    await waitForFormToLoad();

    const { nameInput, categoryInput, priceInput } = getInputs();

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(categoryInput).toBeInTheDocument();
  });

  it("should render form fields to be populated with initial values", async () => {
    const product: Product = {
      id: 1,
      name: "product1",
      price: 10,
      categoryId: category.id,
    };
    const { getInputs } = renderComponent(product);
    await screen.findByRole("form");

    const { categoryInput, nameInput, priceInput } = getInputs();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);

    // diff btw tohavetextcontent and tohavevalue. 2nd must be the value, direct child. 1st only looks for the content whether deeply nested, whatever
  });
});

const renderComponent = (product?: Product) => {
  render(<ProductForm product={product} onSubmit={vi.fn()} />, {
    wrapper: AllProviders,
  });

  const waitForFormToLoad = () => screen.findByRole("form");

  const getInputs = () => ({
    nameInput: screen.getByPlaceholderText(/name/i),
    priceInput: screen.getByPlaceholderText(/price/i),
    categoryInput: screen.getByRole("combobox", { name: /category/i }),
  });

  return { waitForFormToLoad, getInputs };
};
