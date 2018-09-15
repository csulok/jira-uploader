const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const request =  require("request-promise");

const app = express();


const corsOptions = {
  origin: ["https://hypo-drawing.chemaxon.com"],
  methods: ["GET", "HEAD", "POST", "OPTIONS"]
};
app.options("/api", cors(corsOptions));
app.post("/api", cors(corsOptions));

app.listen(process.env.PORT, () => console.log("Example app listening on port 80!"))

app.get("/", (req, res) => res.send("Available endpoints: POST /api"));
app.get("/status", (req, res) => res.json({ status: "OK"}));

app.post("/api", bodyParser.json(), async (req, res, next) => {
  const issueId = req.body.ideaId;
  const dataUrl = req.body.dataUrl;
  const fileName = req.body.fileName;
  console.log("uploading", issueId, fileName, "dataUrl length:", dataUrl.length);
  
  if (!issueId || !dataUrl || !fileName) {
    return next();
  }
    
  try {
    const results = await request.post({
      url: `https://hypo.chemaxon.com/rest/api/2/issue/${issueId}/attachments`,
      auth: {
        username: process.env["JIRA_USERNAME"],
        password: process.env["JIRA_PASSWORD"]
      },
      headers: {
        "X-Atlassian-Token": "no-check"
      },
      formData: {
        file: new Buffer(dataUrl.split(",")[1], 'base64')
      }
    });
    
    res.sendStatus(200);
    return;
  } catch (err) {
    console.log("An error occured", err.stack);
    res.sendStatus(500);
  }

});