export class LinkedinProvider {
    clientId: any = '81alo9i368lt7t';
    clientSecret: any = 'zTQQz0BtaGBjv0g7';
    appScope: any = ['r_basicprofile', 'r_emailaddress'];
    grantType: any = 'authorization_code';
    redirectUri: any = 'http://localhost/callback';
    responseType: any = 'code';
    state: any = '987654321'
    urlAccessToken: any = 'https://www.linkedin.com/oauth/v2/accessToken';
    urlUserProfile: any = 'https://api.linkedin.com/v1/people/' +
    '~:(id,first-name,last-name,picture-url,public-profile-url,email-address)' +
    '?format=json';
    userProfile: any = {};

    setUserProfile(res: any) {
        this.userProfile = {
            'name': res.json().lastName + ' ' + res.json().firstName,
            'id': res.json().id,
            'email': res.json().emailAddress,
            'publicProfileUrl': res.json().publicProfileUrl,
            'uid': 'linkedif:' + res.json().id
        }
    }

    getUserProfile(): any {
        return this.userProfile;
    }

    getQueryString(what: any, res: any): string {
        let qStr: string;
        switch (what) {
            case 'access-token':
                qStr = this.urlAccessToken +
                    '?client_id=' + this.clientId +
                    '&client_secret=' + this.clientSecret +
                    '&grant_type=' + this.grantType +
                    '&redirect_uri=' + this.redirectUri +
                    '&code=' + res['code']
                break;
            case 'user-profile':
                qStr = this.urlUserProfile +
                    '&oauth2_access_token=' + res.json().access_token;
                break;
            default:
                break;
        }
        return qStr;
    }
}

export class FirebaseToken {
    urlRequestToken: any = 'https://firebase-token-server.appspot-preview.com/api/v1/';

    singIn(res: any, firebase: any, userProfile: any): any {
        let customToken = res.json().token;

        firebase.auth().signInWithCustomToken(customToken)
            .then((result) => {
                var user = firebase.auth().currentUser;

                user.updateProfile({
                    displayName: userProfile.name,
                    photoURL: userProfile.publicProfileUrl
                }).then(function () {
                    // Update successful.
                    user.updateEmail(userProfile.email).then(function () {
                        // Update successful.

                    }, function (error) {
                        // An error happened.

                    });
                }, function (error) {
                    // An error happened.

                });
            })
            .catch((error) => {

            });
    }

    getQueryString(what: any, res: any): string {
        let qStr: string;
        switch (what) {
            case '':
                qStr = this.urlRequestToken + 'token?uid=' + res.uid;
                break;
            default:
                break;
        }
        return qStr;
    }
}