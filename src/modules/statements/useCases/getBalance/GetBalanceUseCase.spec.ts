import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryTransfersRepository } from "../../repositories/in-memory/InMemoryTransfersRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryTransfersRepository: InMemoryTransfersRepository;
let getUserBalanceUseCase: GetBalanceUseCase;

describe("Get Balance User", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryTransfersRepository = new InMemoryTransfersRepository(),
        getUserBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository,
            inMemoryTransfersRepository
        );
    });
    it("Should be able to get user balance", async () => {
        const user = await inMemoryUsersRepository.create({
            name:'David',
            email:"david2email.com",
            password:'D@vi*3289'
        });
        const received_user = await inMemoryUsersRepository.create({
            name: "Maria",
            email:"maria@mail.com",
            password:"maria@pss"
        });
        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description:"Pagamento PIX"
        });
        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 40,
            description: "Remédio de Julhinha"
        });
        const transfer = await inMemoryTransfersRepository.create({
            received_id: received_user.id as string,
            sender_id: user.id as string,
            amount: 20,
            description:"Pagamento Perfume"
        });
        const user_balance = await getUserBalanceUseCase.execute({
            user_id: user.id as string });
        console.log(user_balance);
        //console.log(transfer);    
        expect(user_balance).toHaveProperty("statement");
    });
    it("Should not be able to get nonexistent user balance",() => {
        expect(async () => {
            await getUserBalanceUseCase.execute({
                user_id:"ifhgs#9"
            });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});