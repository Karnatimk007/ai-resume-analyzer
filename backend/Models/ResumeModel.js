import { Schema, model } from 'mongoose';

const ResumeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    parsedText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    roleCompared: {
      type: String,
      default: 'General',
    },
    analysisResult: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

export default model('Resume', ResumeSchema);
