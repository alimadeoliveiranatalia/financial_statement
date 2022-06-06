import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { ITransfersRepository } from "./ITransfersRepository";

class TransfersRepository implements ITransfersRepository {
    private repository: Repository<Transfer>;

    constructor(){
        this.repository = getRepository(Transfer);
    }
    
    async create({ sender_id, amount, description }: ICreateTransferDTO) : Promise<Transfer> {
       const transfer = this.repository.create({
           sender_id,
           amount,
           description
       });
       this.repository.save(transfer);
       return transfer;
    }

    async getTransfersBalance({ user_id, with_statement = false }: IGetBalanceDTO): Promise<{ balance: number; } | { balance: number; transfer: Transfer[]; }> {
        const transfer = await this.repository.find({
            where: { sender_id : user_id }
        });

        const transfer_balance = transfer.reduce((acc, operation) => {
            return acc + operation.amount;
        },0);

        const balance = transfer_balance;

        if(with_statement){
            return {
                transfer,
                balance
            }
        }
        return { balance }
    }
}
export { TransfersRepository }