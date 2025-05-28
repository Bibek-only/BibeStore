import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession();

  return (
    <div>
      <div>{JSON.stringify(session)}</div>
      <div>hello i am the applicaton</div>
      <Button>hello boy</Button>
    </div>
  )
}

export default page
