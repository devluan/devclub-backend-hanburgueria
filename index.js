const express = require("express");

const uuid = require("uuid");

const cors = require("cors");

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors())

const orders = [];

const searchId = (req, res, next) => {
  const { id } = req.params;
  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "Order not found" });
  }
  req.userIndex = index;
  req.userId = id;

  next();
};

const typeReq = (req, res, next) => {
    console.log(`${req.method}, http://localhost:3000${req.url}`);
    next();
};

app.get("/order", typeReq, (req, res) => {
  return res.json(orders);
});

app.post("/order", typeReq,(req, res) => {
  const { order, clienteName, price, status } = req.body;

  const orderClient = { id: uuid.v4(), order, clienteName, price, status };

  orders.push(orderClient);

  console.log(orderClient);

  return res.status(201).json(orderClient);
});

app.put("/order/:id", searchId, typeReq,(req, res) => {
  const { order, clienteName, price, status } = req.body;
  const index = req.userIndex;
  const id = req.userId;

  const updateOrder = { id, order, clienteName, price, status };

  orders[index] = updateOrder;
  return res.json(updateOrder);
});

app.delete("/order/:id", searchId, typeReq,(req, res) => {
  const index = req.userIndex;

  orders.splice(index, 1);
  return res.json({ message: "Order deleted" });
});

app.patch("/order/:id", searchId, typeReq,(req, res) => {
  const index = req.userIndex;
  const { status } = req.body;

  orders[index].status = status || "Pedido pronto";

  return res.json({ order: orders[index] });
});

app.get("/order/:id", searchId, typeReq,(req, res) => {
  const index = req.userIndex;

  return res.json(orders[index]);
});

app.listen(port, () => {
  console.log(`💥 Server started on port ${port}`);
});

/* ========Outra forma que estava fazendo ============
app.patch("/order/:id", (req, res) => {
    const { id } = req.params 
    const { order, clienteName, price, status} = req.body;
    const updateOrder = { id, order, clienteName, price, status: "Pedido Pronto" }
    
    const index = orders.findIndex(order => order.id === id);
    
    if (index < 0) {
        return res.status(404).json({ error: "Order not found" });
    }
    console.log("Alteração no status do pedido: ", id) 
    
    orders[index] = updateOrder;
    return res.json({updateOrder})
    
    
})

*/
