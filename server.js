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
            // Check type params
            if( req.params.type === 'tag' || req.params.type === 'user' ){
                // Set up Instagram query
                let instagramRequest = null;

                // Check route params
                req.params.type === 'tag'
                ? instagramRequest = `explore/tags/${req.params.keyword}`
                : instagramRequest = `${req.params.keyword}`;


                fetch(`${process.env.INSTAGRAM_URL}/${instagramRequest}/?__a=1`)
                .then( response => {
                    return !response.ok
                    ? res.json(response)
                    : response.json();
                })
                .then( apiResponse => {
                    
                    // Check route params
                    if( req.params.type === 'tag' ){
                        let response = [];
                        
                        for( let item of apiResponse.graphql.hashtag.edge_hashtag_to_media.edges){
                            response.push({
                                caption: item.node.edge_media_to_caption.edges.length > 0 ? item.node.edge_media_to_caption.edges[0].node.text : null,
                                display_url: item.node.display_url,
                                thumbnails: item.node.thumbnail_resources,
                                accessibility: item.node.accessibility_caption
                            })
                        }

                        return res.json({
                            error: null,
                            methode: 'GET',
                            route: `${req.params.type}/${req.params.keyword}`,
                            params: {
                                type: req.params.type,
                                keyword: req.params.keyword
                            },
                            data: response,
                            apiResponse
                        })
                    }
                    else if( req.params.type === 'user' ){
                        let response = {
                            biography: apiResponse.graphql.user.biography,
                            external_url: apiResponse.graphql.user.external_url,
                            profile_pic_url: apiResponse.graphql.user.profile_pic_url,
                            timeline_media: []
                        };

                        for( let item of apiResponse.graphql.user.edge_owner_to_timeline_media.edges){
                            response.timeline_media.push({
                                caption: item.node.edge_media_to_caption.edges[0].node.text,
                                display_url: item.node.display_url,
                                thumbnails: item.node.thumbnail_resources,
                                accessibility: item.node.accessibility_caption
                            })
                        }

                        return res.json({
                            error: null,
                            methode: 'GET',
                            route: `${req.params.type}/${req.params.keyword}`,
                            params: {
                                type: req.params.type,
                                keyword: req.params.keyword
                            },
                            data: response,
                            apiResponse
                        })
                    }
                    
                })
                .catch( err => res.json(err) )
            }
            else{
                return res.json({
                    error: 'Only tag or user are supported types',
                    methode: 'GET',
                    route: `${req.params.type}/${req.params.keyword}`,
                    params: {
                        type: req.params.type,
                        keyword: req.params.keyword
                    },
                    data: null
                })
                
            }
        })

        this.server.get('/*', (req, res) => {
            return res.render('index')
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