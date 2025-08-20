import app from "./app.js";


const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
    res.send("Server Running");
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});