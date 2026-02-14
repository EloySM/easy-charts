import { ModeToggle } from "@/features/settings/components/mode-toggle";

export default function Page() {

  return (
    <div className="">

      <h1 className="text-2xl font-medium mb-4">Configuration</h1>

      <div className='border-3 rounded-2xl p-4'>
        <h1 className="mb-4">Apparence</h1>
        <ModeToggle/>
      </div>


    </div>
  )
}