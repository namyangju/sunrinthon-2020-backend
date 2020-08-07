import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error';
import User from '@models/User';

export interface BidInterface {
  title: string;
  description: string;
  price: number;
  user: string;
  participant?: string[];
}

const BidSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: User },
  participant: { type: [String], default: [] },
});

export interface BidDocument extends Document, BidInterface {
  // Add Methods here
}

// BidSchema.methods.~~

// BidSchema.pre('save', function (next: HookNextFunction): void {
//   const doc = this as BidDocument;
//   models['Bid'].findOne(
//     {
//       $or: [],
//     },
//     function (err: Error, site: BidDocument) {
//       if (site) next(error.db.exists());
//       if (err) next(err);
//       next();
//     },
//   );
// });

const Bid = model<BidDocument>('Bid', BidSchema);

export default Bid;
