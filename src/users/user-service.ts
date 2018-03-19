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

    public getUserByAmazonId(id: string): Promise<User|undefined> {
    	return this.getUsers().then(users => new Promise<User|undefined>(resolve => {
    		const user = this.usersById[id];
    		user ? resolve(user) : resolve(undefined);
        }));
    }

    public saveUser(user: User): Promise<User> {
    	if (this.usersById[user.amazonUid]) {
    		throw new Error('not implemented'); //TODO this should update the user...
    	}

    	this.getUsers().then(users => {
    		this.users.push(user);
    		this.usersById[user.amazonUid] = user;
    	}).then(() => new Promise((resolve, reject) => {
        	fs.writeFile('/usr/local/function-host/.users', JSON.stringify(this.users), err => {
        		err ? reject(err) : resolve(user);
        	});
        }));
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
    				: resolve(JSON.parse(data) as User[]);
    		});
    	});
    }
}