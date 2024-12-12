const express = require("express");
const path = require("path");
const httpProxy = require("http-proxy");
const app = express();

const PORT = process.env.PORT || 4000;

const apiProxy = httpProxy.createProxyServer();
const API_SERVICE_URL = "http://localhost:8080";

app.use(express.static(path.join(__dirname, "build")));

app.use("/api", (req, res) => {
  apiProxy.web(req, res, { target: API_SERVICE_URL });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
