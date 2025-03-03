import {
    PrimaryGeneratedColumn,
    Column, Entity,
} from "typeorm";

@Entity()
export class State {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: `int` })
    conversation_id: number;

    @Column({ type: `boolean` })
    shouldContinue: boolean;

    @Column({ type: `boolean` })
    shouldSendToTelegram: boolean;

    @Column({ type: `boolean` })
    shouldDisplayResponse: boolean;

    @Column({ type: `boolean` })
    shouldLog: boolean;

    @Column({ type: `boolean` })
    isGeneratingOnAir: boolean;

    @Column({ type: `string`, length: 256 })
    lastResponderName: string;

    @Column({ type: `text` })
    enqueuedMessageContent: string;

    @Column({ type: `varchar`, length: 256 })
    enqueuedMessageAuthor: string;

    @Column({ type: `int` })
    currentMessageIndex: number;

    @Column({ type: `bigint` })
    created_at: number;
}