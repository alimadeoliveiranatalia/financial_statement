import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementRepository
        );
        
    });
    it("Should be able to create a new deposit", async () => {
        const user = await inMemoryUsersRepository.create({
            name:"Rafaela",
            email:"rafa@love.com",
            password:"admin"
        });
        const deposit = await createStatementUseCase.execute({
            user_id:user.id as string,
            type: OperationType.DEPOSIT,
            amount:40,
            description: "Description Test"
        });
        expect(deposit).toHaveProperty("id");
    });
    it("Should not be able to create a new deposit for nonexistent User", () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id:"ju&#kksm",
                type:OperationType.DEPOSIT,
                amount:12,
                description:"Description Deposit"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });
    it("Should be able a new withdraw", async () => {
        const user = await inMemoryUsersRepository.create({
            name:'Maria',
            email: "email@maria.com",
            password:"passMaria"
        });
        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 20,
            description: "Deposit"
        });
        const result = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 15,
            description: "Deposit"
        });
        expect(result).toHaveProperty("id");
    });
    it("Should not be able create a new deposit if the balance to insufficient", () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                name:"Osvaldo",
                email:"osvaldo2rt.com",
                password:"admin@Osvaldo"
            });
            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.DEPOSIT,
                amount: 20,
                description: "Deposit"
            });
            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.WITHDRAW,
                amount: 25,
                description: "WITHDRAW"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});