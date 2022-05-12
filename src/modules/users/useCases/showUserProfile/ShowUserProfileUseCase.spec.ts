import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
    beforeEach(async() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });
    it("Should be able show profile an User", async () => {
        const user = await inMemoryUsersRepository.create({
            name:'Iana',
            email:'email@iana.com',
            password:'I@n@'
        });
        
        const user_id = await showUserProfileUseCase.execute(user.id as string);
        
        expect(user_id).toHaveProperty("id");

    });
    it("Should not be able show profile an nonexistent User", () => {
        expect( async () => {
            await showUserProfileUseCase.execute('i#fhkt');
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });
});