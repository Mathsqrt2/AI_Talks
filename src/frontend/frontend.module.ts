import { FrontendController } from "./frontend.controller";
import { FrontendService } from "./frontend.service";
import { Module } from "@nestjs/common";

@Module({
    controllers: [
        FrontendController,
    ],
    providers: [
        FrontendService,
    ]
})

export class FrontendModule { }