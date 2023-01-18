import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.cjs";
import Product from "../models/productModel.cjs";
import Member from "../models/memberModel.cjs";
import { orderEmail } from "../emailTemplates/orderEmail.cjs";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import { shopAdminEmail } from "../emailTemplates/shopAdminEmail.js";
import dotenv from "dotenv";

dotenv.config();

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, paymentMethod, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // check stock level, remove from order if out of stock or reduce stock level by 1 if in stock

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      const productId = item.product;
      const size = item.size;
      const qtyAvailable = product.countInStock[size];

      if (item.qty > qtyAvailable) {
        res.status(400);
        throw new Error("Items out of stock. Check basket");
      } else {
        const itemKey = `countInStock.${item.size}`;
        const qty = item.qty * -1;
        await Product.findOneAndUpdate(
          { _id: productId },
          {
            $inc: { [itemKey]: qty },
          }
        );
      }
    }

    // create order
    const order = new Order({
      orderItems,
      paymentMethod,
      totalPrice,
      member: req.member._id,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "member",
    "firstName lastName email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const member = await Member.findById(order.member);

  if (order.paymentMethod === "DirectDebit") {
    order.isPaid = "pending";
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body._id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
      paymentId: req.body.paymentId,
    };

    const updatedOrder = await order.save();
    // send email confirming order
    orderEmail(
      {
        recipientEmail: member.email,
        recipientName: member.firstName,
        subject: "Order Received",
        link: `${process.env.DOMAIN_LINK}/profile`,
        linkText: "View Account",
      },
      order._id
    );
    res.json(updatedOrder);
  } else if (order.paymentMethod === "PayPal") {
    order.isPaid = "true";
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    // send email confirming order
    orderEmail(
      {
        recipientEmail: member.email,
        recipientName: member.firstName,
        subject: "Order Received",
        link: `${process.env.DOMAIN_LINK}/profile`,
        linkText: "View Account",
      },
      order._id
    );

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to ready for collection
// @route PUT /api/orders/:id/deliver
// @access Private/shopAdmin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  const member = await Member.findById(order.member);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    // send email to say order ready to collect
    genericEmail({
      recipientEmail: member.email,
      recipientName: member.firstName,
      subject: "Order ready to collect",
      message: `<h4>Your Order (${order._id}) is ready</h4>
    <p>Your order is now ready to collect at training.</p>
    `,
      link: `${process.env.DOMAIN_LINK}/order/${order._id}`,
      linkText: "View your order",
      attachments: [],
    });

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to fulfilled
// @route PUT /api/orders/:id/deliver
// @access Private/shopAdmin
const updateOrderToFulfilled = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  const member = await Member.findById(order.member);

  if (order) {
    order.isComplete = true;
    order.completeAt = Date.now();

    const updatedOrder = await order.save();
    // send email to conifrm order collected
    genericEmail({
      recipientEmail: member.email,
      recipientName: member.firstName,
      subject: "Order fulfilled",
      message: `<h4>Your Order (${order._id}) is complete</h4>
    <p>Your order has been completed. If you have any problems with the item(s) you have ordered, please don't hesitate to contact us at any time.</p>
    `,
      link: `${process.env.DOMAIN_LINK}/order/${order._id}`,
      linkText: "View your order",
      attachments: [],
    });

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ member: req.member._id }).sort({
    createdAt: -1,
  });
  const sortedOrders = orders.filter((order) => order.isComplete === false);
  res.json(sortedOrders);
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/shopAdmin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("member", "id firstName lastName")
    .sort({
      createdAt: -1,
    });
  const sortedOrders = orders.filter((order) => order.isComplete === false);
  res.json(sortedOrders);
});

// @desc delete invalid orders and return stock
// @server only
const deleteOrders = asyncHandler(async () => {
  const ordersToDelete = await Order.find({ isPaid: "false" });
  for (const order of ordersToDelete) {
    const orderItems = order.orderItems;
    for (const orderItem of orderItems) {
      const itemSize = `countInStock.${orderItem.size}`;

      await Product.findOneAndUpdate(
        { _id: orderItem.product },
        {
          $inc: { [itemSize]: orderItem.qty },
        },
        { new: true }
      );
    }
  }
  await Order.deleteMany({ isPaid: "false" });
});

// @desc email shop admins with orders waiting to be processed and/or out of stock
// @server only
const emailShopAdmins = asyncHandler(async () => {
  const shopAdmins = await Member.find({ isShopAdmin: true });
  let shopAdminEmails = "";
  for (const shopAdmin of shopAdmins) {
    shopAdminEmails = `${shopAdminEmails}${shopAdmin.email};`;
  }

  // // orders waiting
  const ordersWaiting = await Order.find({
    isPaid: "true",
    isDelivered: false,
  });
  if (ordersWaiting.length > 0) {
    console.log("sending shop admin email...");
    shopAdminEmail(shopAdminEmails, ordersWaiting);
  }

  // out of stock
  const products = await Product.find({});
  let outOfStock = false;
  if (products) {
    products.map((product) => {
      for (const key in product.countInStock) {
        if (product.countInStock[key] === 0) {
          outOfStock = true;
        }
      }
    });
  }
  if (outOfStock === true) {
    genericEmail({
      recipientEmail: shopAdminEmails,
      recipientName: "Shop Admin",
      subject: "Items out of stock",
      message: `<h4>Please review the product stock levels</h4>
    <p>Some items are currently out of stock. If possible, please re-order more stock from the suppliers.</p>
    `,
      link: `${process.env.DOMAIN_LINK}/shopadmin/editproducts`,
      linkText: "View product admin page",
      attachments: [],
    });
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  updateOrderToFulfilled,
  deleteOrders,
  emailShopAdmins,
};
