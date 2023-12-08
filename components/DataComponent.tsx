import { sessionLog, writeEntries } from "@/app/backend/database";
import { Button } from "./ui/button";

export default function DataComponent(){
    return(
        <div>
            <Button>Write Data</Button>
        </div>
    )
}