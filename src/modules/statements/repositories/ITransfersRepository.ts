import { Transfer } from "../entities/Transfer";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";

interface ITransfersRepository {
    create({sender_id, amount, description }: ICreateTransferDTO) : Promise<Transfer>;
    //findTransferById(id: string ) : Promise<Transfer>;
}
export { ITransfersRepository }