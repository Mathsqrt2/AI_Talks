import { Controller, Get, Header } from "@nestjs/common";

@Controller(`ui`)
export class FrontendController {

    @Get()
    @Header(`Content-Type`, `text/html`)
    public async serveApplicationBuild(): Promise<string> {
        return ``;
    }

}