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
        return CryptoJS.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        //Initialise an array with the genesis block
        this.chain = [this.createGenesisBlock()];
    }

    //Genesis block is the first block in the array, and should be manually added.
    createGenesisBlock() {
        return new Block(0, "01/01/2022", "Genesis block", "0", "0");
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

//start at 1 to skip genesis block
let blockIndex = 1;
//Initialise new block on load
let myCoin = new BlockChain();
//console.debug("mycoin length = " + myCoin.chain.length);

function addBlockToChain() {
    //Grab timestamp
    let blockTimestamp = new Date().getTime();
    //Grab textarea data
    let blockData = document.getElementById("blockData").value;

    //Build new block
    myCoin.addBlock(new Block(blockIndex, blockTimestamp, { blockData }));
    //console.debug(JSON.stringify(myCoin, null, 4));

    //Output to the HTML page
    //document.getElementById("json").innerHTML = JSON.stringify(myCoin, null, 4);
    document.getElementById("json").innerHTML = JSON.stringify(myCoin, undefined, 4);

    //Increment blockIndex for next block
    blockIndex++;

    //---------------------------------------------------------------
    //Output is the chain is valid...
    //console.log('Is blockchain valid? ' + myCoin.isChainValid());
    //---------------------------------------------------------------
}