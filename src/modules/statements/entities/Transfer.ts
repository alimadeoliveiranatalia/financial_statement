import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { User } from "../../users/entities/User";

export enum TransferOperation {
    TRANSFER = 'transfer'
}

@Entity("transfer")
class Transfer {
    @PrimaryGeneratedColumn('uuid')
    id?:string;

    @Column('uuid')
    sender_id: string;

    @ManyToOne(() => User, user => user.transfer)
    @JoinColumn({ name: 'sender_id'})
    user: User;

    @Column('decimal', { precision: 5, scale: 2})
    amount: number;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: TransferOperation })
    type: TransferOperation;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
        if(!this.type){
            this.type = TransferOperation.TRANSFER;
        }
    }
}
export { Transfer }