import { AuthState } from "@auth0/auth0-react/dist/auth-state";
import { render, screen } from "@testing-library/react";
import AuthStatus from "../../src/components/AuthStatus";
import { mockAuthState } from "../setup";

describe("AuthStatus", () => {
  const renderComponent = (authState: AuthState) => {
    mockAuthState(authState);
    render(<AuthStatus />);

    const getControls = () => ({
      loginButton: screen.queryByRole("button", { name: /log in/i }),
      logoutButton: screen.queryByRole("button", { name: /log out/i }),
    });

    return {
      getControls,
    };
  };
  it("should render loading while getting AuthStatus", () => {
    renderComponent({ isAuthenticated: false, isLoading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render the logout button if user is authenticated", () => {
    const user = { name: "Dami" };
    const { getControls } = renderComponent({
      isAuthenticated: true,
      isLoading: false,
      user: user,
    });
    const { loginButton, logoutButton } = getControls();
    expect(screen.getByText("Dami")).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  });

  it("should render log in button if user is unathenticated", () => {
    const { getControls } = renderComponent({
      isAuthenticated: false,
      isLoading: false,
    });
    const { loginButton, logoutButton } = getControls();
    expect(loginButton).toBeInTheDocument();
    expect(logoutButton).not.toBeInTheDocument();
  });
});
