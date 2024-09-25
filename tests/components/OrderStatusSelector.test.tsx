import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    return {
      trigger: screen.getByRole("combobox"),
      getOptions: () => screen.getAllByRole("option"),
      user: userEvent.setup(),
    };
  };
  it("should render New as the default value", () => {
    const { trigger } = renderComponent();
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );

    expect(trigger).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const { trigger, user, getOptions } = renderComponent();

    await user.click(trigger);

    const options = getOptions();
    expect(options).toHaveLength(3);
    const labels = options.map((option) => option.textContent);

    // expect(labels).toEqual(["New", "Processed", "Fulfilled"]); same with below but this is order specific.
    expect(labels).toEqual(
      expect.arrayContaining(["Processed", "New", "Fulfilled"])
    );
  });
});
