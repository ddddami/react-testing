import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render user name if given user", () => {
    const user: User = { id: 1, name: "Dami", isAdmin: false };

    render(<UserAccount user={user} />);
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("should render edit button if user is an admin", () => {
    const user: User = { id: 1, name: "Dami", isAdmin: true };

    render(<UserAccount user={user} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not render edit button if user is not an admin", () => {
    const user: User = { id: 1, name: "Dami", isAdmin: false };

    render(<UserAccount user={user} />);
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
});
