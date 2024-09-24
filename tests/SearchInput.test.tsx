import { render, screen } from "@testing-library/react";
import SearchBox from "../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchBox = () => {
    const onChange = vi.fn((text) => console.log(text));
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
      user: userEvent.setup(),
    };
  };
  it("should render an input field for searching", () => {
    const { input } = renderSearchBox();

    expect(input).toBeInTheDocument();
    // const input = screen.getByPlaceholderText(/search/i); // in one go, to verify our input element and that it has this placeholder
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange, user } = renderSearchBox();
    const searchTerm = "search term";

    await user.type(input, searchTerm + "{enter}");
    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should call not call onChange if input field is empty", async () => {
    const { input, onChange, user } = renderSearchBox();

    await user.type(input, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
