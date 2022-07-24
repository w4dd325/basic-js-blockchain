const sha256 = require("crypto-js/sha256");

class Block {
    //Items needed to create a block
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    //Hash all block items using sha256
    calculateHash() {
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        //Initialise an array with the genesis block
        this.chain = [this.createGenesisBlock()];
    }

    //Genesis block is the first block in the array, and should be manually added.
    createGenesisBlock() {
        return new Block(0, "01/01/2022", "Genesis block", "0");
    }

    //Returns the latest block in the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    //Push a new block to the chain
    addBlock(newBlock) {
        //Set previous hash property (hash of the last block)
        newBlock.previousHash = this.getLatestBlock().hash;
        //Get the hash of the current block
        newBlock.hash = newBlock.calculateHash();
        //Push to array
        this.chain.push(newBlock);
    }

    isChainValid() {
        //We need to loop entire block (array)
        //Start with 1 to ignor the genesis block
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //Check bloacks are linked
            //Check if the hash of the bloack is still valid
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            //Check that the 'previous hash' vlaue stored in the current block matches the hash of the previous block.
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            //If the for loop reaches the end then everything is as expected.
            return true;

        }
    }
}

//---------------------------------------------------------------

//Create a new instance of the blockchain
let myCoin = new BlockChain();

//Add new blocks to the blockchain
myCoin.addBlock(new Block(1, "23/07/2022", { amount: 4 }));
myCoin.addBlock(new Block(2, "24/07/2022", { amount: 10 }));

//---------------------------------------------------------------

//Output is the chain is valid...
//console.log('Is blockchain valid? ' + myCoin.isChainValid());

//---------------------------------------------------------------

//Display the blockchain
console.log(JSON.stringify(myCoin, null, 4));