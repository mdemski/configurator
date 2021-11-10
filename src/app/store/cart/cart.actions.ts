export class AddProductToCart {
  static type = '[Cart] Add Item To Cart';

  constructor(public readonly product, public quantity: number) {
  }
}

export class GetCart {
  static type = '[Cart] Get Cart With Items';
}

export class DeleteProductFromCart {
  static type = '[Cart] Delete Item From Cart';

  constructor(public readonly product) {
  }
}

export class DeleteCart {
  static type = '[Cart] Delete Cart';
}
