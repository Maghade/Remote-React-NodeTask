import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  encryptedData: string;
}

const studentSchema = new Schema<IStudent>(
  {
    encryptedData: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;