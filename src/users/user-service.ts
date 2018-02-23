import * as nano from 'nano';

export interface UserIntegration { [key: string]: string };

export interface User {
    amazonUid: string;
    name: string;
    integrations: { [name: string]: UserIntegration };
}

export default class UserService {
    private readonly db: nano.DocumentScope<User>;

    public constructor() {
        const client = nano('http://localhost:5984') as nano.ServerScope;
        this.db = client.db.use('users');
    }

    public getUserByAmazonId(id: string): Promise<User> {
        return new Promise((resolve, reject) => {
           this.db.get(id, (err, user) => {
               err ? reject(err) : resolve(user);
            });
        });
    }

    public saveUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            this.db.insert(user, user.amazonUid, (err, body) => {
                err ? reject(err) : resolve(user);
            });
        });
    }
}