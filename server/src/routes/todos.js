import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Received HTTP GET method");
});

router.post("/", (req, res) => {
  res.send("Received HTTP POST method");
});

router.put("/:todoId", (req, res) => {
  res.send(`Received HTTP PUT method for todId: ${req.params.todoId}`);
});

router.delete("/:todoId", (req, res) => {
  res.send("Received HTTP DELETE method");
});

export default router;
