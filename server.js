import app from './app.js';

app.listen(app.get('port'), () => {
    console.log(`Listening on port ${app.get('port')}`);
});