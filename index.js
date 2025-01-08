const express = request('express')
const app = express

app.get('/', (req, res) => {
    res.send("Home route for API")
})

app.listen(8080, () => {
    console.log("Server is now running on port 8080")
})