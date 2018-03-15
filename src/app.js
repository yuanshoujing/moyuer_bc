import express from 'express';
import crypto from 'crypto';

import BlockChain from './block_chain.js';


let blockChain = new BlockChain();

let app = express();

app.get('/', (req, res) => {
    //let sha256 = crypto.createHash('sha256');
    //sha256.update('245666');
    //res.send('Hello world!11345');
    //console.log(crypto.getHashes());
    //res.send(sha256.digest('hex'));
    let proof = blockChain.proof_of_work(blockChain.last_block.proof);
    res.send('proof: ' + proof);
});

let server = app.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});
