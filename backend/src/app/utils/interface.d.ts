export interface createProduct {
	name: string;
	desc: string;
	value: number;
}
export interface updateProduct extends createProduct {}

export interface createUserDto {
	username: string;
	email: string;
	password: string;
}
export interface updateUserDto extends createUserDto {}

export interface createCategory {
	name: string;
}
export interface updateCategory extends createCategory {}
export interface loginData {
	email: string;
	password: string;
}
