import { RegistrationDTO } from "./dto/registration.dto"

class User {

}



export default class AuthService {
    registration = async (dto: RegistrationDTO) => {
        const { email, password } = dto
    }
}