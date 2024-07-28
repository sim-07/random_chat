const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);

const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
