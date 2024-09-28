import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Theme } from "@radix-ui/themes";
import { delay, http, HttpResponse } from "msw";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { server } from "../mocks/server";

describe("BrowserProducts", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <BrowseProducts />
      </Theme>
    );
  };
  it("should render skeletons while fetching categories", () => {
    server.use(
      http.get("/categories", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();
    expect(
      screen.getByRole("progressbar", { name: /categories/i }) // aria-label -> 'loading categories'
    ).toBeInTheDocument();
  });

  it("should remove skeletons after categories has been fetched", async () => {
    renderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
  });

  it("should render skeletons while fetching products", () => {
    server.use(
      http.get("/products", async () => {
        await delay();
        return HttpResponse.json([]);
      })
    );

    renderComponent();
    expect(
      screen.queryByRole("progressbar", { name: /products/i }) // aria-label -> 'loading categories'
    ).toBeInTheDocument();
  });

  it("should remove skeletons after products has been fetched", async () => {
    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });

  it("should not render an error if categories cannot be fetched", async () => {
    server.use(http.get("/categories", () => HttpResponse.error()));

    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  it("should render an error if products cannot be fetched", async () => {
    server.use(http.get("/products", () => HttpResponse.error()));

    renderComponent();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
