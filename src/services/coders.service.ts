import { ICoder } from "@/models/coder/coder.model";
import {HttpClient} from "../utils/client-http";
export class CoderService {
    private httpClient: HttpClient;

    constructor(){
        this.httpClient = new HttpClient();
    }

    async findAll(){
        try {
            const coders = await this.httpClient.get<ICoder[]>("coders")
            return coders;
        } catch (error) {
            console.log(error);
            throw(error)

        }
    }

    async destroy(id: string){
        try {
            const coders = await this.httpClient.delete<ICoder>(`coders/${id}`)
            return coders;
        } catch (error) {
            console.log(error);
            throw(error)

        }
    }

    async create(coder: ICoder){
        try {
            const newCoder = await this.httpClient.post<ICoder, ICoder>("coders", coder)
            return newCoder;
        } catch (error) {
            console.log(error);
            throw(error)

        }
    }

    async update(id: string, coder: ICoder){
        try {
            const updatedCoder = await this.httpClient.put<ICoder, ICoder>(`coders/${id}`, coder)
            return updatedCoder;
        } catch (error) {
            console.log(error);
            throw(error)

        }
    }
}