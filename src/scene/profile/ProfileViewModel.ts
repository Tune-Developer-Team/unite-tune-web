import Authentication, {AuthenticationArgumentIF} from "../../models/Authentication/Authentication";
import {ProfileViewModelIF} from "./ProfileViewModelIF";

export class ProfileViewModel implements ProfileViewModelIF {
    protected authState:Authentication = Authentication.initAuthentication();
    constructor(
    ) {
        console.log('====================SignInViewModel_called====================');
    }

    /**
     * セットアップ処理
     * @param argument
     */
    setUp(argument: { authentication: AuthenticationArgumentIF }): void {
        console.log('====================TimeLineViewModel_setup====================');
        this.authState.setAuthentication(argument.authentication);
        console.log('====================TimeLineViewModel_setup_end====================');
    }

    /**
     * クリーンアップ処理
     */
    cleanUp():void {
        console.log('cleanUp');
    }
}