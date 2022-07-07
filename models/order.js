/*========================================
        DEPENDENCIES
========================================*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./itemSchema');

/*========================================
        SCHEMAS
========================================*/
const lineItemSchema = new Schema(
	{
		qty: {
			type: Number,
			default: 1
		},
		item: itemSchema
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true
		},
	}
);

// order schema references the User ID currently logged in
// lineItemsschema is embedded within orders
const ordersSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		lineItems: [lineItemSchema],
		isPaid: {
			type: Boolean,
			default: false
		},
	},
	{
		timestamps: true,
		toJSON: {
			virtuals: true
		},
	}
);

/*========================================
		Model virtuals
========================================*/
// "extPrice" is the virtual being created, "this" refers to it.
lineItemSchema.virtual('extPrice').get(function () {
	return this.qty * this.item.price
})

// Creating virtual properties on the ordersSchema "orderTotal, totalQty, etc."
// reduce takes an array of values and reduces to one single value(item)
// first param = accumulator(total), second param = (item) looping thru each individual item, total is 0 to start
// This virtual keeps track of the order total for a specified order
ordersSchema.virtual('orderTotal').get(function() {
	return this.lineItems.reduce((total, item) => total + item.extPrice, 0)
})

// This virtual keeps track of the total qty for a lineitem in the specified order
ordersSchema.virtual('totalQty').get(function () {
	return this.lineItems.reduce((total, item) => total + item.qty, 0)
})

// This virtual is slicing the orderID and converting to uppercase, don't understand why yet? will revisit
ordersSchema.virtual('orderId').get(function () {
	return this.id.slice(-6).toUpperCase();
})

/*========================================
		Model Statics
========================================*/
// You add a static function to your schema, and Mongoose attaches it to any model you compile with that schema.
ordersSchema.statics.findCart = function(userId) {
	// 'this' is the Order model itself, 'user' is pulling from the schema property
	return this.findOneAndUpdate(
		{ user: userId, isPaid: false },
		// Above is what we query for
		{ user: userId },
		// data for the order contained in userId param
		{ upsert: true, new: true }
		// upsert creates object if doesn't exist
	)
		
		
}

/*========================================
		Model Methods
========================================*/
ordersSchema.methods.addItemToCart = async function (storeItemId) {
	// set a keywork for the unpaid order (cart)
	const cart = this



}
	
/*========================================
				EXPORTS
========================================*/
module.exports = mongoose.model('Order', ordersSchema)