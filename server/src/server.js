const app = require('./app');

const PORT = 9099;

const server = app.listen(PORT, () => {
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});
5