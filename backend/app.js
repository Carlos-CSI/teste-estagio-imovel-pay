const express = require('express');
const cors = require('cors');
const cobrancasRoutes = require('./routes/cobrancas.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/cobrancas', cobrancasRoutes);

module.exports = app;
