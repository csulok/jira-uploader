const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors");
const request =  require("request");
const app = express();


const corsOptions = {
  origin: ["https://hypo-drawing.chemaxon.com"],
  methods: ["GET", "HEAD", "POST", "OPTIONS"]
};

app.options("/api", cors(corsOptions));
app.post("/api", cors(corsOptions));


app.get("/", (req, res) => res.send("Available endpoints: POST /api"));
app.get("/status", (req, res) => res.json({ status: "OK"}));


app.post("/api", bodyParser.json(), async (req, res, next) => {
  const issueId = req.body.ideaId;
  const dataUrl = req.body.dataUrl;
  const fileName = req.body.fileName;
  console.log("Uploading", issueId, fileName, "dataUrl length:", dataUrl.length);
  
  if (!issueId || !dataUrl || !fileName) {
    return next();
  }
  
  
  const r = request.post({
    url: `https://hypo.chemaxon.com/rest/api/2/issue/${issueId}/attachments`,
    auth: {
      username: process.env["JIRA_USERNAME"],
      password: process.env["JIRA_PASSWORD"]
    },
    headers: {
      "X-Atlassian-Token": "no-check",
      "Accept": "application/json"
    }
  }, (err, uploadRes, body) => {
    if (err || !uploadRes || !(/^2/.test("" + uploadRes.statusCode))) {
      console.log("Couldn't upload the file", uploadRes.statusCode, err, body);
      res.sendStatus(res.statusCode || 500);
    } else {
      console.log("Upload success for", issueId, fileName);
      res.sendStatus(200);
    }
  });
  
  const form = r.form();
  form.append("file", new Buffer(dataUrl.split(",")[1], 'base64'), {filename: fileName});

});

app.listen(process.env.PORT, () => console.log("JIRA Uploader listening on port 80!"));