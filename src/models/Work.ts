import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error';
import User from '@models/User';

export interface WorkInterface {
  title: string;
  description: string;
  image: string;
  author: string;
}

const WorkSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: User },
});

export interface WorkDocument extends Document, WorkInterface {
  // Add Methods here
}

// WorkSchema.methods.~~

// WorkSchema.pre('save', function (next: HookNextFunction): void {
//   const doc = this as WorkDocument;
//   models['Work'].findOne(
//     {
//       $or: [],
//     },
//     function (err: Error, site: WorkDocument) {
//       if (site) next(error.db.exists());
//       if (err) next(err);
//       next();
//     },
//   );
// });

const Work = model<WorkDocument>('Work', WorkSchema);

export default Work;
