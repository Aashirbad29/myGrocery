import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const orderSchema = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'user' },
    items: [
        {
            product: { type: Types.ObjectId, required: true, ref: 'product' },
            quantity: { type: Number, required: true },
        }
    ],
    amount: { type: Number, required: true },
    address: { type: Types.ObjectId, required: true, ref: 'address' },
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;
