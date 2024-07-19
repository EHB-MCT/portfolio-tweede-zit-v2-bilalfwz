import app from "./index.js";

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
    console.log(`backend is listening on port ${PORT}`);
})