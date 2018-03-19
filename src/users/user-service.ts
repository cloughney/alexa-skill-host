import * as fs from 'fs';
//import * as nano from 'nano';

export interface UserIntegration { [key: string]: string };

export interface User {
    amazonUid: string;
    name: string;
    integrations: { [name: string]: UserIntegration };
}

export default class UserService {
	private users: User[];
	private usersById: { [id: string]: User };

    public constructor() {
    	this.users = undefined;
    	this.usersById = undefined;
    }

    public getUserByAmazonId(id: string): Promise<User|undefined> {
    	const getUsers = new Promise(resolve => {
    		if (this.users === undefined) {
    			return Promise.resolve(this.users);
    		}

    		return this.getUsersFromFile().then(users => {
				this.users = users;
				this.usersById = {};
				users.forEach(x => this.usersById[x.amazonUid] = x);
			});
    	})

    	return getUsers.then(users =>
    		new Promise(resolve => {
	    		const user = this.usersById[id];
	    		user ? resolve(user) : resolve(undefined);
            });
        });
    }

    public saveUser(user: User): Promise<User> {
    	if (this.usersById[user.amazonUid]) {
    		return; //TODO this should update the user...
    	}

    	this.users.push(user);
    	this.usersById[user.amazonUid] = user;

        return new Promise((resolve, reject) => {
        	fs.writeFile('/usr/local/function-host/.users', JSON.stringify(this.users), err => {
        		err ? reject(err) : resolve(user);
        	});
        });
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