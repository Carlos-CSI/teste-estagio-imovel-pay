const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // 🚨 ISSO É O MAIS IMPORTANTE

app.use("/cobrancas", require("./routes/cobrancas.routes"));

app.listen(3001, () => {
  console.log("Backend rodando na porta 3001");
});
