export enum LockType {
	Chat = 'chat',
}

export interface Lock {
	chatId: string;
	date: Date;
	type: LockType.Chat;
}
