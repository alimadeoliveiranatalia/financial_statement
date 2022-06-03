import { OperationType } from "../../entities/Statement";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryTransfersRepository } from "../../repositories/in-memory/InMemoryTransfersRepository";
import { CreateTransferUseCase } from "./CreateTransferUseCase";
import { CreateTransferError } from "./CreateTransferError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryTransfersRepository: InMemoryTransfersRepository;
let createTransferUseCase: CreateTransferUseCase;

describe("Create Transfer", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryTransfersRepository = new InMemoryTransfersRepository();
        createTransferUseCase = new CreateTransferUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository,
            inMemoryTransfersRepository
        );
    });
    it("Should be able to create a new transfer", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "John",
            email: "john@email.com",
            password: "pass#john"
        });
        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Pix para pagamento"
        });
        const user_received = await inMemoryUsersRepository.create({
            name: "Marie",
            email: "marie@email.com",
            password: "pass#marie"
        });
        const transfer = await createTransferUseCase.execute({
            received_id: user_received.id as string,
            sender_id: user.id as string,
            amount: 30,
            description: "Pagamento p/ Marie"
        });
        expect(transfer).toHaveProperty("id");

    });
    it("Should not be able create a transfer for a nonexistent user", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "John Melo",
            email: "jmelo@email.com",
            password: "pass#melo"
        });
        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 200,
            description: "Pix para pagamento"
        });
        await expect(
            createTransferUseCase.execute({
                received_id: "hjkisnhv#",
                sender_id: user.id as string,
                amount: 30,
                description: "Pagamento p/ Stefanny"
            })
        ).rejects.toEqual(new CreateTransferError.UserNotFound) 
    });
    it("Should not be able to make a transfer if the account balance is less than the amount to be transferred", async () => {
        const user = await inMemoryUsersRepository.create({
            name: "Sofia Bianca",
            email: "sb@email.com",
            password: "pass#sf"
        });
        await inMemoryStatementsRepository.create({
            user_id: user.id as string,
            amount: 40,
            type: OperationType.DEPOSIT,
            description: "Pagamento Remédio"
        });
        const user_received = await inMemoryUsersRepository.create({
            name: "Doglas",
            email: "d@email.com",
            password: "pass#d"
        });
        await expect(
            createTransferUseCase.execute({
                received_id: user_received.id as string,
                sender_id: user.id as string,
                amount: 80,
                description: "Divida c/ Doglas"
            })
        ).rejects.toEqual(new CreateTransferError.InsufficientFunds)
    });
});