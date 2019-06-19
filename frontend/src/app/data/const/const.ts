class ConstStatic {
    private isDebug = true;
    private lobbyUrl = 'http://172.16.1.198:8082';
    private lobbyUrlDebug = 'http://localhost:8082';
    private gameUrl = 'http://172.16.1.198:8081';
    private gameUrlDebug = 'http://localhost:8081';

    getLobbyUrl(): string {
        if (this.isDebug) {
            return this.lobbyUrlDebug;
        } else {
            return this.lobbyUrl;
        }
    }

    getGameUrl(): string {
        if (this.isDebug) {
            return this.gameUrlDebug;
        } else {
            return this.gameUrl;
        }
    }
}
export class Const {
    const: ConstStatic;

    constructor() {
        this.const = new ConstStatic();
    }
}
