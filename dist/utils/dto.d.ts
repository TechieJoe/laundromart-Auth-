export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    name?: string;
    email?: string;
    profilePicture?: string;
}
