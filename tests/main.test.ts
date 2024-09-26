import { faker } from "@faker-js/faker";
import { db } from "./mocks/db";

describe("test suite", () => {
  it("test case", () => {
    // const product = {
    //   name: faker.commerce.productName(),
    //   price: faker.commerce.price({ min: 10, max: 90 }),
    // };
    const product = db.product.create({ name: "Apple" });
    console.log(db.product.getAll());
    // .count() .delete({where: {}}) .deleteMany
  });
});
