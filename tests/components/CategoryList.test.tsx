import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });
  const renderComponent = () => {
    render(
      <AllProviders>
        <CategoryList />
      </AllProviders>
    );
  };
  it("should render the categories", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    const options = screen.getAllByRole("listitem");
    expect(options.length).toBeGreaterThan(0);

    // better assertion than above;
    categories.forEach((c) => {
      expect(screen.getByText(c.name)).toBeInTheDocument();
    });
  });

  it("should render loading while fetching data", () => {
    simulateDelay("/categories");
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render an error if fetch fails", async () => {
    simulateError("/categories");
    renderComponent();
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
