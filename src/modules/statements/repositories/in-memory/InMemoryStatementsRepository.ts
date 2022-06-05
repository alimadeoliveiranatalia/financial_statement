import { Statement } from "../../entities/Statement";
import { Transfer } from "../../entities/Transfer";
import { ICreateStatementDTO } from "../../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "../IStatementsRepository";

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = [];
  private transfers: Transfer[] = [];

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement();

    Object.assign(statement, data);

    this.statements.push(statement);

    return statement;
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(operation => (
      operation.id === statement_id &&
      operation.user_id === user_id
    ));
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[], transfer: Transfer[] }
    >
  {
    const statement = this.statements.filter(operation => operation.user_id === user_id);

    const transfer = this.transfers.filter(user => user.sender_id === user_id);

    const transfers_balance = transfer.reduce((acc, operation) => {
      if(operation.type === 'transfer'){
        return acc + operation.amount;
      }
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
