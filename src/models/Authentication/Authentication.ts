export interface AuthenticationArgumentIF {
    accessToken: string;
    uid: string;
    email: string;
}

export default class Authentication {
    private constructor(
        public accessToken: string,
        protected uid: string,
        protected email: string
    ) {}

    public static fromState(state: AuthenticationArgumentIF): Authentication {
        return new Authentication(state.accessToken, state.uid, state.email);
    }

    public setAuthentication(argument: AuthenticationArgumentIF): void {
        this.accessToken = argument.accessToken;
        this.uid = argument.uid;
        this.email = argument.email;
    }

    public getUid(): string {
        if (!this.uid) throw new Error('UID is empty');
        return this.uid;
    }

    public getEmail(): string {
        if (!this.email) throw new Error('Email is empty');
        return this.email;
    }

    public getAccessToken(): string {
        if (!this.accessToken) throw new Error('Access token is empty');
        return this.accessToken;
    }
}
