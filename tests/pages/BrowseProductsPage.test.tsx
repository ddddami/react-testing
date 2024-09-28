import { Theme } from "@radix-ui/themes";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { CartProvider } from "../../src/providers/CartProvider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("BrowserProducts", () => {
  const categories: Category[] = [];
  const products: Product[] = [];
  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({
        name: "category" + item,
      });
      categories.push(category);

      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const renderComponent = () => {
    render(
      <CartProvider>
        <Theme>
          <BrowseProducts />
        </Theme>
      </CartProvider>
    );

    return {
      getProductsSkeleton: () =>
        screen.queryByRole("progressbar", { name: /products/i }),
      getCategoriesSkeleton: () =>
        screen.queryByRole("progressbar", { name: /categories/i }),
      getCategoriesCombobox: () => screen.queryByRole("combobox"),
      user: userEvent.setup(),
    };
  };

  it("should render skeletons while fetching categories", () => {
    simulateDelay("/categories");

    const { getCategoriesSkeleton } = renderComponent();
    expect(
      // replaced with getCategories skeleton - screen.getByRole("progressbar", { name: /categories/i }) // aria-label -> 'loading categories'
      getCategoriesSkeleton()
    ).toBeInTheDocument();
  });

  it("should remove skeletons after categories has been fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();

    await waitForElementToBeRemoved(() => getCategoriesSkeleton());
  });

  it("should render skeletons while fetching products", () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();
    expect(
      // # replaced with getProductsSkeleton screen.queryByRole("progressbar", { name: /products/i }) // aria-label -> 'loading categories'
      getProductsSkeleton()
    ).toBeInTheDocument();
  });

  it("should remove skeletons after products has been fetched", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton, getCategoriesCombobox } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(getCategoriesCombobox()).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products");
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render the list of categories", async () => {
    const { getCategoriesSkeleton, getCategoriesCombobox, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = getCategoriesCombobox();
    expect(combobox).toBeInTheDocument();

    await user.click(combobox!);
    //  const options =  await screen.findAllByRole("option");
    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((c) => {
      expect(screen.getByRole("option", { name: c.name })).toBeInTheDocument();
    });
  });

  it("should render the list of products", async () => {
    const { getProductsSkeleton } = renderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should render only filtered products when a category filter is applied", async () => {
    const { getCategoriesCombobox, getCategoriesSkeleton, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();

    await user.click(combobox!);
    const selectedCategory = categories[0];
    await user.click(
      screen.getByRole("option", { name: selectedCategory.name })
    );

    // const filteredProducts = products // or use db.Many to filter
    //   .map((product) => screen.queryByText(product.name))
    //   .filter((p) => p !== null);
    // expect(filteredProducts).toHaveLength(2);

    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows.length).toBe(products.length);
  });

  it("should render all products when ALL filter is applied", async () => {
    const { getCategoriesCombobox, getCategoriesSkeleton, user } =
      renderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
    const combobox = getCategoriesCombobox();

    await user.click(combobox!);
    await user.click(screen.getByRole("option", { name: /all/i }));

    const products = db.product.getAll();
    const rows = screen.getAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows.length).toBe(products.length);
  });
});
