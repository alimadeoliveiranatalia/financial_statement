import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
class CreateTransferUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository,
        @inject('TransfersRepository')
        private transfersRepository: ITransfersRepository
    ){ }
    async execute({ received_id, sender_id, amount, description }:ICreateTransferDTO){

        const received_user = await this.usersRepository.findById(received_id as string );

        if(!received_user){
            throw new CreateTransferError.UserNotFound();
        }
        const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

        if(balance < amount ){
            throw new CreateTransferError.InsufficientFunds();
        }

        const transferOperation = await this.transfersRepository.create({
            sender_id,
            amount,
            description,
        });
        return transferOperation;
    }
}
export { CreateTransferUseCase }