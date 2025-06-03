import mongoose from 'mongoose';

/*
Relationship between User and Address:
- Each Address document has a 'user' field referencing the User's ObjectId.
- One user can have multiple addresses (one-to-many).
- Each address stores user-specific address info (label, address, city, etc).

Example:
User
{
  _id: ObjectId("..."),
  name: "John Doe",
  // ...
}

Address
{
  _id: ObjectId("..."),
  user: ObjectId("..."), // references User._id
  label: "Home",
  address: "123 Main St",
  city: "New York",
  // ...
}
*/

// In Mongoose schema:
const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, default: 'Home' },
  address: { type: String, required: true },
  city: String,
  state: String,
  zip: String,
  country: String,
  phone: String,
  isDefault: { type: Boolean, default: false }
});

// One-to-many: One user, many addresses.

export default mongoose.model('Address', addressSchema);
