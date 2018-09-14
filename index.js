const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();


const corsOptions = {
  origin: "https://hypo-drawing.chemaxon.com",
  methods: ["GET", "HEAD", "POST", "OPTIONS"]
};
app.options("/api", cors(corsOptions));
app.post("/api", cors(corsOptions));

app.listen(process.env.PORT, () => console.log("Example app listening on port 80!"))

app.get("/", (req, res) => res.send("It works!"));
app.post("/api", bodyParser.json(), (req, res) => {
  const issueId = req.body.ideaId;
  const canvas = req.body.canvas;
  console.log(issueId, canvas);
});