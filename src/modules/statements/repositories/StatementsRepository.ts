import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { Transfer } from "../entities/Transfer";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;
  private transfer_repository: Repository<Transfer>;

  constructor() {
    this.repository = getRepository(Statement);
    this.transfer_repository = getRepository(Transfer);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[], transfer: Transfer[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const transfer = await this.transfer_repository.find({
      where: { sender_id: user_id }
    });

    const transfers_balance = transfer.reduce((acc, operation) => {
      return acc + operation.amount;
    }, 0);

    const statement_balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0);

    const balance = statement_balance - transfers_balance;

    if (with_statement) {
      return {
        statement,
        transfer,
        balance
      }
    }

    return { balance }
  }
}
