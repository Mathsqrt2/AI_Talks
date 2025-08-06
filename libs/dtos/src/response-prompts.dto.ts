import { IsOptional, IsString } from "class-validator";
import { SwaggerMessages } from "@libs/constants";
import { ApiProperty } from "@nestjs/swagger";

export class ResponsePromptsDto {

    @ApiProperty({ description: SwaggerMessages.responsePromptsDto.initialPromptDescription(), example: `Hello! How can I assist you today?` })
    @IsOptional()
    @IsString()
    public initialPrompt: string;

    @ApiProperty({ description: SwaggerMessages.responsePromptsDto.contextPromptDescription(), example: `Please make sure to keep the conversation concise.` })
    @IsOptional()
    @IsString()
    public contextPrompt: string;

    @ApiProperty({ description: SwaggerMessages.responsePromptsDto.contextPrompt1Description(), example: `The user is interested in scheduling an event.` })
    @IsOptional()
    @IsString()
    public contextPrompt1: string;

    @ApiProperty({ description: SwaggerMessages.responsePromptsDto.contextPrompt2Description(), example: `Focus on summarizing key points quickly.` })
    @IsOptional()
    @IsString()
    public contextPrompt2: string;
}