import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation User", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        createUserCase = new CreateUserUseCase(inMemoryUsersRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementRepository
        );
    });
    it("Should be able get statement operation", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Noah",
            email: "noah@email.com",
            password: "password"
        });
        const statement = await inMemoryStatementRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description:"Deposit"
        });
        const statement_operation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });
        expect(statement_operation).toHaveProperty("id");
    });
    it("Should not be statement operation a nonexistent user", () => {
        expect(async() => {
            const statement = await inMemoryStatementRepository.create({
                user_id: "userdotid",
                type: OperationType.DEPOSIT,
                amount: 3,
                description: 'deposit'
            });
            await getStatementOperationUseCase.execute({
                user_id: "ihj374$",
                statement_id:statement.id as string
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });
    it("Should not be able to list statement nonexistent operation", () => {
        expect(async() => {
            const user = await createUserCase.execute({
                name:"Noah",
                email:"noah@email.com",
                password:"noahpass"
            });
            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id:"kshdlandlkjk"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
});