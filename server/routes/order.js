const express = require("express");
const { CreateOrder, ConfirmOrder, GetOrdersByBuyerId, GetOrdersBySellerId, UpdateOrderStatus, GetOrderById } = require("../controllers/order");
const router = express.Router();
const Auth = require("../middleware/Auth");

router.post('/checkoutSession',Auth, CreateOrder);
router.post('/confirm', Auth, ConfirmOrder);
router.get('/buyer/:id', Auth, GetOrdersByBuyerId);
router.get('/seller/:id', Auth, GetOrdersBySellerId);
router.put('/:orderId/status', Auth, UpdateOrderStatus);
router.get('/:id', Auth, GetOrderById);

module.exports = router;
