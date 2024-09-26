describe("test suite", () => {
  it("test case", async () => {
    const response = await fetch("/categories");
    const data = await response.json();
    console.log(data);
    expect(data).toHaveLength(3);
  });
});
