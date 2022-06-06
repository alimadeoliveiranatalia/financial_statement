import { Statement } from "../entities/Statement";
import { Transfer } from "../entities/Transfer";

export class BalanceMap {
  static toDTO({
    statement,
    transfer,
    balance}: { statement: Statement[], transfer: Transfer[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));
    const parsedTransfer = transfer.map(({
      sender_id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        sender_id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));
    
    return {
      statement: parsedStatement,
      transfer: parsedTransfer,
      balance: Number(balance)
    }
  }
}
