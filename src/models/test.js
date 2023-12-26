import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestSchema = new Schema({
  title: String,
  body: String,
});

const Test = mongoose.model('Test', TestSchema);
export default Test;
