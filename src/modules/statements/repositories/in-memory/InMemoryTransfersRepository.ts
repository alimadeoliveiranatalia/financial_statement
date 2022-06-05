import { Transfer } from "../../entities/Transfer";
import { ICreateTransferDTO } from "../../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { ITransfersRepository } from "../ITransfersRepository";

export class InMemoryTransfersRepository implements ITransfersRepository {
    private transfers: Transfer[] = [];

    async create(data: ICreateTransferDTO) : Promise<Transfer> {
        const transfer = new Transfer();

        Object.assign(transfer, data);

        this.transfers.push(transfer);

        return transfer;
    }
    async getTransfersBalance({user_id, with_statement = false}: IGetBalanceDTO): Promise<{ balance: number; } | { balance: number; transfer: Transfer[]; }> {
        const transfer = this.transfers.filter((operation) => operation.sender_id === user_id);
        const transfer_balance = transfer.reduce((acc, operation) => {
            return acc + operation.amount;
        }, 0 );
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