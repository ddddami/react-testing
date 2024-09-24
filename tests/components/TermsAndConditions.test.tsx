import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  function renderComponent() {
    render(<TermsAndConditions />);
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    };
  }

  it("should render with correct text and initial state", () => {
    const { heading, checkbox, button } = renderComponent();

    expect(heading).toHaveTextContent(/terms & conditions/i);
    expect(checkbox).not.toBeChecked();
    // const button = screen.getByRole('button', {name: /submit/i}) // optional filtering
    expect(button).toBeDisabled();
  });

  it("should enable the button once the checbox is checked", async () => {
    const { checkbox, button } = renderComponent();
    render(<TermsAndConditions />);

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});

// when you use getBy** .tbinthedocument isn't needed anymore cuz it'd throw an error. and difference btw getBY* and queryBy*?
