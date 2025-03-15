import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Wallet } from './entities/wallet.entity';
import mongoose, { Model } from 'mongoose';
import { WalletAsset } from './entities/wallet.asset.entity';

@Injectable()
export class WalletsService {

  constructor(
    @InjectModel(Wallet.name) private walletSchema: Model<Wallet>,
    @InjectModel(WalletAsset.name) private walletAssetSchema: Model<WalletAsset>,
    @InjectConnection() private connection: mongoose.Connection
  ) { }

  async create(createWalletDto: CreateWalletDto) {
    return await this.walletSchema.create(createWalletDto);
  }

  async findAll() {
    return await this.walletSchema.find();
  }

  async findOne(id: string) {
    return await this.walletSchema.findById(id).populate([
      {
        path: 'assets',
        populate: ['asset'],
      }
    ]);
  }

  async createWalletAsset(data: {
    walletId: string,
    assetId: string,
    shares: number
  }) {
    const session = await this.connection.startSession();
    await session.startTransaction();

    try {
      const docs = await this.walletAssetSchema.create({
        wallet: data.walletId,
        asset: data.assetId,
        shares: data.shares
      },
        { session }
      );

      const walletAsset = docs[0];
      await this.walletSchema.updateOne({ _id: data.walletId }, {
        $push: { assets: walletAsset._id },
      },
        {
          session
        }
      );
      await session.commitTransaction();
      return walletAsset;
    } catch (e) {
      console.error(e);
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}
