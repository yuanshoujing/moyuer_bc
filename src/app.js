import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';

import _ from 'lodash';

import BlockChain from './block_chain.js';


let blockChain = new BlockChain();

let app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
    //let sha256 = crypto.createHash('sha256');
    //sha256.update('245666');
    //res.send('Hello world!11345');
    //console.log(crypto.getHashes());
    //res.send(sha256.digest('hex'));
    let proof = blockChain.proof_of_work(blockChain.last_block.proof);
    res.send('proof: ' + proof);
});


app.get('/mine', (req, res) => {
    let last_block = blockChain.last_block;
    let last_proof = last_block['proof']
    let proof = blockChain.proof_of_work(last_proof);
    res.send("We'll mine a new Block");
});


app.post('/transactions/new', (req, res) => {
    let args = req.body || {};
    let required = _.pick(args, ['sender', 'recipient', 'amount']);
    // console.log(required);
    if (_.size(required) < 3) {
        res.status(400).send('Missing values');
    }
    else {
        let index = blockChain.new_transaction(
            required.sender,
            required.recipient,
            required.amount
        );
        res.json({
            'message': 'Transaction will be added to Block ' + index
        });
    }
    // res.send("We'll add a new transaction");
});


app.get('/chain', (req, res) => {
    let result = {
        'chain': blockChain.chain,
        'length': _.size(blockChain.chain)
    }

    res.json(result);
});

let server = app.listen(3000, () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});
