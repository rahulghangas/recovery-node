export class CreateShare {
    address: string;
    hash: string;
    share: string;
}

export class GetShare {
    address: string;

    proof: {
        pi_a: any[];
        pi_b: any[][];
        pi_c: any[];
        protocol: any;
        curve: any;
    }

    public_signals: any[];
}