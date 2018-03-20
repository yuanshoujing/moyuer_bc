import _ from 'lodash';
import crypto from 'crypto';


export default class BlockChain {

    chain = [];
    current_transactions = [];

    constructor () {
        this.new_block(1, 100);
    }

    /**
     * 计算区块 SHA-256 hash
     *
     * @param {object} block - 区块
     * @return {string}
     */
    static hash(block) {
        let block_json = JSON.stringify(block);

        let sha256 = crypto.createHash('sha256');
        sha256.update(block_json);
        return sha256.digest('hex');
    }

    /**
     * 校验工作量证明，以 4 个 0 开头的有效
     * 
     * @param {number} previous_proof - 上一区块的工作量证明
     * @param {number} proof - 当前工作量证明
     * @return {boolean}
     */
    static valid_proof (previous_proof, proof) {
        let guess = previous_proof + '' + proof
        
        let sha256 = crypto.createHash('sha256');
        sha256.update(guess);
        let guess_hash = sha256.digest('hex');

        return _.startsWith(guess_hash, '000');
    }

    proof_of_work_each (previous_proof, proof=0) {
        return BlockChain.valid_proof(previous_proof, proof);
    }

    proof_of_work (previous_proof) {
        let proof = 0;

        while (true) {
            let isValid = proof_of_work_each(previous_proof, proof);

            if (isValid) {
                break;
            }

            proof += 1;
        }

        return proof;
    }

    /**
     * 获取区块链末尾的区块
     */
    get last_block () {
        return _.last(this.chain);
    }

    /**
     * 创建新区块并加入区块链
     *
     * @param {number} proof - 工作量证明
     * @previous_hash {string} previous_hash - 上一区块的 hash
     * @return {object} 新区块
     */
    new_block (proof, previous_hash=null) {
        let block = {
            'index': _.size(this.chain) + 1,
            'timestamp': new Date(),
            'transactions': this.current_transactions,
            'proof': proof,
            'previous_hash': (previous_hash || this.hash(this.last_block))
        };

        // 重置交易列表
        this.current_transactions = [];

        this.chain.push(block);
        return block;
    }

    /**
     * 添加一笔新交易到交易列表中
     *
     * @param {string} sender - 发出人
     * @param {string} recipient - 接收人
     * @param {int} amount - 金额
     */
    new_transaction (sender, recipient, amount) {
        this.current_transactions.push({
            'sender': sender,
            'recipient': recipient,
            'amount': amount
        });

        return this.last_block['index'] + 1;
    }
}
