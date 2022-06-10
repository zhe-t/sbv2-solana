import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleInitArgs {
  params: types.OracleInitParamsFields
}

export interface OracleInitAccounts {
  oracle: PublicKey
  oracleAuthority: PublicKey
  wallet: PublicKey
  programState: PublicKey
  queue: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.OracleInitParams.layout("params")])

export function oracleInit(args: OracleInitArgs, accounts: OracleInitAccounts) {
  const keys = [
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.wallet, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([21, 158, 66, 65, 60, 221, 148, 61])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.OracleInitParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}