import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { ContractInteractionResult } from './contract-step';
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
export declare function interactWrite(arweave: Arweave, wallet: JWKInterface | 'use_wallet', contractId: string, input: any, tags?: {
    name: string;
    value: string;
}[], target?: string, winstonQty?: string): Promise<string>;
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
export declare function interactWriteDryRun(arweave: Arweave, wallet: JWKInterface | 'use_wallet', contractId: string, input: any, myState?: any, fromParam?: any, contractInfoParam?: any, tags?: {
    name: string;
    value: string;
}[], target?: string, winstonQty?: string): Promise<ContractInteractionResult>;
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
export declare function interactWriteDryRunCustom(arweave: Arweave, tx: any, contractId: string, input: any, myState?: any, fromParam?: any, contractInfoParam?: any, tags?: {
    name: string;
    value: string;
}[], target?: string, winstonQty?: string): Promise<ContractInteractionResult>;
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
export declare function interactRead(arweave: Arweave, wallet: JWKInterface | 'use_wallet' | undefined, contractId: string, input: any, tags?: {
    name: string;
    value: string;
}[], target?: string, winstonQty?: string): Promise<any>;
