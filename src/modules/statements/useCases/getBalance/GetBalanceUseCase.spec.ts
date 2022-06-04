import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getUserBalanceUseCase: GetBalanceUseCase;

describe("Get Balance User", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getUserBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository,
            inMemoryUsersRepository);
    });
    it("Should be able to get user balance", async () => {
        const user = await inMemoryUsersRepository.create({
            name:'David',
            email:"david2email.com",
            password:'D@vi*3289'
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
        const user_balance = await getUserBalanceUseCase.execute({
            user_id: user.id as string });
            
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