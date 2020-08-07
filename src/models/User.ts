import { model, Schema, Document, HookNextFunction, models } from 'mongoose';
import error from '@error';

export interface UserInterface {
  userid: string;
  password: string;
  enckey: string;
  authority?: string;
  nickname: string;
  type: 'normal' | 'worker' | 'client';
  photo?: string;
  description?: string;
}

const UserSchema = new Schema<UserDocument>({
  userid: { type: String, required: true, lowercase: true },
  password: { type: String, required: true },
  enckey: { type: String, required: true },
  authority: { type: String, default: 'normal' },
  nickname: { type: String, required: true },
  type: { type: String, required: true },
  photo: { type: String, default: '' },
});

export interface UserDocument extends Document, UserInterface {
  checkUserExists(userid: string): Promise<boolean>;
}

UserSchema.methods.checkUserExists = async function (userid) {
  if (await models['User'].findOne({ userid }).exec()) return true;
  return false;
};

UserSchema.pre('save', function (next: HookNextFunction) {
  const doc = this as UserDocument;
  models['User'].findOne(
    { $or: [{ userid: doc.userid }, { nickname: doc.nickname }] },
    function (err, user) {
      if (user) next(error.db.exists() as any);
      if (err) next(err);
      next();
    },
  );
});

const User = model<UserDocument>('User', UserSchema);

export default User;
