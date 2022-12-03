import { IsString } from "class-validator";

export class CreateShare {
    @IsString()
    address: string;

    @IsString()
    hash: string;

    @IsString()
    share: string;

    constructor(address: string, hash: string, share: string) {
        this.address = address;
        this.hash = hash;
        this.share = share;
    }
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

    constructor(address: string, proof: any, public_signals: any[]) {
        this.address = address;
        this.proof = proof;
        this.public_signals = public_signals;
    }
}