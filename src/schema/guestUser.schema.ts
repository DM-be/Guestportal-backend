import * as mongoose from 'mongoose';

export const GuestUserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  fromDate: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  personBeingVisited: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
  },
});
