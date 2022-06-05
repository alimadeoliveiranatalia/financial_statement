import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  user_id: string;
}

interface IResponse {
  statement: Statement[];
  transfer: Transfer[];
  balance: number;
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('TransferRepository')
    private transfersRepository: ITransfersRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new GetBalanceError();
    }

    const balance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true
    });

    return balance as IResponse;
  }
}
