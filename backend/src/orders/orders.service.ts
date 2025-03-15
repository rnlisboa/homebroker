import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {

  constructor(@InjectModel(Order.name) private OrderSchema: Model<Order>) {}
  
  create(createOrderDto: CreateOrderDto) {
    return this.OrderSchema.create({
      wallet: createOrderDto.wallertId,
      asset: createOrderDto.assetId,
      shares: createOrderDto.shares,
      partial: createOrderDto.shares,
      type: createOrderDto.type,
      status: OrderStatus.PENDING
    });
  }

  findAll(filter: {
    walletId: string
  }) {
    return this.OrderSchema.find({wallet: filter.walletId})
    //.populate(['asset', 'trade'])
  }

  findOne(id: string) {
    return this.OrderSchema.findOne({id})
    //.populate(['asset', 'trade'])
  }
}
