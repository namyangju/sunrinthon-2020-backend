import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error';
import User from '@models/User';

export interface RequestInterface {
  issuer: string;
  worker: string;
  title: string;
  description: string;
  status?: 'open' | 'closed' | 'declined';
}

const RequestSchema: Schema = new Schema({
  issuer: { type: Schema.Types.ObjectId, required: true, ref: User },
  worker: { type: Schema.Types.ObjectId, required: true, ref: User },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'open' },
});

export interface RequestDocument extends Document, RequestInterface {
  // Add Methods here
}

// RequestSchema.methods.~~

// RequestSchema.pre('save', function (next: HookNextFunction): void {
//   const doc = this as RequestDocument;
//   models['Request'].findOne(
//     {
//       $or: [],
//     },
//     function (err: Error, site: RequestDocument) {
//       if (site) next(error.db.exists());
//       if (err) next(err);
//       next();
//     },
//   );
// });

const Request = model<RequestDocument>('Request', RequestSchema);

export default Request;
