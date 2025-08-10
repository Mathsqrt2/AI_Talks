import { IsDefined, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class PromptsDto {

    @ApiProperty({ description: SwaggerMessages.promptsDto.initialPromptDescription(), example: `Hello! How can I assist you today?` })
    @IsDefined()
    @IsString()
    public initialPrompt: string;

    @ApiProperty({ description: SwaggerMessages.promptsDto.contextPromptDescription(), example: `Please make sure to keep the conversation concise.` })
    @IsDefined()
    @IsString()
    public contextPrompt: string;

    @ApiProperty({ description: SwaggerMessages.promptsDto.contextPrompt1Description(), example: `The user is interested in scheduling an event.` })
    @IsDefined()
    @IsString()
    public contextPrompt1: string;

    @ApiProperty({ description: SwaggerMessages.promptsDto.contextPrompt2Description(), example: `Focus on summarizing key points quickly.` })
    @IsDefined()
    @IsString()
    public contextPrompt2: string;

    @ApiProperty({ description: SwaggerMessages.promptsDto.summarizerPromptDescription(), example: `Please summarize the conversation so far in a concise manner.` })
    @IsDefined()
    @IsString()
    public summarizerPrompt: string;

    @ApiProperty({ description: SwaggerMessages.promptsDto.injectorPromptDescription(), example: `Please inject the following content into the conversation.` })
    @IsDefined()
    @IsString()
    public injectorPrompt: string;
}