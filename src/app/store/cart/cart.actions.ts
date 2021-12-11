export class AddProductToCart {
  static type = '[Cart] Add Item To Cart';

  constructor(public readonly product, public quantity: number) {
  }
}

export class GetCart {
  static type = '[Cart] Get Cart With Items';
}

export class UpdateCartCurrency {
  static type = '[Cart] Update Currency In Cart';

  constructor(public currency: string) {
  }
}

export class UpdateCartVatRate {
  static type = '[Cart] Update VAT Rate In Cart';

  constructor(public vatRate: number) {
  }
}

export class DeleteProductFromCart {
  static type = '[Cart] Delete Item From Cart';

  constructor(public readonly product) {
  }
}

export class DeleteCart {
  static type = '[Cart] Delete Cart';
}
