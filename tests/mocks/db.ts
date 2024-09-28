/* eslint-disable @typescript-eslint/unbound-method */
import { factory, primaryKey } from "@mswjs/data";
import { faker } from "@faker-js/faker";

// this is an in memory db that is shared btw our tests
// to make sure our tests are robust and trustworthy, they should not be dependent on any global state which this is one. we'd explore how to deal with it later.

export const db = factory({
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
  },
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 0, max: 200 }),
    categoryId: () => faker.number.int({ min: 0, max: 200 }),
  },
});
