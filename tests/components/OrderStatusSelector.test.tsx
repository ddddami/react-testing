import { Theme } from "@radix-ui/themes";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      trigger: screen.getByRole("combobox"),
      getOptions: () => screen.getAllByRole("option"),
      getOption: (label: RegExp) => screen.getByRole("option", { name: label }),
      user: userEvent.setup(),
      onChange,
    };
  };
  it("should render New as the default value", () => {
    const { trigger } = renderComponent();

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

  it.each([
    {
      label: /processed/i,
      value: "processed",
    },
    {
      label: /fulfilled/i,
      value: "fulfilled",
    },
  ])(
    "should call onChange with $value when $value is selected",
    async ({ label, value }) => {
      const { user, trigger, getOption, onChange } = renderComponent();
      await user.click(trigger);

      const option = getOption(label);
      await user.click(option);

      expect(vi.mocked(onChange)).toHaveBeenCalledWith(value);
    }
  );

  it("should call onChange 'new' when the New option is selected", async () => {
    const { user, trigger, getOption, onChange } = renderComponent();
    await user.click(trigger);

    const processedOption = getOption(/processed/i);
    await user.click(processedOption);

    await user.click(trigger);
    const newOption = getOption(/new/i);
    await user.click(newOption);

    expect(vi.mocked(onChange)).toHaveBeenCalledWith("new");
  });
});
