import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  const limit = 255;
  const longText = "a".repeat(limit + 1);
  const shortText = "short text";
  const truncatedText = longText.substring(0, limit) + "...";

  it("should render the full text if less than 255 characters", () => {
    render(<ExpandableText text={shortText} />);
    const article = screen.getByText(shortText);
    expect(article).toBeInTheDocument();
  });

  it("should truncate text if longer than 255 characters", () => {
    render(<ExpandableText text={longText} />);

    const article = screen.getByText(truncatedText);
    expect(article).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /more/i })).toBeInTheDocument();
  });

  it("should expand when the showMore button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);

    const article = screen.getByText(longText);
    expect(article).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });

  it("should collapse when the showLess button is clicked", async () => {
    render(<ExpandableText text={longText} />);

    const showMoreButton = screen.getByRole("button", { name: /more/i });
    const user = userEvent.setup();
    await user.click(showMoreButton);

    const showLessButton = screen.getByRole("button", { name: /less/i });
    await user.click(showLessButton);

    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(showMoreButton).toHaveTextContent(/more/i);
  });
});
