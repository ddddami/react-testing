import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      categoryId: 1,
      id: 1,
      name: "product1",
      price: 9,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCartButton: () =>
        screen.getByRole("button", { name: /add to cart/i }),
      getQuantityControls: () => ({
        quantity: screen.queryByRole("status"),
        decrementButton: screen.queryByRole("button", { name: "-" }),
        incrementButton: screen.queryByRole("button", { name: "+" }),
      }),

      user: userEvent.setup(),
    };
  };
  it("should render quantity selector", () => {
    const { getAddToCartButton } = renderComponent();
    expect(getAddToCartButton()).toBeInTheDocument();
  });

  it("should add the product to cart", async () => {
    const { getAddToCartButton, getQuantityControls, user } = renderComponent();

    await user.click(getAddToCartButton());

    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    expect(quantity).toHaveTextContent("1");
    expect(decrementButton).toBeInTheDocument();
    expect(incrementButton).toBeInTheDocument();
    // expect(getAddToCartButton()).not.toBeInTheDocument(); # because getBy throws an error if element isnt found you can use queryBy here
  });

  it("should increment the quantity", async () => {
    const { getAddToCartButton, getQuantityControls, user } = renderComponent();
    await user.click(getAddToCartButton());

    const { quantity, incrementButton } = getQuantityControls();
    await user.click(incrementButton!);

    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const { getAddToCartButton, getQuantityControls, user } = renderComponent();
    await user.click(getAddToCartButton());
    const { quantity, incrementButton, decrementButton } =
      getQuantityControls();

    await user.click(incrementButton!);
    await user.click(decrementButton!);

    expect(quantity).toHaveTextContent("1");
  });

  it("should remove the product from the cart", async () => {
    const { getAddToCartButton, user, getQuantityControls } = renderComponent();
    await user.click(getAddToCartButton());
    const { quantity, decrementButton, incrementButton } =
      getQuantityControls();

    await user.click(decrementButton!);

    expect(quantity).not.toBeInTheDocument();
    expect(decrementButton).not.toBeInTheDocument();
    expect(incrementButton).not.toBeInTheDocument();
    screen.debug();
    // expect(addToCartButton).toBeInTheDocument();
  });
});
