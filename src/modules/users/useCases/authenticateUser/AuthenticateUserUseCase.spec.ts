import { clear } from "console";
import auth from "../../../../config/auth";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User ", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });
    it("Should be able to Authenticate an User", async () => {
        const user : ICreateUserDTO = {
            name:'Natalia',
            email:'lia@ght.com',
            password:'admin'
        };

        await createUserUseCase.execute(user);

        auth.jwt.secret = user.password;

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

         
        expect(result).toHaveProperty("token");
    });
    it("Should not be able to authenticate an nonexistent User", () => {
        expect(async()=>{
            await authenticateUserUseCase.execute({
                email:'dark@gkl.com',
                password:'wet'
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
    it("Should not be to authenticate with incorrect password", async () => {
        expect(async() => {
            const user = await createUserUseCase.execute({
                name:'Fernanda',
                email:'fer@nanda.com',
                password:'fen@nda'
            });
            await authenticateUserUseCase.execute({
                email: user.email,
                password: '*#efg'
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});