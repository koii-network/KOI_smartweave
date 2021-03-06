"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactRead = exports.interactWriteDryRunCustom = exports.interactWriteDryRun = exports.interactWrite = void 0;
const contract_load_1 = require("./contract-load");
const contract_read_1 = require("./contract-read");
const contract_step_1 = require("./contract-step");
const utils_1 = require("./utils");
/**
 * Writes an interaction on the blockchain.
 *
 * This simply creates an interaction tx and posts it.
 * It does not need to know the current state of the contract.
 *
 * @param arweave       an Arweave client instance
 * @param wallet        a wallet private key
 * @param contractId    the Transaction Id of the contract
 * @param input         the interaction input, will be serialized as Json.
 * @param tags          an array of tags with name/value as objects.
 * @param target        if needed to send AR to an address, this is the target.
 * @param winstonQty    amount of winston to send to the target, if needed.
 */
function interactWrite(arweave, wallet, contractId, input, tags = [], target = '', winstonQty = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const interactionTx = yield createTx(arweave, wallet, contractId, input, tags, target, winstonQty);
        const response = yield arweave.transactions.post(interactionTx);
        if (response.status !== 200)
            return null;
        return interactionTx.id;
    });
}
exports.interactWrite = interactWrite;
/**
 * This will load a contract to its latest state, and do a dry run of an interaction,
 * without writing anything to the chain.
 *
 * @param arweave       an Arweave client instance
 * @param wallet        a wallet private or public key
 * @param contractId    the Transaction Id of the contract
 * @param input         the interaction input.
 * @param tags          an array of tags with name/value as objects.
 * @param target        if needed to send AR to an address, this is the target.
 * @param winstonQty    amount of winston to send to the target, if needed.
 * @param myState       a locally-generated state variable
 */
function interactWriteDryRun(arweave, wallet, contractId, input, myState = {}, fromParam = {}, contractInfoParam = {}, tags = [], target = '', winstonQty = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const contractInfo = contractInfoParam || (yield contract_load_1.loadContract(arweave, contractId));
        const latestState = myState || (yield contract_read_1.readContract(arweave, contractId));
        const from = fromParam || (yield arweave.wallets.getAddress(wallet));
        const interaction = {
            input,
            caller: from,
        };
        const { height, current } = yield arweave.network.getInfo();
        const tx = yield createTx(arweave, wallet, contractId, input, tags, target, winstonQty);
        const ts = utils_1.unpackTags(tx);
        const dummyActiveTx = {
            id: tx.id,
            owner: {
                address: from,
            },
            recipient: tx.target,
            tags: ts,
            fee: {
                winston: tx.reward,
            },
            quantity: {
                winston: tx.quantity,
            },
            block: {
                height,
                id: current,
            },
        };
        contractInfo.swGlobal._activeTx = dummyActiveTx;
        return yield contract_step_1.execute(contractInfo.handler, interaction, latestState);
    });
}
exports.interactWriteDryRun = interactWriteDryRun;
/**
 * This will load a contract to its latest state, and do a dry run of an interaction,
 * without writing anything to the chain.
 *
 * @param arweave       an Arweave client instance
 * @param wallet        a wallet private or public key
 * @param contractId    the Transaction Id of the contract
 * @param input         the interaction input.
 * @param tags          an array of tags with name/value as objects.
 * @param target        if needed to send AR to an address, this is the target.
 * @param winstonQty    amount of winston to send to the target, if needed.
 * @param myState       a locally-generated state variable
 */
function interactWriteDryRunCustom(arweave, tx, contractId, input, myState = {}, fromParam = {}, contractInfoParam = {}, tags = [], target = '', winstonQty = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const contractInfo = contractInfoParam || (yield contract_load_1.loadContract(arweave, contractId));
        const latestState = myState || (yield contract_read_1.readContract(arweave, contractId));
        const from = fromParam;
        const interaction = {
            input,
            caller: from,
        };
        const { height, current } = yield arweave.network.getInfo();
        //const tx = await createTx(arweave, wallet, contractId, input, tags, target, winstonQty);
        const ts = utils_1.unpackTags(tx);
        const dummyActiveTx = {
            id: tx.id,
            owner: {
                address: from,
            },
            recipient: tx.target,
            tags: ts,
            fee: {
                winston: tx.reward,
            },
            quantity: {
                winston: tx.quantity,
            },
            block: {
                height,
                id: current,
            },
        };
        contractInfo.swGlobal._activeTx = dummyActiveTx;
        return yield contract_step_1.execute(contractInfo.handler, interaction, latestState);
    });
}
exports.interactWriteDryRunCustom = interactWriteDryRunCustom;
/**
 * This will load a contract to its latest state, and execute a read interaction that
 * does not change any state.
 *
 * @param arweave       an Arweave client instance
 * @param wallet        a wallet private or public key
 * @param contractId    the Transaction Id of the contract
 * @param input         the interaction input.
 * @param tags          an array of tags with name/value as objects.
 * @param target        if needed to send AR to an address, this is the target.
 * @param winstonQty    amount of winston to send to the target, if needed.
 */
function interactRead(arweave, wallet, contractId, input, tags = [], target = '', winstonQty = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const contractInfo = yield contract_load_1.loadContract(arweave, contractId);
        const latestState = yield contract_read_1.readContract(arweave, contractId);
        const from = wallet ? yield arweave.wallets.getAddress(wallet) : '';
        const interaction = {
            input,
            caller: from,
        };
        const { height, current } = yield arweave.network.getInfo();
        const tx = yield createTx(arweave, wallet, contractId, input, tags, target, winstonQty);
        const ts = utils_1.unpackTags(tx);
        const dummyActiveTx = {
            id: tx.id,
            owner: {
                address: from,
            },
            recipient: tx.target,
            tags: ts,
            fee: {
                winston: tx.reward,
            },
            quantity: {
                winston: tx.quantity,
            },
            block: {
                height,
                id: current,
            },
        };
        contractInfo.swGlobal._activeTx = dummyActiveTx;
        const result = yield contract_step_1.execute(contractInfo.handler, interaction, latestState);
        return result.result;
    });
}
exports.interactRead = interactRead;
function createTx(arweave, wallet, contractId, input, tags, target = '', winstonQty = '0') {
    return __awaiter(this, void 0, void 0, function* () {
        let interactionTx = yield arweave.createTransaction({ data: Math.random().toString().slice(-4) }, wallet);
        if (target && winstonQty && target.length && +winstonQty > 0) {
            interactionTx = yield arweave.createTransaction({
                data: Math.random().toString().slice(-4),
                target: target.toString(),
                quantity: winstonQty.toString(),
            }, wallet);
        }
        if (!input) {
            throw new Error(`Input should be a truthy value: ${JSON.stringify(input)}`);
        }
        if (tags && tags.length) {
            for (const tag of tags) {
                interactionTx.addTag(tag.name.toString(), tag.value.toString());
            }
        }
        interactionTx.addTag('App-Name', 'SmartWeaveAction');
        interactionTx.addTag('App-Version', '0.3.0');
        interactionTx.addTag('Contract', contractId);
        interactionTx.addTag('Input', JSON.stringify(input));
        yield arweave.transactions.sign(interactionTx, wallet);
        return interactionTx;
    });
}
