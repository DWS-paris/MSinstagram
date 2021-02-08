/* 
Imports
*/
    // NPM modules
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const path = require('path'); //=> https://www.npmjs.com/package/path
    const fetch = require('node-fetch')
//

/* 
Server class
*/
class ServerClass{
    constructor(){
        this.server = express();
        this.port = process.env.PORT;
    }

    init(){
        // Set CORS middleware
        this.server.use( (req, res, next) => {
            // Allow actions for specific origins
            res.header('Access-Control-Allow-Origin', ['*']);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE', 'POST']);
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

            // Enable access to specific origins
            next();
        });

        // Set server view engine
        this.server.set( 'view engine', 'ejs' );

        // Static path configuration
        this.server.set( 'views', __dirname + '/www' );
        this.server.use( express.static(path.join(__dirname, 'www')) );

        //=> Body-parser
        this.server.use(bodyParser.json({limit: '10mb'}));
        this.server.use(bodyParser.urlencoded({ extended: true }));

        // Start server configuration
        this.config();
    }

    config(){
        // Set up routes
        this.server.get('/:type/:keyword', (req, res) => {
            fetch(`https://www.instagram.com/explore/${req.params.type}/${req.params.keyword}/?__a=1`)
            .then( response => {
                return !response.ok
                ? res.json(response)
                : response.json();
            })
            .then( data => {
                return res.json({
                    methode: 'GET',
                    route: `${req.params.type}/${req.params.keyword}`,
                    params: {
                        type: req.params.type,
                        keyword: req.params.keyword
                    },
                    data
                })
            })
            .catch( err => res.json(err) )
        })

        // Launch server
        this.launch();
    }

    launch(){
        // Start server
        this.server.listen(this.port, () => {
            console.log({
                node: `http://localhost:${this.port}`,
            });
        });
    }
}
//

/* 
Start server
*/
    const MicroServiceInstagram = new ServerClass();
    MicroServiceInstagram.init();
//