import express from "express";
const app = express();
const port = 3000;

app.use(express.static("../"));

app.get("/", (req, res) => {
    res.sendFile("/home/prithvisingh18/Desktop/Workspace/playground/http/html/de_vis.html");
});

app.get("/geo", (req, res) => {
    res.sendFile("/home/prithvisingh18/Desktop/Workspace/playground/http/html/geo.html");
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
