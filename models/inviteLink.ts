import mongoose from "mongoose";

const Schema = mongoose.Schema;

const inviteLinkSchema = new Schema(
  {
    inviteCode: { type: String },
  },
  { timestamps: true }
);

const inviteCodeModel = mongoose.model("inviteCode", inviteLinkSchema);
export default inviteCodeModel;
