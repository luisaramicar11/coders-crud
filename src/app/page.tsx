import {CoderService} from "../services/coders.service"
import CodersTable from "../coders/CodersTable"
import CreateForm from "@/coders/CodersForm"

const useCoderService = new CoderService()

export default async function Home() {
  const data= await useCoderService.findAll()
  console.log(data)
  return (
    <div>
      <CreateForm />
      <CodersTable data={data}/>
    </div>
  );
}
