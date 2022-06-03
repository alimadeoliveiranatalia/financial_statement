import { getRepository, Repository } from "typeorm";
import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
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
    /*async findTransferById(id: string): Promise<Transfer> {
        return this.repository.findOne(id);
        
    }*/
}
export { TransfersRepository }