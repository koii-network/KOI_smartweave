"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartWeaveGlobal = void 0;
const contract_read_1 = require("./contract-read");
/**
 *
 * This class is be exposed as a global for contracts
 * as 'SmartWeave' and provides an API for getting further
 * information or using utility and crypto functions from
 * inside the contracts execution.
 *
 * It provides an api:
 *
 * - SmartWeave.transaction.id
 * - SmartWeave.transaction.reward
 * - SmartWeave.block.height
 * - etc
 *
 * and access to some of the arweave utils:
 * - SmartWeave.arweave.utils
 * - SmartWeave.arweave.crypto
 * - SmartWeave.arweave.wallets
 * - SmartWeave.arweave.ar
 *
 * as well as access to the potentially non-deterministic full client:
 * - SmartWeave.unsafeClient
 *
 */
class SmartWeaveGlobal {
    constructor(arweave, contract) {
        this.unsafeClient = arweave;
        this.arweave = {
            ar: arweave.ar,
            utils: arweave.utils,
            wallets: arweave.wallets,
            crypto: arweave.crypto,
        };
        this.contract = contract;
        this.transaction = new Transaction(this);
        this.block = new Block(this);
        this.contracts = {
            readContractState: (contractId, height) => contract_read_1.readContract(arweave, contractId, height || (this._isDryRunning ? Number.POSITIVE_INFINITY : this.block.height)),
        };
    }
    get _isDryRunning() {
        return !this._activeTx;
    }
}
exports.SmartWeaveGlobal = SmartWeaveGlobal;
// tslint:disable-next-line: max-classes-per-file
class Transaction {
    constructor(global) {
        this.global = global;
    }
    get id() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.id;
    }
    get owner() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.owner.address;
    }
    get target() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.recipient;
    }
    get tags() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.tags;
    }
    get quantity() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.quantity.winston;
    }
    get reward() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.fee.winston;
    }
}
// tslint:disable-next-line: max-classes-per-file
class Block {
    constructor(global) {
        this.global = global;
    }
    get height() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.block.height;
    }
    get indep_hash() {
        if (!this.global._activeTx) {
            throw new Error('No current Tx');
        }
        return this.global._activeTx.block.id;
    }
}
