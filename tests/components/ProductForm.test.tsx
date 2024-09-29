/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    const { waitForFormToLoad } = renderComponent();

    const { nameInput, categoryInput, priceInput } = await waitForFormToLoad();

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
    const { waitForFormToLoad } = renderComponent(product);
    const { categoryInput, nameInput, priceInput } = await waitForFormToLoad();

    expect(nameInput).toHaveValue(product.name);
    expect(priceInput).toHaveValue(product.price.toString());
    expect(categoryInput).toHaveTextContent(category.name);

    // diff btw tohavetextcontent and tohavevalue. 2nd must be the value, direct child. 1st only looks for the content whether deeply nested, whatever
  });

  it("should focus the name field", async () => {
    const { waitForFormToLoad } = renderComponent();

    const { nameInput } = await waitForFormToLoad();
    expect(nameInput).toHaveFocus();
  });

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "longer than 255 characters",
      errorMessage: /255/i,
      name: "a".repeat(256),
    },
  ])(
    "should display an error if name is $scenario",
    async ({ errorMessage, name }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, name });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    { scenario: "< than 1", price: "0", errorMessage: /greater/i },
    { scenario: "negative", price: "-1", errorMessage: /greater/i },
    { scenario: "NaN", price: "a", errorMessage: /required/i },

    {
      scenario: "> than 1000",
      price: "1001",
      errorMessage: /less/i,
    },
  ])(
    "should display an error if price is $scenario",
    async ({ price, errorMessage }) => {
      const { waitForFormToLoad, expectErrorToBeInTheDocument } =
        renderComponent();

      const form = await waitForFormToLoad();

      await form.fill({ ...form.validData, price });

      expectErrorToBeInTheDocument(errorMessage);
    }
  );
});

const renderComponent = (product?: Product) => {
  render(<ProductForm product={product} onSubmit={vi.fn()} />, {
    wrapper: AllProviders,
  });

  const waitForFormToLoad = async () => {
    await screen.findByRole("form");

    const nameInput = screen.getByPlaceholderText(/name/i);
    const priceInput = screen.getByPlaceholderText(/price/i);
    const categoryInput = screen.getByRole("combobox", { name: /category/i });
    const submitButton = screen.getByRole("button");
    const validData: Product = {
      categoryId: 1,
      id: 1,
      name: "aaaa",
      price: 10,
    };

    type FormData = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [K in keyof Product]: any;
    };
    const fill = async (product: FormData) => {
      const user = userEvent.setup();
      if (product.name !== undefined) await user.type(nameInput, product.name);
      if (product.price !== undefined)
        await user.type(priceInput, product.price.toString());

      await user.tab(); // hacky fix for userActions act warning
      await user.click(categoryInput);
      const options = screen.queryAllByRole("option");
      await user.click(options[0]);
      await user.click(submitButton);
    };
    return {
      nameInput,
      priceInput,
      categoryInput,
      submitButton,
      fill,
      validData,
    };
  };

  const expectErrorToBeInTheDocument = (errorMessage: RegExp) => {
    const error = screen.queryByRole("alert");
    expect(error).toHaveTextContent(errorMessage);
  };
  return { waitForFormToLoad, expectErrorToBeInTheDocument };
};
