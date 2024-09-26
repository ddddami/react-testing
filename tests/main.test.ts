import { faker } from "@faker-js/faker";

describe("test suite", () => {
  it("test case", () => {
    const product = {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 10, max: 90 }),
    };
    console.log(product);
  });
});
