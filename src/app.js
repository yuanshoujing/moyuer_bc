import crypto from 'crypto';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import socket_io from 'socket.io';
import _ from 'lodash';

import BlockChain from './block_chain.js';


let blockChain = new BlockChain();

let app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

let server = http.Server(app);
let io = socket_io(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('start-digg', (v) => {
        console.log('start digg from ' + v);
        let last_block = blockChain.last_block;
        let last_proof = last_block['proof']
        let result = blockChain.proof_of_work_each(last_proof, v);
        io.emit('digg-result', result);
    });
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

server.listen(3000, () => {
    console.log('listening on *:3000');
});
