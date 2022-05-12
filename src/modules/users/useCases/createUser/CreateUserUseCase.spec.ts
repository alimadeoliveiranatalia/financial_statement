import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository;
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        
    });

    it("Should be able to create a new User", async () => {
        const user = await createUserUseCase.execute({
            name:'Natalia',
            email:'nath@hy.com',
            password:'12345'
        });
        expect(user).toHaveProperty("id");
    });
    it("Should not be possible to create a user with email exists", () => {
        expect(async () => {
            const user1 = await createUserUseCase.execute({
                name:'Diego',
                email:'diego@slim.com',
                password:'start_lord'
            });
            await createUserUseCase.execute({
                name:'Rodrigo',
                email:user1.email,
                password:'i_am_grout'
            });
        }).rejects.toBeInstanceOf(CreateUserError);
    });
});