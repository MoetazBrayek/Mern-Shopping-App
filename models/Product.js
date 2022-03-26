import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product Name is required"],
            trim: true,
        },
        productImage: {
            type: String,
            required: [true, "Image is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        countInStock: {
            type: Number,
            default: 0,
            required: [true, "Product Stock is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        averageRating: {
            type: Number,
            min: [1, "Rating must be at least 1"],
            max: [10, "Rating must can not be more than 10"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
    }
);
ProductSchema.pre("remove", async function (next) {
    await this.model("Review").deleteMany({ productId: this._id });

    next();
});

ProductSchema.virtual("Reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "productId",
    justOne: false,
});


export const Product = mongoose.model("Product", ProductSchema);
