import * as fs from 'fs';
//import * as nano from 'nano';

export interface UserIntegration { [key: string]: string };

export interface User {
    amazonUid: string;
    name: string;
    integrations: { [name: string]: UserIntegration };
}

export default class UserService {
	private isUserFileLoaded: boolean;
	private users: User[];
	private usersById: { [id: string]: User };

    public constructor() {
    	this.isUserFileLoaded = false;
    	this.users = [];
    	this.usersById = {};
    }

    public async getUserByAmazonId(id: string): Promise<User|undefined> {
    	const users = await this.getUsers();

    	return new Promise<User|undefined>(resolve => {
    		const user = this.usersById[id];
    		user ? resolve(user) : resolve(undefined);
        });
    }

    public async saveUser(user: User): Promise<User> {
    	if (this.usersById[user.amazonUid]) {
    		throw new Error('not implemented'); //TODO this should update the user...
    	}

    	await this.getUsers();

    	this.users.push(user);
    	this.usersById[user.amazonUid] = user;

    	return new Promise<User>((resolve, reject) => {
        	fs.writeFile('/usr/local/function-host/.users', JSON.stringify(this.users), err => {
        		err ? reject(err) : resolve(user);
        	});
        });
    }

    private getUsers(): Promise<User[]> {
    	return this.isUserFileLoaded
    		? Promise.resolve(this.users)
    		: this.getUsersFromFile().then(x => this.users = x);
    }

    private getUsersFromFile(): Promise<User[]> {
    	return new Promise((resolve, reject) => {
    		fs.readFile('/usr/local/function-hosts/.users', (err, data) => {
    			err && err.code !== 'ENOENT'
    				? reject(err)
    				: resolve(JSON.parse(data.toString()) as User[]);
    		});
    	});
    }
}