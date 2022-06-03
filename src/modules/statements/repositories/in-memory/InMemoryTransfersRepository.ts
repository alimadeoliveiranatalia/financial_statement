import { Transfer } from "../../entities/Transfer";
import { ICreateTransferDTO } from "../../useCases/createTransfer/ICreateTransferDTO";
import { ITransfersRepository } from "../ITransfersRepository";

export class InMemoryTransfersRepository implements ITransfersRepository {
    private transfers: Transfer[] = [];

    async create(data: ICreateTransferDTO) : Promise<Transfer> {
        const transfer = new Transfer();

        Object.assign(transfer, data);

        this.transfers.push(transfer);

        return transfer;
    }
}