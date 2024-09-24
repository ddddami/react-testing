import { render, screen } from "@testing-library/react";
import TagList from "../../src/components/TagList";

describe("TagList", () => {
  it("should render tags", async () => {
    render(<TagList />);

    // waitFor(() => {
    //   const listItems = screen.getAllByRole("listitem");
    //   expect(listItems.length).toBeGreaterThan(0);
    // });

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems.length).toBeGreaterThan(0);

    // find** is a combination of waitFor and query, but simpler/more linear syntax
    // WARNING: Don't use waitFor for side effects because it  keeps calling the callBack every 15ms until it times out (1s)(default).  Only use it for queries
  });
});
