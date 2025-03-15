import { OrderStatus, OrderType } from "../entities/order.entity";

export class CreateOrderDto {
    wallertId: string;
    assetId: string;
    shares: number;
    price: number;
    type: OrderType
    status: OrderStatus
}
