import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";

interface ITransfersRepository {
    create({sender_id, amount, description }: ICreateTransferDTO) : Promise<Transfer>;
    getTransfersBalance(data: IGetBalanceDTO) : Promise<
    { balance: number } | { balance: number, transfer: Transfer[] }
    >;
}
export { ITransfersRepository }